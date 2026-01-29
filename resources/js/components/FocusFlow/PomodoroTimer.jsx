import React, { useState, useEffect } from 'react';

const PomodoroTimer = ({ selectedTask, onTimerComplete }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work or break

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);

            // Timer completed
            if (mode === 'work') {
              const focusMinutes = 25; // Standard Pomodoro
              onTimerComplete(focusMinutes);
              alert('Focus session completed! Take a break.');
              setMode('break');
              setMinutes(5); // 5-minute break
            } else {
              setMode('work');
              setMinutes(25); // Back to work
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, onTimerComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  const formatTime = () => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-timer">
      <h2>Pomodoro Timer</h2>
      <div className="timer-display">
        {formatTime()}
      </div>
      <div className="timer-mode">
        {mode === 'work' ? 'Focus Time' : 'Break Time'}
      </div>
      <div className="timer-controls">
        <button
          className={`btn ${isActive ? 'btn-warning' : 'btn-success'}`}
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn-secondary" onClick={resetTimer}>
          Reset
        </button>
      </div>
      {selectedTask && (
        <div className="selected-task">
          Currently focusing on: <strong>{selectedTask.title}</strong>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
