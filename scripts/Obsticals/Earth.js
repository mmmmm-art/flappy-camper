//@ts-check
import { Obstacle } from "./Obstical.js";
import { CANVAS_HEIGHT } from "../CONST.js";
import { CANVAS_WIDTH } from "../CONST.js";
import { ctx } from "../app.js";
export const BOTTOM_OBSTACLE_WIDTH_MIN = 100;
export const BOTTOM_OBSTACLE_WIDTH_MAX = CANVAS_WIDTH / 2;
export class Earth extends Obstacle {
	/**
	 * @param {Number} h
	 */
	constructor(h, c) {
		super(CANVAS_WIDTH, CANVAS_HEIGHT - h, h, Math.random() * BOTTOM_OBSTACLE_WIDTH_MAX + BOTTOM_OBSTACLE_WIDTH_MIN, c);
	}
}