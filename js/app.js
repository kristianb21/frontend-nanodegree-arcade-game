/** Welcome
 *
 */
/** Returns a random integer between min (included) and max (excluded)
 * Using Math.round() will give you a non-uniform distribution!
 * @param: {number} min - minium number to be returned
 * @param: {number} max - the max number the returned number will be less than
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var ctx = ctx;

/** Represents an enemy.
 * @constructor
 */
var Enemy = function() {
    // Set enemy positioned to a random track
    var track = getRandomInt(0,2);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Enemys run on 3 different y axis to instantiate tracks or their road way
    this.tracks = [60,150,230];
    this.x = 0;

    this.y = this.tracks[track];
    // Set enemy moving speed at random
    this.speed = getRandomInt(2,6);

};

/** Update the enemy's position, required method for game
 * @param: {number} dt - A time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // reset enemy's position after is crosses the board
    if (this.x > ctx.canvas.width) {
        this.x = -90;
        // Set enemy positioned to a random track
        var track = getRandomInt(0,3);
        this.y = this.tracks[track];
    }
    // Enemy keeps moving if player is still living or player has not won yet.
    if (player.alive && !player.win) {
        this.x = this.x + this.speed + 100 * dt;
    }
};

/** Draw the enemy on the screen, required method for game
 * @param: {Object} ctx - The canvas of the game.
 * @param: {Object} Resources - Represents publicly accessible functions
 * available to developers for resouces used throughout.
 */
Enemy.prototype.render = function(ctx, Resources) {
    // Draw enemy on canvas using its sprite img and its x and y values
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Set number of enemies that is desired for the challenge.
var number_of_enemies = 9;
// We'll place the Enemy objects in this array.
var allEnemies = [];
for (var i = 0; i <= number_of_enemies; i++) {
    allEnemies[i] = new Enemy();
}

/** Represents a player.
 * @constructor
 * @param: {number} x - Coordinate position on the x axis
 * @param: {number} y - Coordinate position on the y axis
 */
var Player = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.cuswidth = 65;
    this.cusheight = 80;
    this.x_pos = this.x + 100;
    this.y_pos = this.y + 100;
    this.alive = true;
    this.lives = 4;
    this.points = 0;
    this.gameovesr = false;
    this.win = false;

};

/** Reset the player's position */
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 390;
    if (this.lives > 1 && !this.win) {
        this.alive = true;
        this.lives--;
    } else {
        // Take last life and end game
        this.lives--;
        this.gameover = true;
    }
};

/** This function gets called after the player reaches the water.*/
Player.prototype.hitWater = function() {
    // Reset player to starting position
    this.x = 200;
    this.y = 390;
    // Water == GOOD so player gets 1 tiny point.
    this.points++;
};

/** This function checks if the player has came across any items.*/
Player.prototype.checkForItems = function() {

    for (var i = allItems.length - 1; i >= 0; i--) {
        // Check column if player is in same column and row
        if (!allItems[i].collected) {

            if (allItems[i].x >= this.x && (allItems[i].x < this.x + 90)) {
                // Check if player is in same row
               if (allItems[i].y <= this.y && this.y < allItems[i].y + 40 ) {
                    allItems[i].collected = true;
                    this.points += allItems[i].worth;
                }
            }
        }
    }
};


/** This function check the player's score, and sees if they've won. */
Player.prototype.checkScore = function() {
    if (this.points >= 50) {
        this.win = true;
    }
};

/** This functions reacts on player's current position, and runs functions that
 * are dependent of the player's current position
 */
Player.prototype.update = function() {
    this.checkCollisions();
    this.checkForItems();
    this.checkScore();
    // Check if player is currently in the water
    if (this.y <= -10) {
        this.hitWater();
    }
};

/** This function checks whether or not the player has crossed paths with an
 * enemy, resulting in a collision and the player losing a life and getting
 * resetted.
 */
Player.prototype.checkCollisions = function() {
    for (var i = allEnemies.length - 1; i >= 0; i--) {

        if ((allEnemies[i].x + 65 > this.x && allEnemies[i].x < this.x) && (allEnemies[i].y + 65 > this.y && allEnemies[i].y < this.y + 40)) {
            this.alive = false;
            this.reset();
            break;
        }
    }
};

/** This function draws the player, player's points, and win/lose message. */
Player.prototype.render = function(ctx, Resources) {
    // Draw enemy on canvas using its sprite img and its x and y values
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Draw player's lives.
    ctx.font = "48px serif";
    ctx.fillText('Lives: ' + this.lives, 35, 550);
    ctx.fillText('Points: ' + this.points, 300, 550);
    ctx.fillStyle = 'white';

    if (this.gameover) {
        // Draw GAMEOVER.
        ctx.font = "54px serif";
        ctx.fillText('GAME OVER!', 100, 460);
        ctx.fillStyle = 'white';
    }
    if (this.win) {
        // Draw Player Wins.
        ctx.font = "54px serif";
        ctx.fillText('YOU WIN!', 100, 460);
        ctx.fillStyle = 'white';
    }

};

/** Move player on screen depending on key pressed.
 * @param: {string}  - Represents the direction the player will move.
 * @param: {object}  - The canvas where the player is being rendered on.
 */
Player.prototype.handleInput = function(move, ctx) {
    // Player can move as far as the canvas height and width
    if (!this.gameover && !this.win) {
        switch(move) {
            case 'up':
                if (this.y - 60 > 0) {
                    this.y = this.y - 80;
                }    else if (this.y - 30 > 0) {
                    this.y = this.y - 80;
                }
                break;

            case 'down':
                if (this.y + 250 < ctx.canvas.height) {
                    this.y = this.y + 80;
                }
                break;

            case 'right':
                if (this.x + 105 < ctx.canvas.width) {
                    this.x = this.x + 101;
                }
                break;

            case 'left':
                if (this.x - 90 >= 0) {
                    this.x = this.x - 101;
                }
                break;
        }
    }
};

/** Define our player with its initial position on the game board/canvas. */
var player = new Player(200,390);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode], ctx);
});

/** This function is the declaration for collectable items. */
var Item = function(sprite, worth) {

    var column = getRandomInt(0,5);
    var track = getRandomInt(0,2);

    this.sprite = sprite;

    // Draw on same tracks/cells as enemy to make collecting these items semi-challenging
    var tracks = [50,140,220];
    var columns = [105,205,305,405,505];

    this.x = columns[column];
    this.y = tracks[track];

    this.collected = false;
    this.worth = worth;
};

/** This function draws an item on the game. */
Item.prototype.render = function(ctx, Resources) {
    // Only draw item if it has not been collected by the player
    if (!this.collected) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

/** Define collectable items */
var key = new Item('images/key.png', 20);
var star = new Item('images/star.png', 10);
var gem_green = new Item('images/gem-green.png', 10);
var gem_blue = new Item('images/gem-blue.png', 10);
var gem_orange = new Item('images/gem-orange.png', 10);
var heart = new Item('images/heart.png', 10);

/** Collect collectable items */
var allItems = [key, star, gem_green, gem_blue, gem_orange, heart];