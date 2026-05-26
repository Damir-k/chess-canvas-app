import React from 'react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
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
    }
  }

  getTitle() {
    const {gameState} = this.props
    switch (gameState) {
      case "player-won": return "Победа!"; 
      case "player-lost": return "Поражение!"; 
      case "tie": return "Ничья!";
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
    }
  }

  render() {
    const {gameState, onGameOverChoice} = this.props;
    let isOpen = gameState !== "in-progress" && gameState !== "viewing-game"

    return (
      <>  
        <Dialog open={isOpen} onClose={() => onGameOverChoice("return")}>
          <div className="gameover-container">
            <DialogPanel className="gameover-panel">
              <DialogTitle>{this.getTitle()}</DialogTitle>
              <Description className="gameover-description">{this.getDescription()}</Description>
              <p>Хотите посмотреть на доску ещё раз?</p>
              <div className="gameover-buttons">
                <button onClick={() => onGameOverChoice("return")}>Вернуться к доске</button>
                <button onClick={() => onGameOverChoice("restart")}>Начать с начала</button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    )
  }
}