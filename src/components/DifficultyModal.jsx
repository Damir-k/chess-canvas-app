import React, { useEffect, useRef } from 'react';
import './DifficultyModal.css';
import { RemoteDialog } from './RemoteDialog';

export const DifficultyModal = ({ isOpen, onSelect, ready = true, error = false }) => {
  const first = useRef(null);
  useEffect(() => { if (isOpen && ready) first.current?.focus(); }, [isOpen, ready]);
  if (!isOpen) return null;

  return (
    <RemoteDialog open={isOpen} title="Выберите сложность">
        {!ready && <p role="status">{error ? 'Не удалось загрузить движок. Перезапустите приложение.' : 'Загрузка шахматного движка…'}</p>}
        {error && <button data-autofocus onClick={() => window.location.reload()}>Перезапустить</button>}
        <div className="difficulty-buttons">
          <button 
            data-autofocus
            ref={first}
            disabled={!ready}
            className="btn-easy"
            onClick={() => onSelect('easy')}
          >
            Лёгкая
          </button>
          <button 
            className="btn-medium"
            disabled={!ready}
            onClick={() => onSelect('medium')}
          >
            Средняя
          </button>
          <button 
            className="btn-hard"
            disabled={!ready}
            onClick={() => onSelect('hard')}
          >
            Сложная
          </button>
        </div>
    </RemoteDialog>
  );
};
