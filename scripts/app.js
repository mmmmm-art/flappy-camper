//@ts-check
import { gameSpeed, ObstacleManager } from "./Obsticals/Obstical-man.js";
import { CANVAS_HEIGHT } from "./CONST.js";
import { CANVAS_WIDTH } from "./CONST.js";

/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
export const ctx = canvas.getContext("2d");
//1900 -150

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

class Player {
	/**
	 * @param {ObstacleManager} ObstacleManager
	 */
	constructor(ObstacleManager) {
		this.scale = 3;
		this.x = 500;
		this.o = ObstacleManager;
		this.y = canvas.height / 2 - 16;
		this.width = (1900 / 12) / this.scale;
		this.height = 150 / this.scale;
		this.health = 1000;
		this.healthX = 200;
		this.weight = 1.2;
		this.vy = 0;
		this.pb = this.y + this.height;
		this.fillColor = 0;
		this.strokeColor = 200;
		this.score = 0;
		this.scoreX = 0;
		this.scoreY = 95;
		this.dust = [];
		this.image = {
			/** @type {HTMLImageElement}*/ //@ts-ignore
			src: document.getElementById("Player"),
			fps: 12,
		
			frames: [
				{ x: 0 },
				{ x: 1900 / 12 },
				{ x: (1900 / 12) * 2 },
				{ x: (1900 / 12) * 3 },
				{ x: (1900 / 12) * 4 },
				{ x: (1900 / 12) * 5 },
				{ x: (1900 / 12) * 6 },
				{ x: (1900 / 12) * 7 },
				{ x: (1900 / 12) * 8 },
				{ x: (1900 / 12) * 9 },
				{ x: (1900 / 12) * 10 },
				{ x: (1900 / 12) * 11 },
				{ x: 1900 },
			],
			currentFrame: 0,
			nextframe: function () {
				this.currentFrame++;
				if (this.currentFrame >= this.frames.length-1) {
					this.currentFrame = 0;
				}
			},
		};
		this.thing = 0
		this.registerEventHandlers();
	}

	/**
	 * @param {boolean} toggle
	 */
	registerEventHandlers(toggle) {
		window.addEventListener("keypress", (ev) => {
			switch (ev.key) {
				case "w":
					this.flap(false, true, false);
					break;
				case "q":
					this.flap(true, false, false);
					break;
				case "e":
					this.flap(false, false, true);
					break;
				case " ":
					this.flap(false, true, false);
					break;
				case "5":
					this.scale = 0.5;
					this.width = (1900 / 12) / this.scale;
					this.height = 150 / this.scale;
					break
				case "4":
					this.scale = 1;
					this.width = (1900 / 12) / this.scale;
					this.height = 150 / this.scale;
					break
				case "3":
					this.scale = 2;
					this.width = (1900 / 12) / this.scale;
					this.height = 150 / this.scale;
					break
				case "2":
					this.scale = 3;
					this.width = (1900 / 12) / this.scale;
					this.height = 150 / this.scale;
					break
				case "1":
					this.scale = 4;
					this.width = (1900 / 12) / this.scale;
					this.height = 150 / this.scale;
					break
			}
		});
	}

	/**
	 * @param {boolean} lit
	 * @param {boolean} mid
	 * @param {boolean} big
	 */
	flap(lit, mid, big) {
		if (lit) {
			this.vy = 0;
			this.vy -= 3;
			this.healthX += 10
			this.health -= 20
			lit = false;
		}

		if (mid) {
			this.vy = 0;
			this.vy -= 6;
			this.healthX += 25
			this.health -= 50
			mid = false;
		}

		if (big) {
			this.vy = 0;
			this.vy -= 12;
			this.healthX += 50
			this.health -= 100
			big = false;
		}
	}

	GameOver() {
		gameSpeed = 0;
		this.x += 1 / 0;
	}

	update() {
		console.log(this.health,this.healthX)
		if(this.health > 1000 && this.health < 200) {
			this.healthX = 200
			this.health = 1000
		}
		this.thing += 0.01666666666667
		if (this.health <= 0) {
			this.GameOver();
		}
		this.strokeColor += 0.1;
		this.score += Math.floor(gameSpeed / 3);
		this.vy += 0.3;
		this.y += this.vy * this.weight;
		this.y = Math.min(this.y, canvas.height - this.height);

		this.dust.push(new dust(this));
		this.dust.forEach((d) => {
			d.update();
		});
		this.dust.filter((d) => {
			d.isVis;
		});

		if(this.thing >= 1/this.image.fps) {
			this.image.nextframe();
			this.thing =0
		}
		this.o.bottoms.forEach((b) => {
			if (this.x + this.width >= b.x && this.x <= b.x + b.w && this.y + this.height >= b.y) {
				this.GameOver()
			}
		})
		this.o.topObstacles.forEach((b) => {
			if (this.x + this.width >= b.x && this.x <= b.x + b.w && this.y <= b.y + b.h) {
				this.GameOver()
			}
		})
		
	}

