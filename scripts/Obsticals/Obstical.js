import { gameSpeed } from "./Obstical-man.js";
import { ctx } from "../app.js";
//@ts-check
export class Obstacle {
	/**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} h
     * @param {Number} w
     * @param {String} color
     */
	constructor(x, y, h, w, color) {
		this.h = h;
		this.w = w;

		this.x = x;
		this.y = y;

		this.isVisible = true;

		this.color = color;
    
	}

	update() {
		this.x -= gameSpeed;
		this.isVisible = this.x + this.w > 0;
	}

	draw() {
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 1)`;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}