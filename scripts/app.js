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






let manager = new ObstacleManager();
manager.init();

function animate() {
	// clear the screen
	ctx?.clearRect(0, 0, canvas.width, canvas.height);

	manager.update();
	manager.draw();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);