import { BootScene } from './scene'

const createGame = (config: Phaser.Types.Core.GameConfig = {}) => {
    return new Phaser.Game({
        parent: 'phaser',
        type: Phaser.AUTO,
        width: config.width,
        height: 600,
        scene: [BootScene],
        physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 2000 },
              debug: false
          }
        },
        backgroundColor: '#16181D'
    })
}

export default createGame
