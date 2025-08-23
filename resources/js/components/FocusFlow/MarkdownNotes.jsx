import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownNotes = ({ selectedTask, onNotesSave }) => {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    if (selectedTask) {
      setNotes(selectedTask.notes || '');
      setIsEditing(true);
    }
  }, [selectedTask]);

  const handleSave = () => {
    if (selectedTask) {
      onNotesSave(notes);
      setIsEditing(false);
    }
  };

  if (!selectedTask) {
    return (
      <div className="markdown-notes">
        <h2>Notes</h2>
        <p>Select a task to add notes</p>
      </div>
    );
  }

  return (
    <div className="markdown-notes">
      <h2>Notes for: {selectedTask.title}</h2>

      <div className="notes-actions">
        <button
          className={`btn ${isEditing ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className="btn btn-success"
          onClick={handleSave}
          disabled={!isEditing}
        >
          Save
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes here (Markdown supported)"
          className="notes-textarea"
          rows="10"
        />
      ) : (
        <div className="notes-preview">
          <ReactMarkdown>{notes}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownNotes;
