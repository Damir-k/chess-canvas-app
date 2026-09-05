import React from 'react';
import './HelpSidebar.css';

const HelpSidebar = () => (
  <aside className="help-sidebar" aria-labelledby="help-title">
    <span className="help-kicker">ИГРАЙТЕ ГОЛОСОМ</span>
    <h2 id="help-title">Просто скажите</h2>
    <p className="help-intro">Салют сделает ход за вас. Назовите клетку, откуда идёт фигура, и куда её поставить.</p>
    <div className="command-list">
      <div className="command-item"><span className="command-shortcut">Сделать ход</span><span className="command-phrase">«e2 e4»</span><span className="command-desc">Откуда → куда</span></div>
      <div className="command-item"><span className="command-shortcut">Отменить ход</span><span className="command-phrase">«Верни ход»</span><span className="command-desc">Вернуться к прошлой позиции</span></div>
      <div className="command-item"><span className="command-shortcut">Начать сначала</span><span className="command-phrase">«По новой»</span><span className="command-desc">Новая партия с Салютом</span></div>
    </div>
    <p className="help-footer">Можно и вручную: перетащите фигуру на нужную клетку.</p>
  </aside>
);
export default HelpSidebar;
