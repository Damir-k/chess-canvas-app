import React from 'react';
import './HelpSidebar.css';

const HelpSidebar = () => {
  return (
    <div className="help-sidebar">
      <div className="sidebar-title">Подсказки</div>
      <div className="command-item">
        <span className="command-shortcut">Начать сначала</span>
        <span className="command-desc">Скажите "По новой"</span>
      </div>

      <div className="command-item">
        <span className="command-shortcut">Формат</span>
        <span className="command-desc">"e2 e4" — откуда и куда</span>
      </div>
      
      <div className="command-item">
        <span className="command-shortcut">Отмена хода</span>
        <span className="command-desc">Скажите "Верни ход"</span>
      </div>
    </div>
  );
};

export default HelpSidebar;