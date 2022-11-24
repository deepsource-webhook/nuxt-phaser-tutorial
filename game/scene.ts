import Phaser, { Types } from 'phaser'
const sky = require('./assets/sky.png')
const ground = require('./assets/platform.png')
const star = require('./assets/star.png')
const bomb = require('./assets/bomb.png')
const dude = require('./assets/dude.png')

export class BootScene extends Phaser.Scene {
    cursors!: Types.Input.Keyboard.CursorKeys

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super({
            ...config,
            key: 'default',
        })
    }

    preload() {
      this.load.image('sky', sky);
      this.load.image('ground', ground);
      this.textures.addBase64('bomb', bomb);
      this.textures.addBase64('star', star);
      this.load.spritesheet('dude', 
          dude,
          { frameWidth: 32, frameHeight: 48 }
      );    
    }

    create() {
      this.add.image(400, 300, 'sky');

      let platforms = this.physics.add.staticGroup()

      platforms.create(400, 568, 'ground').setScale(2).refreshBody();

      platforms.create(600, 400, 'ground');
      platforms.create(50, 250, 'ground');
      platforms.create(750, 220, 'ground');
    }

    update(time: number, delta: number): void {
      
    }
}
