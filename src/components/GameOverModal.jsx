import React from 'react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import './GameOverModal.css'

export class GameOverModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  getDifficulty() {
    const {difficulty} = this.props
    switch (difficulty) {
      case "easy": return "Лёгкий";
      case "normal": return "Средний";
      case "hard": return "Сложный";
      default: return "Неизвестный";
    }
  }

  getTitle() {
    const {gameState} = this.props
    switch (gameState) {
      case "player-won": return "Победа!"; 
      case "player-lost": return "Поражение!"; 
      case "tie": return "Ничья!";
      default: return "";
    }
  }

  getDescription() {
    const {gameState} = this.props
    switch (gameState) {
      case "player-won": 
        return "Вы молодец! Вы смогли превзойти компьютер на уровне сложности: " + this.getDifficulty() + "."  ;
      case "player-lost": 
        return "Ничего страшного, ведь вы можете попробовать ещё раз!"; 
      case "tie": 
        return "Считается, что идеальная партия в шахматы всегда заканчивается ничьёй.";
      default: return "";
    }
  }

  handleClose = () => {
    this.props.onGameOverChoice("return");
  }

  handleRestart = () => {
    this.props.onGameOverChoice("restart");
  }

  render() {
    const {gameState, onGameOverChoice} = this.props;
    let isOpen = gameState !== "in-progress" && gameState !== "viewing-game";

    // Проверяем, что isOpen - булево значение
    console.log('GameOverModal - isOpen:', isOpen, 'gameState:', gameState);

    return (
      <Dialog open={isOpen} onClose={this.handleClose}>
        <div className="gameover-container">
          <DialogPanel className="gameover-panel">
            <DialogTitle>{this.getTitle()}</DialogTitle>
            <Description className="gameover-description">{this.getDescription()}</Description>
            <p>Хотите посмотреть на доску ещё раз?</p>
            <div className="gameover-buttons">
              <button onClick={this.handleClose}>Вернуться к доске</button>
              <button onClick={this.handleRestart}>Начать с начала</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    )
  }
}