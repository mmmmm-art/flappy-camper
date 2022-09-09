//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const MAX_TOP_OBSTACLE_HEIGHT = 200;
const TOP_OBSTACLE_WIDTH = 10;
let gameSpeed = 10;


class River {
	/**
     * @param {number} h
     */
	constructor(h, c) {
		this.h = h;
		this.w = TOP_OBSTACLE_WIDTH;
        this.isVis = true;
		this.x = canvas.width;
		this.y = 0;
        this.heightThing = 0;
        this.bottem = false;
        this.top = false;
        this.color = c;

		this.color = `hsla(${this.color}, 100%, 50%, 1)`;
	}

	update() {
		this.x = this.x - gameSpeed;
        this.isVis = (this.x + this.w > 0);
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

	render() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

class ObstacleManager {
	constructor() {
		this.topObstacles = [];
        this.minTopObs = canvas.width / TOP_OBSTACLE_WIDTH + 2;
        this.heightThing = 0;
        this.top = false;
        this.bottem = true;
        this.color = 0
	}

	init() {
		let currentX = 0;
		while (this.topObstacles.length < this.minTopObs) {
			let o = new River(Math.random() * 150 + 50);
			o.x = currentX;
			this.topObstacles.push(o);
			currentX += TOP_OBSTACLE_WIDTH;
		}
	}

	update() {
		this.topObstacles.forEach((b) => {
			b.update();
		});
        this.color += 1
        
        if (this.heightThing <= Math.random() * 100) 
        {
           this.bottem = true
           this.top = false
        } 
        if (this.heightThing >= Math.random() * 50 + 150)
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


        console.log(this.heightThing)

        this.topObstacles = this.topObstacles.filter(o => o.isVis);

        while (this.topObstacles.length < this.minTopObs) {
            let nextX = this.topObstacles[this.topObstacles.length - 1].x + TOP_OBSTACLE_WIDTH;
			let o = new River(this.heightThing, this.color);
            o.x = nextX
			this.topObstacles.push(o);
		}
	}

	render() {
		this.topObstacles.forEach((b) => {
			b.render();
		});
	}
}

let manager = new ObstacleManager();
manager.init();

function animate() {
	// clear the screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	manager.update();
	manager.render();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
