const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const bgCastle = new Image();
const castle = new Image();
const castleCenter = new Image();
const castleLeft = new Image();
const castleMid = new Image();
const castleRight = new Image();
const p1Spritesheet = new Image();

bgCastle.src = 'bg_castle.png';
castle.src = 'castle.png';
castleCenter.src = 'castleCenter.png';
castleLeft.src = 'castleLeft.png';
castleMid.src = 'castleMid.png';
castleRight.src = 'castleRight.png';
p1Spritesheet.src = 'p1_spritesheet.png';

// Player sprite data
const playerSprites = {
    duck: { x: 365, y: 98, width: 69, height: 71 },
    front: { x: 0, y: 196, width: 66, height: 92 },
    hurt: { x: 438, y: 0, width: 69, height: 92 },
    jump: { x: 438, y: 93, width: 67, height: 94 },
    stand: { x: 67, y: 196, width: 66, height: 92 },
    walk: [
        { x: 0, y: 0, width: 72, height: 97 },
        { x: 73, y: 0, width: 72, height: 97 },
        { x: 146, y: 0, width: 72, height: 97 },
        { x: 0, y: 98, width: 72, height: 97 },
        { x: 73, y: 98, width: 72, height: 97 },
        { x: 146, y: 98, width: 72, height: 97 },
        { x: 219, y: 0, width: 72, height: 97 },
        { x: 292, y: 0, width: 72, height: 97 },
        { x: 219, y: 98, width: 72, height: 97 },
        { x: 365, y: 0, width: 72, height: 97 },
        { x: 292, y: 98, width: 72, height: 97 }
    ]
};

let player = {
    x: 100,
    y: 300,
    width: 66,
    height: 92,
    frame: 0,
    speed: 5,
    dx: 0,
    dy: 0,
    jumping: false,
    ducking: false,
    walking: false
};

function drawPlayer() {
    let sprite;
    if (player.jumping) {
        sprite = playerSprites.jump;
    } else if (player.ducking) {
        sprite = playerSprites.duck;
    } else if (player.walking) {
        sprite = playerSprites.walk[player.frame];
    } else {
        sprite = playerSprites.stand;
    }

    ctx.drawImage(p1Spritesheet, sprite.x, sprite.y, sprite.width, sprite.height, player.x, player.y, sprite.width, sprite.height);
}

function updatePlayer() {
    player.frame = (player.frame + 1) % playerSprites.walk.length;
    player.x += player.dx;
    player.y += player.dy;

    if (player.jumping) {
        player.dy += 0.5; // Gravity
        if (player.y >= 300) {
            player.jumping = false;
            player.dy = 0;
            player.y = 300;
        }
    }

    if (player.ducking) {
        player.width = playerSprites.duck.width;
        player.height = playerSprites.duck.height;
    } else {
        player.width = playerSprites.stand.width;
        player.height = playerSprites.stand.height;
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();
    drawPlayer();
    requestAnimationFrame(draw);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
        player.walking = true;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
        player.walking = true;
    }
    if (e.key === 'ArrowUp' || e.key === 'w') {
        if (!player.jumping) {
            player.jumping = true;
            player.dy = -10;
        }
    }
    if (e.key === 'ArrowDown' || e.key === 's') {
        player.ducking = true;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = 0;
        player.walking = false;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = 0;
        player.walking = false;
    }
    if (e.key === 'ArrowDown' || e.key === 's') {
        player.ducking = false;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

bgCastle.onload = function() {
    draw();
};
