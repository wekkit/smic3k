/*global Phaser*/
'use strict'
console.log('---- hello world ----')

// misc functions
const getRandomSelector = () => Math.floor(Math.random()*100)

const getRandomColor = function() {
  if (Math.random() < 0.1) return '#001100'
  else return '#111111'
}

// dom
const scoreText = document.getElementById('scoreText')
const overlay = document.getElementsByClassName('overlay')
const phaserWidth = document.getElementById('phaser').offsetWidth
const splashScreen = document.getElementById('splash')
const startButton = document.getElementById('start-btn')
const settingsButton = document.getElementById('settings-btn')
const settingsScreen = document.getElementById('settings')
const backButton = document.getElementById('back-btn')
const speedSetting = document.getElementById('speedSetting')
const speedSettingUp = document.getElementById('speedSettingUp')
const speedSettingDown = document.getElementById('speedSettingDown')
const shootSetting = document.getElementById('shootSetting')
const shootSettingUp = document.getElementById('shootSettingUp')
const shootSettingDown = document.getElementById('shootSettingDown')
const powerupSetting = document.getElementById('powerupSetting')
const powerupSettingUp = document.getElementById('powerupSettingUp')
const powerupSettingDown = document.getElementById('powerupSettingDown')
const bouncerSetting = document.getElementById('bouncerSetting')
const bouncerSettingUp = document.getElementById('bouncerSettingUp')
const bouncerSettingDown = document.getElementById('bouncerSettingDown')

const firstSlot = document.getElementById('first-slot')
const secondSlot = document.getElementById('second-slot')
const thirdSlot = document.getElementById('third-slot')
const fourthSlot = document.getElementById('fourth-slot')
const slotArray = [firstSlot,secondSlot,thirdSlot,fourthSlot]

// audio
const bulletSound = new Audio('assets/sounds/bulletshot.wav')
const deathSound = new Audio('assets/sounds/death.wav')
const powerupSound = new Audio('assets/sounds/powerupshot.wav')
const powerupGainSound = new Audio('assets/sounds/powerupgain.wav')
const bouncerSound = new Audio('assets/sounds/bouncershot.wav')
const bouncerGainSound = new Audio('assets/sounds/bouncergain.wav')
const bgMusic = new Audio('assets/sounds/bg.mp3')
bgMusic.loop = true

// internal game variables
let gameOngoing = true,
  bulletCounter = 0,
  timerIncrease = 0.98,
  bulletVelocity = 225,
  points = 0,
  bulletFreq = 50,
  powerupsOnScreen = 0,
  bouncersOnScreen = 0,
  shots = []

// settings-adjustable variables
let acceleration = 30,
  maxVelocity = 250,
  initBulletFreq = 50,
  powerupChance = 90,
  bouncerChance = 10,
  powerupLimit = 5,
  bouncerLimit = 5

// splash screen
startButton.addEventListener('click', function() {
  gameOngoing = true
  splashScreen.style.opacity = 0
  for (let i = 0; i < overlay.length; i++) {
    overlay[i].style.opacity = 0
  }
  powerupGainSound.play()
  game.state.start('main')
  setTimeout(() => splashScreen.style.display = 'none', 500)
})

settingsButton.addEventListener('click', function() {
  settingsScreen.style.display = 'flex'
  powerupSound.play()
})

backButton.addEventListener('click', function() {
  settingsScreen.style.display = 'none'
  powerupSound.play()
})

// settings
const setting = function(direction, type) {
  if (direction === 'up') {
    if (type.innerHTML === 'HIGH') return
    else if (type.innerHTML === 'LOW') type.innerHTML = 'MEDIUM'
    else if (type.innerHTML === 'MEDIUM') type.innerHTML = 'HIGH'
    if (type === speedSetting) {
      acceleration += 10
      maxVelocity += 50
    } else if (type === shootSetting) {
      initBulletFreq += -15
      timerIncrease += 0.01
    } else if (type === powerupSetting) {
      powerupChance += -5
      powerupLimit += 1
    } else if (type === bouncerSetting) {
      bouncerChance += 5
      bouncerLimit += 1
    }
  }
  if (direction === 'down') {
    if (type.innerHTML === 'LOW') return
    else if (type.innerHTML === 'HIGH') type.innerHTML = 'MEDIUM'
    else if (type.innerHTML === 'MEDIUM') type.innerHTML = 'LOW'
    if (type === speedSetting) {
      acceleration += -10
      maxVelocity += -50
    } else if (type === shootSetting) {
      initBulletFreq += 15
      timerIncrease += -0.01
    } else if (type === powerupSetting) {
      powerupChance += 5
      powerupLimit += 1
    } else if (type === bouncerSetting) {
      bouncerChance += -5
      bouncerLimit += 1
    }
  }
  powerupSound.play()
  // console.log('acceleration:', acceleration, ', bullet freq:', initBulletFreq, ' powerupChance:', powerupChance, ', bouncerChance:', bouncerChance)
}

