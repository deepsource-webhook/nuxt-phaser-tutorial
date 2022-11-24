import Phaser, { Types } from 'phaser'
const star = require('./assets/star.png')
const norris = require('./assets/Norris.png')

export class BootScene extends Phaser.Scene {
  cursors: Types.Input.Keyboard.CursorKeys | null = null
  player: Types.Physics.Arcade.SpriteWithDynamicBody | null = null

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({
      ...config,
      key: 'default'
    })
  }

  preload() {
    // Add norris
    this.load.spritesheet('norris',
      norris,
      { frameWidth: 57, frameHeight: 70 }
    );

    // Bug
    this.textures.addBase64('star', star);
  }

  create() {
    // this.physics.world.setBoundsCollision(true, false, true, false)

    // Add player
    this.player = this.physics.add.sprite(100, 450, 'norris');

    // Set player bounce when colliding
    this.player.setBounce(0.2);

    // Set player collision with world
    this.player.setCollideWorldBounds(true);

    // Animate norris to run
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('norris', { start: 1, end: 3 }),
      frameRate: 12,
      repeat: -1
    });

    // Initiate cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add a bug every 700 ms
    this.addStar()
    // let timedEvent = this.time.addEvent({ delay: 700, callback: this.addStar, callbackScope: this, loop: true,  })
  }

  addStar() {
    let star = this.physics.add.sprite(Number(this.game.config.width) - 10, 600, 'star');
    star.setCollideWorldBounds(true)
    star.setVelocityX(-350)

    this.player && this.physics.add.overlap(this.player, star, this.gameOver, undefined, this)

    setTimeout(() => {
      this.addStar()
    }, Phaser.Math.Between(500, 1500))
  }

  gameOver() {
    this.add.text(350, 300, 'Game Over', { color: '#000000' })
  }

  update(): void {
    if (this.cursors?.up.isDown && this.player?.body.bottom === this.physics.world.bounds.bottom) {
      this.player?.setVelocityY(-600);
    }

    this.player?.anims.play('right', true);
  }
}
