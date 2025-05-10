import { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

const VirtualKeyboard = ({ isVisible, onClose, onKeyPress, targetInput }) => {
  const [shiftActive, setShiftActive] = useState(false);
  const [layout] = useState({
    default: [
      ["՛", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "՜"],
      ["ճ", "շ", "չ", "պ", "ջ", "ռ", "ս", "վ", "տ", "ր", "ծ", "ժ"],
      ["ք", "ո", "ե", "րտ", "թ", "փ", "ը", "ի", "օ", "պ", "խ", "ծ"],
      ["ա", "ս", "դ", "ֆ", "գ", "հ", "յ", "կ", "լ", "ձ", "ղ", "ֆ"],
      ["⇧", "զ", "ց", "ւ", "է", "բ", "ն", "մ", ",", ".", "՚", "⌫"],
      [" ", "⏎"]
    ],
    shift: [
      ["՜", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "՛"],
      ["Ճ", "Շ", "Չ", "Պ", "Ջ", "Ռ", "Ս", "Վ", "Տ", "Ր", "Ծ", "Ժ"],
      ["Ք", "Ո", "Ե", "ՐՏ", "Թ", "Փ", "Ը", "Ի", "Օ", "Պ", "Խ", "Ծ"],
      ["Ա", "Ս", "Դ", "Ֆ", "Գ", "Հ", "Յ", "Կ", "Լ", "Ձ", "Ղ", "Ֆ"],
      ["⇧", "Զ", "Ց", "Ւ", "Է", "Բ", "Ն", "Մ", "<", ">", "՛", "⌫"],
      [" ", "⏎"]
    ]
  });

  const handleClose = () => {
    onClose();
    setShowKeyboard(false);
    setTitleCheckbox(false);
    setDescCheckbox(false);
    setKeyboardTarget(null);
    if (targetInput) targetInput.blur();
  };

  const handleKeyClick = useCallback((key) => {
    if (!targetInput) return;
    targetInput.focus();

    const input = targetInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const value = input.value;

    switch(key) {
      case '⇧':
        setShiftActive(!shiftActive);
        break;
      case '⌫':
        onKeyPress(value.substring(0, start - 1) + value.substring(end));
        input.setSelectionRange(start - 1, start - 1);
        break;
      case '⏎':
        onKeyPress(value.substring(0, start) + '\n' + value.substring(end));
        input.setSelectionRange(start + 1, start + 1);
        break;
      case ' ':
        onKeyPress(value.substring(0, start) + ' ' + value.substring(end));
        input.setSelectionRange(start + 1, start + 1);
        break;
      default:
        onKeyPress(value.substring(0, start) + key + value.substring(end));
        input.setSelectionRange(start + key.length, start + key.length);
    }
  }, [targetInput, shiftActive, onKeyPress]);

 useEffect(() => {
  const handleClickOutside = (e) => {
    if (isVisible && 
        !e.target.closest('.virtual-keyboard-container') && 
        !e.target.closest('.keyboard-toggle') &&
        !e.target.closest('[data-armenian-input]')) { // Add this line
      handleClose();
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isVisible, targetInput]);

  if (!isVisible) return null;

  return (
    <div className="virtual-keyboard-container shadow-lg p-3 rounded" 
         style={{ 
           backgroundColor: '#2d2d2d',
           color: 'white',
           border: '1px solid #404040'
         }}>
      <div className="d-flex justify-content-end mb-2">
        <button 
          onClick={handleClose} 
          className="btn btn-sm btn-danger"
          style={{
            padding: '5px 10px',
            borderRadius: '5px'
          }}
        >
          <FaTimes />
        </button>
      </div>
      
      {(shiftActive ? layout.shift : layout.default).map((row, i) => (
        <div key={i} className="d-flex justify-content-center mb-2">
          {row.map((key, j) => (
            <button
              key={`${i}-${j}`}
              className={`mx-1`}
              style={{
                backgroundColor: shiftActive && key === '⇧' ? '#2450a0' : '#3d3d3d',
                color: 'white',
                border: '1px solid #505050',
                borderRadius: '5px',
                padding: '8px 12px',
                minWidth: '50px',
                margin: '2px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4d4d4d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = shiftActive && key === '⇧' ? '#2450a0' : '#3d3d3d'}
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      <style jsx>{`
        .virtual-keyboard-container {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          min-width: 800px;
        }
        
        .btn-danger:hover {
          background-color: #dc3545;
          border-color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default VirtualKeyboard;