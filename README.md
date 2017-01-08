# Space Missile Invader Command 3000

Space Missile Invader Command 3000 (also known as SMIC3k) is an asymmetrical 2-player game where two players play against each other. It is an homage to classic 70s/80s arcade games on platforms such as the Atari 2600 or the Commodore 64, taking game design inspirations from games such as Missile Command, Space Invaders, and Tetris (which we unfortunately couldn't fit into the name).

One player's goal is to survive, while the other player's goal is to kill the other. Player 1 (the Shooter) controls a stationary turret in the middle of the field, which automatically fires bullets regularly. Player 2 (the Runner) attempts to survive for as long as possible, grabbing powerups to gain points and speed. A point is gained for every bullet that the Shooter (Player 1) fires. The Runner (Player 2) aims to get the highest score possible before his demise; Conversely, the other player (Shooter 1) aims to kill the Runner (!Player 1) with the lowest score possible.

Shooters can view the score as a sort of index for how mediocre a player you are, while Runners can take comfort in the fact that you can run, but you will never escape the inevitable nothingness of the cold embrace of death.

## Getting Started

To get SMIC3k running on your local machine, clone this repository and run index.html. All frameworks, libraries, fonts and assets are stored within this repo. No CDNs were used in the making of this project.

Alternatively, you can go [here](http://wekkit.github.io/wdi-7-project-1-wekkit) to play the game.

### Prerequisites

No installation required - However, it can be argued that a working keyboard, screen and speakers are supplemental to the experience.

### Rules of the game

Player Shooter (1) uses the mouse to rotate and aim where to shoot, which happens automatically at a regular interval. This interval increases over time, responding to the frustration of not being able to achieve one's goals.

The Runner (2p) uses the arrow keys to move across the play area. Picking up powerups awards additional points and increases their movement speed for a short period of time, which can be used to get out of bad situations, or taunt the other player mercilessly.

There are three types of bullets that Player 1 Shoots:
* Regular bullets move in a straight line, and out of the field. If Player 2 Runs into them, he dies, and the game is over. This is generally inadvisable.
* Powerups add 10 points to the score, and increase the Runner's movement speed as well as decrease their size for a few seconds. They bounce from the boundaries of the play area, so feel free not to chase after them immediately.
* Bouncers increase the Shooter's rate of fire for a few seconds. They also bounce across the play area, because I had to make the gameplay more interesting and couldn't think of a name for them.

You can see the bullets that are going to be shot from the Tetris-style preview on the top-left corner of the play area. Player 1 can use this to create strategies to bait the Runner, and if they're really desperate, Player 2 could hide underneath it to confuse the Gunner.

## Live Version

To quote myself:
> Alternatively, you can go [here](http://wekkit.github.io/wdi-7-project-1-wekkit) to play the game.

## Built With

This game was built with:
* [Phaser](http://phaser.io/)

That's it! It's not a terribly complicated game.

A fantastic retro-style emoji font by [Monica Dinculescu](https://meowni.ca/) was used, found [here](https://meowni.ca/posts/og-emoji-font/).

Music and sound effects were from an 8-bit sound pack/EP by [AfroDJMac](http://www.afrodjmac.com/), available [here](http://www.afrodjmac.com/blog/2014/01/06/super-8-bit-ableton-pack-now-available).

## Workflow

No design preparation was done before development on this project, but the concept of player assymetry was an anchor for the ideation of this game.

Art assets, simple and rudimentary as they were, were drawn in Adobe Illustrator for some reason.

## Acknowledgments

This was my first project using Phaser, and [this tutorial](http://www.lessmilk.com/tutorial/2d-platformer-phaser) was a great starting point for learning how to use Phaser.