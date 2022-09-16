//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const MAX_TOP_OBSTACLE_HEIGHT = 150;
const MIN_TOP_OBSTACLE_HEIGHT = 50;
const MAX_BOTTOM_OBSTACLE_HEIGHT = 250;
const MIN_BOTTOM_OBSTACLE_HEIGHT = 50;

const TOP_OBSTACLE_WIDTH = 0.1;
const BOTTOM_OBSTACLE_WIDTH_MIN = 100;
const BOTTOM_OBSTACLE_WIDTH_MAX = canvas.width / 2;

let gameSpeed = 3;

class Obstacle {
	/**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} h
     * @param {Number} w
     * @param {String} color
     * @param {Number} li
     */
	constructor(x, y, h, w, color, li) {
		this.h = h;
		this.w = w;

		this.x = x;
		this.y = y;

		this.isVisible = true;

		this.color = color;
        this.lightness = li
	}

	update() {
		this.x -= gameSpeed;
		this.isVisible = this.x + this.w > 0;
	}

	draw() {
		ctx.fillStyle = `hsla(${this.color}, 100%, ${this.lightness}%, 1)`;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

class TopObstacle extends Obstacle {
	/**
	 * @param {Number} h
	 */
	constructor(h,c) {
		super(canvas.width, 0, h, TOP_OBSTACLE_WIDTH, c, 50);
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
}

class BottomObstacle extends Obstacle {
	/**
	 * @param {Number} h
	 */
	constructor(h, c) {
		super(canvas.width, canvas.height - h, h, Math.random() * BOTTOM_OBSTACLE_WIDTH_MAX + BOTTOM_OBSTACLE_WIDTH_MIN, c, 30);
	}
}

class ObstacleManager {
	constructor() {
		this.topObstacles = [];
		this.bottoms = [];
		this.minTopObs = canvas.width / TOP_OBSTACLE_WIDTH + 2;
        this.color = 0
        this.color2 = 70
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
			let o = new TopObstacle(MAX_TOP_OBSTACLE_HEIGHT, this.color);
			o.x = currentX;
			this.topObstacles.push(o);
			currentX += TOP_OBSTACLE_WIDTH;
		}

		this.topObsState.recalc();

		currentX = 0;
		for (let n = 0; n < 8; n++) {
			let o = new BottomObstacle(MIN_BOTTOM_OBSTACLE_HEIGHT, this.color2);
			o.w = BOTTOM_OBSTACLE_WIDTH_MIN;
			o.x = currentX;
			this.bottoms.push(o);
			currentX += o.w;
		}
	}

	update() {
		[...this.topObstacles, ...this.bottoms].forEach((b) => {
			b.update();
		});
        this.color += 1
        if (gameSpeed < 15) {
            gameSpeed += 0.001
        }
        console.log(gameSpeed);
        if (this.color2 <= 90) 
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

			let o = new TopObstacle(nextH, this.color);
			o.x = nextX;
			this.topObstacles.push(o);
		}

		this.bottoms = this.bottoms.filter((o) => o.isVisible);
		let lastBottom = this.bottoms[this.bottoms.length - 1];
		if (lastBottom.x <= canvas.width) {
			let h =
				Math.random() * MAX_BOTTOM_OBSTACLE_HEIGHT +
				MIN_BOTTOM_OBSTACLE_HEIGHT;

			let o = new BottomObstacle(h,this.color2);
			o.x = lastBottom.x + lastBottom.w;
			this.bottoms.push(o);
		}
	}

	draw() {
		[...this.topObstacles, ...this.bottoms].forEach((b) => {
			b.draw();
		});
	}
}

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