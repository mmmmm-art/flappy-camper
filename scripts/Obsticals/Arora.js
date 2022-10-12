//@ts-check
import { Obstacle } from "./Obstical.js";
import { CANVAS_WIDTH } from "../CONST.js";
import { ctx } from "../app.js";
export const TOP_OBSTACLE_WIDTH = 0.1;
export class Arora extends Obstacle {
	/**
	 * @param {Number} h
	 */
	constructor(h,c) {
		super(CANVAS_WIDTH, 0, h, TOP_OBSTACLE_WIDTH, c);
        this.heightThing = 0;
        this.bottem = false;
        this.top = false;
        this.color = c;
        
	}

    update(){
        super.update();

        this.y = this.heightThing

        if (this.heightThing <= Math.random() * 50) 
        {
           this.bottem = true
           this.top = false
        } 
        if (this.heightThing >= Math.random() * 50 + 100)
        {
            this.bottem = false
            this.top = true
        }
        if (this.top && !this.bottem)
        {
            this.heightThing -= Math.random() * 10
        }
        if (!this.top && this.bottem)
        {
            this.heightThing += Math.random() * 10
        }
    }

    draw() {
        ctx.save();
        ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 1)`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }
}