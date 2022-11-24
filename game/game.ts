import { BootScene } from './scene'

const createGame = (config: Phaser.Types.Core.GameConfig = {}) =>
    new Phaser.Game({
        parent: 'phaser',
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [BootScene],
        physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 2000 },
              debug: false
          }
        },
        backgroundColor: '#f3f4f6',
        // physics: {
        //     default: 'arcade',
        //     arcade: {
        //         gravity: { y: 500 },
        //     },
        // },
        // render: {
        //     pixelArt: true
        // },
        // ...config,
    })

export default createGame
