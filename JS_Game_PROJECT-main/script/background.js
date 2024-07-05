class Layer {
    constructor(image, speedModifier,gameSpeed) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.gameSpeed=gameSpeed;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier; // Ensure gameSpeed is defined globally or passed to the constructor
    }

    update() {
        this.speed = this.gameSpeed * this.speedModifier; // Ensure gameSpeed is defined globally or passed to the constructor
        this.x = Math.floor(this.x - this.speed);
    }

    draw(ctx) { // Ensure ctx is passed as a parameter
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

export default Layer;