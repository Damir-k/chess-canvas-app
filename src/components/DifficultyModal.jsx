import React from 'react';
import './DifficultyModal.css';

export const DifficultyModal = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Выберите сложность</h2>
        <div className="difficulty-buttons">
          <button 
            className="btn-easy"
            onClick={() => onSelect('easy')}
          >
            Лёгкая
          </button>
          <button 
            className="btn-medium"
            onClick={() => onSelect('medium')}
          >
            Средняя
          </button>
          <button 
            className="btn-hard"
            onClick={() => onSelect('hard')}
          >
            Сложная
          </button>
        </div>
      </div>
    </div>
  );
};