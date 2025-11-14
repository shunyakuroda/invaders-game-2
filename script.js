/**
 * @file invaders-game-2/script.js
 * @author (Your Name)
 * @see <a href="https://github.com/(Your-GitHub-Username)/invaders-game-2">GitHub Repository</a>
 * @version 1.0.0
 * @license MIT
 */

/**
 * ゲームの描画に使用するキャンバス要素
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('gameCanvas');
/**
 * キャンバスの2Dレンダリングコンテキスト
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

/**
 * プレイヤーオブジェクト
 * @type {{x: number, y: number, width: number, height: number, color: string, dx: number}}
 */
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 10,
    color: 'green',
    dx: 5
};

/**
 * 弾丸の配列
 * @type {Array<Object>}
 */
let bullets = [];
/**
 * 弾丸オブジェクトのテンプレート
 * @type {{width: number, height: number, color: string, dy: number}}
 */
const bullet = {
    width: 3,
    height: 10,
    color: 'white',
    dy: -7
};

/**
 * 敵の配列
 * @type {Array<Object>}
 */
let enemies = [];
/**
 * 敵オブジェクトのテンプレート
 * @type {{width: number, height: number, color: string, dx: number, dy: number}}
 */
const enemy = {
    width: 20,
    height: 20,
    color: 'red',
    dx: 2,
    dy: 20
};

/**
 * 右矢印キーが押されているかどうか
 * @type {boolean}
 */
let rightPressed = false;
/**
 * 左矢印キーが押されているかどうか
 * @type {boolean}
 */
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

/**
 * キーが押されたときのイベントハンドラ
 * @param {KeyboardEvent} e キーボードイベント
 */
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ') {
        shoot();
    }
}

/**
 * キーが離されたときのイベントハンドラ
 * @param {KeyboardEvent} e キーボードイベント
 */
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

/**
 * 敵を生成して配置する
 */
function createEnemies() {
    enemies = [];
    for (let c = 0; c < 5; c++) {
        for (let r = 0; r < 3; r++) {
            enemies.push({
                x: c * (enemy.width + 20) + 60,
                y: r * (enemy.height + 20) + 30,
                width: enemy.width,
                height: enemy.height,
                color: enemy.color,
                dx: enemy.dx
            });
        }
    }
}

/**
 * 弾丸を発射する
 */
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - bullet.width / 2,
        y: player.y,
        width: bullet.width,
        height: bullet.height,
        color: bullet.color,
        dy: bullet.dy
    });
}

/**
 * プレイヤーを描画する
 */
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

/**
 * 弾丸を描画する
 */
function drawBullets() {
    bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });
}

/**
 * 敵を描画する
 */
function drawEnemies() {
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
}

/**
 * ゲームの状態を更新する
 */
function update() {
    // プレイヤーの移動
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.dx;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.dx;
    }

    // 弾丸の移動
    bullets.forEach((b, i) => {
        b.y += b.dy;
        if (b.y < 0) {
            bullets.splice(i, 1);
        }
    });

    // 敵の移動
    let edge = false;
    enemies.forEach(e => {
        e.x += e.dx;
        if (e.x + e.width > canvas.width || e.x < 0) {
            edge = true;
        }
    });

    if (edge) {
        enemies.forEach(e => {
            e.dx *= -1;
            e.y += enemy.dy;
        });
    }

    // 衝突検出
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y) {
                bullets.splice(bi, 1);
                enemies.splice(ei, 1);
            }
        });
    });

    // ゲームオーバー
    enemies.forEach(e => {
        if (e.y + e.height > player.y) {
            alert('ゲームオーバー');
            document.location.reload();
        }
    });

    if (enemies.length === 0) {
        alert('クリア！');
        document.location.reload();
    }
}

/**
 * ゲーム画面を描画する
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
}

/**
 * ゲームループ
 */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

createEnemies();
gameLoop();