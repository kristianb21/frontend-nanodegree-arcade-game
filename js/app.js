// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    var obj = Object.create(Enemy.prototype);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    obj.sprite = 'images/enemy-bug.png';

    // Enemys run on 3 different y axis to instantiate tracks or their road way
    obj.tracks = [60,150,230];
    obj.x = x;
    track = getRandomInt(0,2);
    obj.y = obj.tracks[track];
    obj.speed = getRandomInt(2,6);

    return obj;

}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // reset enemy's position after is crosses the board
    if (this.x > ctx.canvas.width) {
        this.x = -90;

        track = getRandomInt(0,3);
        this.y = this.tracks[track];
    }
    // Enemy keeps moving if player is still living or player has not won yet.
    if (player.alive && !player.win) {
        this.x = this.x + this.speed+ 100 * dt;
    }

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
/* Create enemy object
 * params: x,y,speed
 */
var enemy01 = Enemy(0,60, 6);
var enemy02 = Enemy(0,150, 6);
var enemy03 = Enemy(0,230,1);
var enemy04 = Enemy(0,60, 6);
var enemy05 = Enemy(0,150, 6);
var enemy06 = Enemy(0,230,1);
var enemy07 = Enemy(0,230,1);
var enemy08 = Enemy(0,230,1);
var enemy09 = Enemy(0,230,1);
allEnemies = [
    enemy01,
    enemy02,
    enemy03,
    enemy04,
    enemy05,
    enemy06,
    enemy07,
    enemy08,
    enemy09,
]
// The Player
var Player = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    var obj = Object.create(Player.prototype);
    obj.sprite = 'images/char-boy.png';
    obj.x = x;
    obj.y = y;
    obj.cuswidth = 65;
    obj.cusheight = 80;
    obj.x_pos = this.x + 100;
    obj.y_pos = this.y + 100;
    obj.alive = true;
    obj.lives = 4;
    obj.points = 0;
    obj.gameovesr = false;
    obj.win = false;

    return obj;
}

// Reset the player's position
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
}

// This function gets called after the player reaches the water.
Player.prototype.hitWater = function() {
    // Reset player to starting position
    this.x = 200;
    this.y = 390;
    // Water == GOOD so player gets 1 tiny point.
    this.points++;
}


// Check if player has came across any items.
Player.prototype.checkForItems = function() {
    var itemX,
        itemY;
    allItems.forEach(function(item){
        // Check column if player is in same column and row
        if(!item.collected){

            if(item.x >= player.x && (item.x < player.x + 90)){
                // Check if player is in same row
               if(item.y <= player.y && !(player.y > item.y + 40)){
                    item.collected = true;
                    player.points += item.worth;
                }
            }
        }
    });
}


/* This function check the player's score, and sees if they've won. */
Player.prototype.checkScore = function() {
    if(player.points >= 50) {
        player.win = true;
    }
}

// Call functions that reacts based on player's current position
Player.prototype.update = function() {
    this.checkForItems();
    this.checkScore();
    if(player.y <= -10){
        this.hitWater();
    }
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Draw player's lives.
    ctx.font = "48px serif";
    ctx.fillText('Lives: ' + this.lives, 35, 550);
    ctx.fillText('Points: ' + this.points, 300, 550);
    ctx.fillStyle = 'white';

    if(this.gameover){
        // Draw GAMEOVER.
        ctx.font = "54px serif";
        ctx.fillText('GAME OVER!', 100, 460);
        ctx.fillStyle = 'white';
    }
    if(this.win){
        // Draw GAMEOVER.
        ctx.font = "54px serif";
        ctx.fillText('YOU WIN!', 100, 460);
        ctx.fillStyle = 'white';
    }

}

// Move player on screen depending on key pressed.
Player.prototype.handleInput = function(move) {
    // Player can move as far as the canvas height and width
    if(!this.gameover && !this.win){
        switch(move){
            case 'up':
                if (this.y - 60 > 0) {
                    this.y = this.y - 80;
                }    else if(this.y - 30 > 0){
                    this.y = this.y - 80;
                }
                break;

            case 'down':
                if (this.y + 250 < ctx.canvas.height) {
                    this.y = this.y + 80;
                };
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
    console.log(this.x + ',' + this.y);

}

var player = Player(200,390);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Item Object,
var Item = function(sprite,worth) {

    var obj = Object.create(Item.prototype);
    obj.sprite = sprite;

    // Draw on same tracks/cells as enemy to make collecting these items semi-challenging
    obj.tracks = [50,140,220];
    obj.columns = [105,205,305,405,505];
    column = getRandomInt(0,5);
    obj.x = obj.columns[column];
    track = getRandomInt(0,2);
    obj.y = obj.tracks[track];

    obj.collected = false;
    obj.worth = worth;

    return obj;
}

// Draw the item on the screen
Item.prototype.render = function() {
    // Only draw item if it has not been collected by the player
    if(!this.collected){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Define collectable items
var key = Item('images/Key.png', 20);
var star = Item('images/star.png', 10);
var gem_green = Item('images/Gem Green.png', 10);
var gem_blue = Item('images/Gem Blue.png', 10);
var gem_orange = Item('images/Gem Orange.png', 10);
var heart = Item('images/Heart.png', 10);

var allItems = [
    key,
    star,
    gem_green,
    gem_blue,
    gem_orange,
    heart,
];
