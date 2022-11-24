import Phaser, { Types } from 'phaser'
const sky = require('./assets/sky.png')
const ground = require('./assets/platform.png')
const star = require('./assets/star.png')
const bomb = require('./assets/bomb.png')
const dude = require('./assets/dude.png')

export class BootScene extends Phaser.Scene {
  cursors: Types.Input.Keyboard.CursorKeys | null = null
  player: Types.Physics.Arcade.SpriteWithDynamicBody | null = null
  platforms: Phaser.Physics.Arcade.StaticGroup | null = null

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
    this.platforms = this.physics.add.staticGroup()

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.physics.add.collider(this.player, this.platforms);

    // let star = this.physics.add.sprite(400, 450, 'star');
    this.physics.add.collider(star, this.platforms);
    // this.physics.add.collider(this.player, star);

    this.cursors = this.input.keyboard.createCursorKeys();

    let timedEvent = this.time.addEvent({ delay: 700, callback: this.addStar, callbackScope: this, loop: true,  })
  }

  addStar() {
    const random = Phaser.Math.Between(0, 50)
    console.log('random', random)
    let star = this.physics.add.sprite(800 + random, 525, 'star');
    this.platforms && this.physics.add.collider(star, this.platforms);
    this.player && this.physics.add.overlap(this.player, star, this.gameOver, undefined, this)
    star.setVelocityX(-350)
    this.physics.world.on('worldbounds', (body: boolean, up: boolean, down: boolean, left: boolean) => {
      if (left) {
        console.log('destroyed')
        star.destroy()
      }
    })
  }

  gameOver() {
    this.add.text(350, 300, 'Game Over', { color: '#000000' })
  }

  update(time: number, delta: number): void {
    // if (this.cursors?.left.isDown) {
    //   this.player?.setVelocityX(-160);

    //   this.player?.anims.play('left', true);
    // }
    // else if (this.cursors?.right.isDown) {
    //   this.player?.setVelocityX(160);

    //   this.player?.anims.play('right', true);
    // }
    // else {
    //   this.player?.setVelocityX(0);

    //   this.player?.anims.play('turn');
    // }

    if (this.cursors?.up.isDown && this.player?.body.touching.down) {
      this.player?.setVelocityY(-600);
    }

    this.player?.anims.play('right', true);
  }
}
