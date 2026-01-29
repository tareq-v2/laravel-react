import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import TaskManager from './TaskManager';
import PomodoroTimer from './PomodoroTimer';
import MarkdownNotes from './MarkdownNotes';
import './FocusFlowDashboard.css';

const FocusFlowDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/focus-flows');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for responsive UI
    setTasks(items);

    // Update order in backend
    try {
      const updatedTasks = items.map((task, index) => ({
        id: task.id,
        order: index,
        user_id: task.user_id
      }));

      await axios.patch('/focus-flows/update-order', {
        tasks: updatedTasks
      });
    } catch (error) {
      console.error('Error updating task order:', error);
      // Revert on error
      fetchTasks();
    }
  };

  if (loading) {
    return <div className="loading">Loading your focus tasks...</div>;
  }

  return (
    <div className="focus-flow-dashboard">
      <h1>FocusFlow Dashboard</h1>
      <div className="dashboard-grid">
        <div className="task-section">
          <h2>Tasks</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-item ${task.priority} ${task.completed ? 'completed' : ''}`}
                          onClick={() => setSelectedTask(task)}
                        >
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          <span className="priority-badge">{task.priority}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <TaskManager onTaskAdded={fetchTasks} />
        </div>

        <div className="tools-section">
          <PomodoroTimer
            selectedTask={selectedTask}
            onTimerComplete={(minutes) => {
              if (selectedTask) {
                // Update focus time for the task
                axios.patch(`/focus-flows/${selectedTask.id}`, {
                  focus_time: selectedTask.focus_time + minutes
                }).then(fetchTasks);
              }
            }}
          />

          <MarkdownNotes
            selectedTask={selectedTask}
            onNotesSave={(notes) => {
              if (selectedTask) {
                axios.patch(`/focus-flows/${selectedTask.id}`, {
                  notes
                }).then(fetchTasks);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FocusFlowDashboard;
