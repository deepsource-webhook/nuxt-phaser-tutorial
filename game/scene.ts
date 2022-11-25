import Phaser, { Types } from 'phaser'
const norris = require('./assets/Norris.png')
const bug = require('./assets/bug.png')

export class BootScene extends Phaser.Scene {
  cursors: Types.Input.Keyboard.CursorKeys | null = null
  player: Types.Physics.Arcade.SpriteWithDynamicBody | null = null
  canvas: {
    width: number,
    height: number
  } = {
      width: 800,
      height: 600
    }
  timedEvent: Phaser.Time.TimerEvent | null = null
  scoreEvent: Phaser.Time.TimerEvent | null = null
  scoreText: Phaser.GameObjects.Text | null = null
  highScoreText: Phaser.GameObjects.Text | null = null
  score: number = 0
  bugSpeed = -900
  jumpHeight = -800
  intervalStart = 700
  intervalEnd = 1200

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({
      ...config,
      key: 'default'
    })
  }

  preload() {
    this.canvas = {
      width: Number(this.game.config.width),
      height: Number(this.game.config.height)
    }

    // Add norris
    this.load.spritesheet('norris',
      norris,
      { frameWidth: 57, frameHeight: 70 }
    );

    // Bug
    this.textures.addBase64('bug', bug);
  }

  create() {
    // this.physics.world.setBoundsCollision(true, false, true, false)

    // Add player
    this.player = this.physics.add.sprite(this.canvas.width * 0.30, this.canvas.height, 'norris')
      .setScale(1.5)
      .refreshBody();

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

    this.physics.world.on('worldbounds', function (body: any, up: boolean, down: boolean, left: boolean, right: boolean) {
      if (left) {
        console.log('is left')
        body.gameObject.destroy()
      }
    });

    // Add a bug every 700 ms
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.addBug, callbackScope: this});
    this.scoreEvent = this.time.addEvent({ delay: 1, callback: this.incrementScore, callbackScope: this, loop: true});
  
    this.scoreText = this.add.text(this.canvas.width / 2, this.canvas.height / 4, `Score: ${this.score}`, { color: '#ffffff', fontSize: '2rem' }).setOrigin(0.5, 0.5)

    if (localStorage.getItem('high')) {
      this.highScoreText = this.add.text(this.canvas.width / 2, this.canvas.height / 12, `Best: ${localStorage.getItem('high')}`, { color: '#ffffff', fontSize: '1.1rem' }).setOrigin(0.5, 0.5)
    }
  }

  incrementScore() {
    this.score++

    if (this.score % 1000 === 0) {
      this.bugSpeed -= 20
      this.intervalEnd -= 100
    }

    this.scoreText?.setText(`Score: ${this.score}`)
  }

  addBug() {
    const bug = this.physics.add.sprite(this.canvas.width - 35, this.canvas.height, 'bug')
      .setScale(0.2)
      .refreshBody()

    bug.setCollideWorldBounds(true)
    bug.body.onWorldBounds = true
    console.log('speed', this.bugSpeed)
    bug.setVelocityX(this.bugSpeed)

    this.player && this.physics.add.overlap(this.player, bug, this.gameOver, undefined, this)

    console.log('end', this.intervalEnd)
    this.timedEvent?.reset({ delay: Phaser.Math.Between(this.intervalStart, this.intervalEnd), callback: this.addBug, callbackScope: this, repeat: 1});
  }

  update(): void {
    if (this.cursors?.up.isDown && this.player?.body.bottom === this.physics.world.bounds.bottom) {
      this.player?.setVelocityY(this.jumpHeight);
    }

    this.player?.anims.play('right', true);

    let keyObj = this.input.keyboard.addKey('ENTER');  // Get key object
    if (keyObj.isDown && this.player?.active === false) {
      this.scene.restart()
    }
  }

  gameOver() {
    const currentHighScore = localStorage.getItem('high')

    if (!currentHighScore || Number(currentHighScore) < this.score) {
      localStorage.setItem('high', String(this.score))
      this.scoreText?.setText(`New High Score: ${this.score}`)
    }
    
    this.score = 0

    this.highScoreText?.destroy()
    this.timedEvent?.destroy()
    this.scoreEvent?.destroy()
    this.player?.setActive(false).setVisible(false);
    
    let allSprites = this.children.list.filter(x => x instanceof Phaser.GameObjects.Sprite && x.active == true);
    allSprites.forEach(x => x.destroy());

    this.add.text(this.canvas.width / 2, this.canvas.height / 2.5, 'Game Over', { color: '#ffffff', fontSize: '5rem' }).setOrigin(0.5, 0.5)
    this.add.text(this.canvas.width / 2, this.canvas.height / 1.5, 'Press ENTER to restart', { color: '#ffffff', fontSize: '2rem' }).setOrigin(0.5, 0.5)
    // this.scene.pause()
  }
}