	render() {
		ctx.save();
		ctx.drawImage(
			this.image.src,
			this.image.frames[this.image.currentFrame].x,
			0,
			1900 / 12,
			150,
			this.x,
			this.y,
			this.width,
			this.height
		);
		ctx.restore();

		ctx.save();
		ctx.fillStyle = `hsla(${this.fillColor}, 100%, 100%, 1)`;
		ctx.strokeStyle = `hsla(${this.strokeColor}, 100%, 50%, 1)`;
		ctx.font = "90px karma";
		ctx.fillText(`Score:${this.score}`, this.scoreX, this.scoreY);
		ctx.strokeText(`Score:${this.score}`, this.scoreX, this.scoreY);
		ctx.restore();

		ctx.save();
		ctx.fillStyle = "hsla(0, 100%, 50%, 1)";
		ctx.fillRect(200, 10, 1000, 20);
		ctx.restore();

		ctx.save();
		ctx.fillStyle = "hsla(100, 100%, 50%, 1)";
		ctx.fillRect(this.healthX, 10, this.health, 20);
		ctx.restore();

		this.dust.forEach((d) => {
			d.render();
		});
	}
}

class particals {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} r
	 */
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.radius = r;
		this.color = 0;
		this.deltaY = Math.random() * 5 + 0.2 * (Math.random() > 0.5 ? -1 : 1);
		this.deltaR = Math.random() + 1;
		this.opacity = 1;
		this.isVis = true;
	}

	update() {
		this.x -= gameSpeed;
		this.y -= this.deltaY;
		this.color += 5;
		this.radius += this.deltaR;
		this.opacity -= 0.01;
		this.isVis = this.opacity > 0 || this.x + this.radius > 0;
	}

	render() {
		ctx.save();
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.opacity})`;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.restore();
	}
}

class dust extends particals {
	/**
	 * @param {Player} p
	 */
	constructor(p) {
		super(p.x + p.width / 2, p.y + p.height, 2);
	}
}

class collectable {
	/**
	 * @param {number} x
	 */
	constructor(x) {
		this.x = x;
		this.y = Math.random() * 100 + 375;
		this.w = 20;
		this.h = 40;
		this.isVis = true;
	}

	update() {
		this.x -= gameSpeed
		if(this.x + this.w <= 0) {
			this.isVis = false
		}
	}

	draw() {
		ctx.save();
		ctx.fillStyle = `hsla(100, 100%, 50%, 1)`
		ctx.fillRect(this.x, this.y, this.w, this.h)
		ctx.restore();
	}
}

class collectMan {
	/**
	 * @param {Player} Player
	 */
	constructor(Player) {
		this.player = Player;
		this.collects = [];
		this.max = 5;
	}

	init() {
		let p1 = new collectable(600);
		let p2 = new collectable(800);
		let p3 = new collectable(1000);
		let p4 = new collectable(1200);
		let p5 = new collectable(1400);
		let p6 = new collectable(1500);
		let p7 = new collectable(1600);
		this.collects.push(p1, p2, p3, p4, p5, p6, p7);
	}

	update() {
		this.collects.forEach((c) => {
			c.update();
			c.draw();
		});
		this.collects = this.collects.filter((i) => i.isVis)

		if(this.collects.length < 5) {
			let c = new collectable(canvas.width + (Math.random() * 100));
			this.collects.push(c)
		}


		this.collects.forEach((b) => {
			if (this.player.x + this.player.width >= b.x && this.player.x <= b.x + b.w && this.player.y + this.player.height >= b.y) {
				this.player.healthX -= 25
				this.player.health += 50
				b.isVis = false;
			}
		})


		
	}
}

let manager = new ObstacleManager();
let player = new Player(manager);
let cman = new collectMan(player);
manager.init();
cman.init();

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	manager.update();
	manager.draw();
	player.update();
	player.render();
	cman.update();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
