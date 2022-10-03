//@ts-check
import { Arora } from "./Arora.js";
import { Earth } from "./Earth.js";
import { BOTTOM_OBSTACLE_WIDTH_MIN } from "./Earth.js";
import { TOP_OBSTACLE_WIDTH } from "./Arora.js";
import { CANVAS_WIDTH } from "../CONST.js";
import { ctx } from "../app.js";
const MAX_TOP_OBSTACLE_HEIGHT = 225;
const MIN_TOP_OBSTACLE_HEIGHT = 50;
let MAX_BOTTOM_OBSTACLE_HEIGHT = 50;
const MIN_BOTTOM_OBSTACLE_HEIGHT = 50;
export let gameSpeed = 3
export class ObstacleManager {
	constructor() {
		this.topObstacles = [];
		this.bottoms = [];
		this.minTopObs = CANVAS_WIDTH / TOP_OBSTACLE_WIDTH + 2;
        this.color = 0
        this.color2 = 100
        this.bottem = false;
        this.top = false;
		this.topObsState = {
			isGoingUp: false,
			stepCount: 0,
			stepLimit: 5,
			stepSize: TOP_OBSTACLE_WIDTH,
			recalc: function () {
				this.isGoingUp = !this.isGoingUp;
				this.stepLimit = Math.random() * 17 + 3;
				this.stepCount = 0;
			},
		};
	}

	init() {
		let currentX = 0;
		while (this.topObstacles.length < this.minTopObs) {
			let o = new Arora(MAX_TOP_OBSTACLE_HEIGHT, Math.random() * 360);
			o.x = currentX;
			this.topObstacles.push(o);
			currentX += TOP_OBSTACLE_WIDTH;
		}

		this.topObsState.recalc();

		currentX = 0;
		for (let n = 0; n < 8; n++) {
			let o = new Earth(MIN_BOTTOM_OBSTACLE_HEIGHT * 3, this.color2);
			o.w = BOTTOM_OBSTACLE_WIDTH_MIN;
			o.x = currentX;
			this.bottoms.push(o);
			currentX += o.w - 1;
		}
	}

	update() {
		[...this.topObstacles, ...this.bottoms].forEach((b) => {
			b.update();
		});
        this.color += 1
        if (gameSpeed < 20) {
            gameSpeed += 0.003
        }

        if (MAX_BOTTOM_OBSTACLE_HEIGHT < 375) {
            MAX_BOTTOM_OBSTACLE_HEIGHT += 0.7999999
        }
    
        if (this.color2 <= 100) 
        {
           this.bottem = true
           this.top = false
        } 
        if (this.color2 >= 150)
        {
            this.bottem = false
            this.top = true
        }
        if (this.top && !this.bottem)
        {
            this.color2 -= 1
        }
        if (!this.top && this.bottem)
        {
            this.color2 += 1
        }
		this.topObstacles = this.topObstacles.filter((o) => o.isVisible);

		while (this.topObstacles.length < this.minTopObs) {
			// if we have reached our step limit, recalculate
			if (this.topObsState.stepCount >= this.topObsState.stepLimit) {
				this.topObsState.recalc();
			}

			let lastObs = this.topObstacles[this.topObstacles.length - 1];
			let nextX = lastObs.x + TOP_OBSTACLE_WIDTH;
			let nextH = this.topObsState.isGoingUp
				? lastObs.h + this.topObsState.stepSize
				: lastObs.h - this.topObsState.stepSize;

			if (nextH > MAX_TOP_OBSTACLE_HEIGHT) {
				nextH = MAX_TOP_OBSTACLE_HEIGHT;
				this.topObsState.recalc();
			} else if (nextH < MIN_TOP_OBSTACLE_HEIGHT) {
				nextH = MIN_TOP_OBSTACLE_HEIGHT;
				this.topObsState.recalc();
			}

			this.topObsState.stepCount++;

			let o = new Arora(nextH, this.color);
			o.x = nextX;
			this.topObstacles.push(o);
		}

		this.bottoms = this.bottoms.filter((o) => o.isVisible);
		let lastBottom = this.bottoms[this.bottoms.length - 1];
		if (lastBottom.x <= CANVAS_WIDTH) {
			let h =
				Math.random() * (MAX_BOTTOM_OBSTACLE_HEIGHT - MIN_BOTTOM_OBSTACLE_HEIGHT) +MIN_BOTTOM_OBSTACLE_HEIGHT;

			let o = new Earth(h,this.color2);
			o.x = lastBottom.x + lastBottom.w - 1;3
			this.bottoms.push(o);
		}
	}

	draw() {
		[...this.topObstacles, ...this.bottoms].forEach((b) => {
			b.draw();
		});
	}
}