speedSettingUp.addEventListener('click', function() {
  setting('up', speedSetting)
})
speedSettingDown.addEventListener('click', function() {
  setting('down', speedSetting)
})
shootSettingUp.addEventListener('click', function() {
  setting('up', shootSetting)
})
shootSettingDown.addEventListener('click', function() {
  setting('down', shootSetting)
})
powerupSettingUp.addEventListener('click', function() {
  setting('up', powerupSetting)
})
powerupSettingDown.addEventListener('click', function() {
  setting('down', powerupSetting)
})
bouncerSettingUp.addEventListener('click', function() {
  setting('up', bouncerSetting)
})
bouncerSettingDown.addEventListener('click', function() {
  setting('down', bouncerSetting)
})

// init
const game = new Phaser.Game(phaserWidth,500, Phaser.CANVAS, 'phaser')

for (let i = 0; i < overlay.length; i++) {
  overlay[i].style.opacity = 0
}

settingsScreen.style.display = 'none'
bgMusic.play()

// gamestate
const mainState = {
  preload: function() {
    game.load.image('player1', 'assets/img/player1.png')
    game.load.image('player2', 'assets/img/player2.png')
    game.load.image('wall', 'assets/img/wall.png')
    game.load.image('bullet', 'assets/img/bullet.png')
    game.load.image('powerup', 'assets/img/powerup.png')
    game.load.image('bouncer', 'assets/img/bouncer.png')
    game.load.image('lava', 'assets/img/wall.png')
    game.load.image('background','assets/img/background.png')
    game.load.image('overlay','assets/img/overlay.png')
  },

  shootBullet: function() {
    this.bullet = game.add.sprite(phaserWidth/2+8,258,'bullet')
    bulletSound.pause()
    bulletSound.currentTime = 0
    bulletSound.play()
    this.physics.arcade.enable(this.bullet)
    this.bullets.add(this.bullet)
    this.bullet.anchor.setTo(.5,.5)
    this.bullet.outOfCameraBoundsKill = true
    this.bullet.autoCull = true
    this.game.physics.arcade.moveToPointer(this.bullet,bulletVelocity)
  },

  shootPowerup: function() {
    this.powerup = game.add.sprite(phaserWidth/2+8,258,'powerup')
    powerupsOnScreen++
    powerupSound.play()
    this.physics.arcade.enable(this.powerup)
    this.powerup.anchor.setTo(.5,.5)
    this.powerups.add(this.powerup)
    this.powerup.body.collideWorldBounds = true
    this.powerup.body.bounce.x = 0.75
    this.powerup.body.bounce.y = 0.75
    this.game.physics.arcade.moveToPointer(this.powerup,bulletVelocity)
  },

  shootBouncer: function() {
    this.bouncer = game.add.sprite(phaserWidth/2+8,258, 'bouncer')
    bouncerSound.play()
    bouncersOnScreen++
    this.physics.arcade.enable(this.bouncer)
    this.bouncers.add(this.bouncer)
    this.bouncer.body.collideWorldBounds = true
    this.bouncer.body.bounce.x = 0.75
    this.bouncer.body.bounce.y = 0.75
    this.bouncer.anchor.setTo(.5,.5)
    this.game.physics.arcade.moveToPointer(this.bouncer, bulletVelocity)
  },

  empowerShooter: function(player, powerup) {
    bouncersOnScreen--
    powerup.kill()
    bouncerGainSound.play()
    bulletFreq += -9
    setTimeout(()=> bulletFreq += 9, 2000)
  },

  empowerPlayer: function(player, powerup) {
    powerupGainSound.play()
    powerupsOnScreen--
    maxVelocity += 100
    acceleration += 20
    player.scale.x += -0.1
    player.scale.y += -0.1
    points += 10
    scoreText.innerHTML = 'The score is '+ points
    powerup.kill()
    setTimeout(function() {
      maxVelocity += -100
      acceleration += -20
      player.scale.x += 0.1
      player.scale.y += 0.1
    }, 2000)
  },

  player2Hit: function(player, bullet) {
    player.kill()
    bullet.kill()
    deathSound.play()
    gameOngoing = false
  },

  restart: function() {
    scoreText.innerHTML = 'Game Over! Final score is ' + points
    bgMusic.pause()
    bgMusic.currentTime = 0
    bulletCounter = 0
    bulletFreq = initBulletFreq
    points = 0
    powerupsOnScreen = 0
    bouncersOnScreen = 0
    setTimeout(function() {
      bgMusic.play()
      splashScreen.style.display = 'flex'
      setTimeout(()=> splashScreen.style.opacity = 1, 100)
      for (let i = 0; i < overlay.length; i++) {
        overlay[i].style.opacity = 0
      }
    }, 3000)
  },

  create: function() {
    // enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.world.enablebody = true

    for (let i = 0; i < overlay.length; i++) {
      overlay[i].style.opacity = 1
    }

    bulletFreq = initBulletFreq

    // populate shot preview
    for (let i = 0; i < 4; i++) {
      shots[i] = getRandomSelector()
    }

    // keyboard input
    this.cursor = game.input.keyboard.createCursorKeys()

    // background
    game.stage.backgroundColor = getRandomColor()

    // create groups for bullets/powerups etc.
    this.bullets = game.add.group()
    this.powerups = game.add.group()
    this.bouncers = game.add.group()

    // ready player one
    this.player1 = game.add.sprite(phaserWidth/2 + 10,260, 'player1')
    this.player1.anchor.setTo(0.3,0.5)
    this.physics.arcade.enable(this.player1)
    this.player1.body.immovable = true

    // ready player two
    this.player2 = game.add.sprite(phaserWidth/2 + 10,100, 'player2')
    this.player2.anchor.setTo(0.5,0.5)
    this.physics.arcade.enable(this.player2)
    this.player2.body.collideWorldBounds = true
    this.player2.body.bounce.x = 1.5
    this.player2.body.bounce.y = 1.5

    // green overlay
    this.overlay = game.add.sprite(0,0,'overlay')
    this.overlay.scale.y = document.getElementById('phaser').offsetHeight / this.overlay._frame.height
    this.overlay.scale.x = document.getElementById('phaser').offsetWidth / this.overlay._frame.width
    this.overlay.alpha = 0.15
  },

  update: function() {
    // background flicker
    game.stage.backgroundColor = getRandomColor()

    // bouncer rotation
    if (this.bouncers) {
      for (let i = 0; i < this.bouncers.children.length; i++) {
        this.bouncers.children[i].body.rotation += 10
      }
    }

    // player 2 movement
    if (this.player2.body.velocity.x < maxVelocity && this.player2.body.velocity.x > -maxVelocity) {
      if (this.cursor.right.isDown) {
        this.player2.body.velocity.x += acceleration
      } else if (this.cursor.left.isDown) {
        this.player2.body.velocity.x += -acceleration
      }
    }
    if (this.player2.body.velocity.y < maxVelocity && this.player2.body.velocity.y > -maxVelocity) {
      if (this.cursor.up.isDown) {
        this.player2.body.velocity.y += -acceleration
      } else if (this.cursor.down.isDown) {
        this.player2.body.velocity.y += acceleration
      }
    }
    this.player2.body.velocity.x -= this.player2.body.velocity.x/30
    this.player2.body.velocity.y -= this.player2.body.velocity.y/30

    // player 1 rotation to face cursor
    this.player1.body.rotation = game.physics.arcade.angleToPointer(this.player1) * 180/Math.PI

    // populate preview
    for (let i = 0; i < slotArray.length; i++) {
      if (shots[i] > powerupChance && powerupsOnScreen <= powerupLimit) slotArray[i].innerHTML = '<img src="assets/img/powerup-preview.png"></img>'
      else if (shots[i] < bouncerChance && bulletFreq > 9 && bouncersOnScreen <= bouncerLimit) slotArray[i].innerHTML = '<img src="assets/img/bouncer-preview.png"></img>'
      else slotArray[i].innerHTML = '<img src="assets/img/bullet.png"></img>'
    }

    // update counter
    bulletCounter++
    // condition for shoot
    if (bulletCounter > bulletFreq && gameOngoing) {
      if (shots[0] > powerupChance && powerupsOnScreen <= powerupLimit) this.shootPowerup()
      else if (shots[0] < bouncerChance && bouncersOnScreen <= bouncerLimit && bulletFreq > 9 ) this.shootBouncer()
      else this.shootBullet()

      shots[0] = shots[1]
      shots[1] = shots[2]
      shots[2] = shots[3]
      shots[3] = getRandomSelector()

      points++
      scoreText.innerHTML = 'The score is ' + points

      if (bulletFreq > 10) bulletFreq = bulletFreq*timerIncrease

      bulletCounter = 0
    }

    // collision detection
    game.physics.arcade.collide(this.player1, this.player2)
    game.physics.arcade.overlap(this.player2, this.powerups, this.empowerPlayer)
    game.physics.arcade.overlap(this.player2, this.bouncers, this.empowerShooter)
    game.physics.arcade.overlap(this.player2, this.bullets, this.restart)
    game.physics.arcade.overlap(this.player2, this.bullets, this.player2Hit)
  }
}
game.state.add('main', mainState)