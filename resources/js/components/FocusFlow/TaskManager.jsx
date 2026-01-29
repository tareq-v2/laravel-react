import React, { useState } from 'react';
import axios from 'axios';

const TaskManager = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post('/focus-flows', {
        title,
        description,
        priority
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      onTaskAdded();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="task-manager">
      <button
        className="btn btn-primary add-task-btn"
        onClick={() => setIsAdding(!isAdding)}
      >
        {isAdding ? 'Cancel' : '+ Add Task'}
      </button>

      {isAdding && (
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success">
            Add Task
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskManager;
