import { ObstacleManager } from "./Obsticals/Obstical-man.js";
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
		this.x = 200
		this.y = canvas.height / 2 - 16
		this.width = 20
		this.height = 32
		this.speed = 5
		this.weight = 1
		this.vy = 0
		this.pb = this.y + this.height
		this.registerEventHandlers();
	}

	/**
	 * @param {boolean} toggle
	 */
	registerEventHandlers(toggle) {
		window.addEventListener("keypress", (ev) => {
			switch (ev.key) {
                case "w":
					this.flap();
                    break;
				case " ":
					this.flap();
					break;
			}
		});

		window.addEventListener("click", (e) => {
			this.flap();
		});
	}

	flap() {
		this.vy = 0
		this.vy -= 8
	}
	 
	update() {
		this.vy += 0.3
		this.y += this.vy * this.weight
		this.y = Math.min(this.y, canvas.height - this.height)


	}
	

	render() {
		ctx.save()
		ctx.fillStyle = `hsla(0, 100%, 50%, 1)`
		ctx.fillRect(this.x, this.y, this.width, this.height)
		ctx.restore()
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