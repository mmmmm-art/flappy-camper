import { gameSpeed, ObstacleManager } from "./Obsticals/Obstical-man.js";
import { CANVAS_HEIGHT } from "./CONST.js";
import { CANVAS_WIDTH } from "./CONST.js";
//@ts-check

/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
export const ctx = canvas.getContext("2d")

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

class Player {
	constructor() {
		this.x = 500
		this.y = canvas.height / 2 - 16
		this.width = 20
		this.height = 32
		this.health = 1000
		this.healthX = 200
		this.weight = 1.2
		this.vy = 0
		this.pb = this.y + this.height;
		this.fillColor = 0;
        this.strokeColor = 200;
        this.score = 0;
		this.scoreX = 0;
		this.scoreY = 95;
		this.dust = [];
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
			}
		});
	}

	/**
	 * @param {boolean} lit
	 * @param {boolean} mid
	 * @param {boolean} big
	 */
	flap(lit, mid, big) {
		if(lit) {
		this.vy = 0
		this.vy -= 3
		// this.healthX += 10
		// this.health -= 20
		lit = false
		}

		if(mid) {
		this.vy = 0
		this.vy -= 6
		// this.healthX += 25
		// this.health -= 50
		mid = false
		}

		if(big) {
		this.vy = 0
		this.vy -= 12
		// this.healthX += 50
		// this.health -= 100
		big = false
		}
	}

	GameOver() {
		gameSpeed = 0
		this.x += 1/0
	}
	 
	update() {
		if (this.health <= 0) {
			this.GameOver()
		}
        this.strokeColor += 0.1;
		this.score += Math.floor(gameSpeed/3)
		this.vy += 0.3
		this.y += this.vy * this.weight
		this.y = Math.min(this.y, canvas.height - this.height)

		this.dust.push(new dust(this));
		this.dust.forEach((d) => {
			d.update();
		})
		this.dust.filter((d) => {
			d.isVis
		})

	}
	

	render() {
		ctx.save()
		ctx.fillStyle = `hsla(0, 100%, 50%, 1)`
		ctx.fillRect(this.x, this.y, this.width, this.height)
		ctx.restore()

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
		})
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
		this.radius = r
		this.color = 0
		this.deltaY = Math.random() * 5 + 0.2 * (Math.random() > 0.5 ? -1 : 1)
		this.deltaR = Math.random() + 1
		this.opacity = 1;
		this.isVis = true
	}

	update() {
		this.x -= gameSpeed
		this.y -= this.deltaY
		this.color += 5
		this.radius += this.deltaR
		this.opacity -= 0.01
		this.isVis = this.opacity > 0 || this.x + this.radius > 0;
	}

	render() {
		ctx.save();
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.opacity})`
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
		super(p.x, p.y + p.height / 2, 2,)
	}

}

let manager = new ObstacleManager();
let player = new Player();
manager.init();

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	manager.update();
	manager.draw();
	player.update();
	player.render();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);