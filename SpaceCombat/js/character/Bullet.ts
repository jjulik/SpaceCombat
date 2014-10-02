///<reference path="../lib/PIXI.d.ts"/>
module SpaceCombat.Character {
    sprite: PIXI.Sprite;
    texture: PIXI.Texture;

    export class Bullet implements ICharacter {
        canvasHeight: number;
        canvasWidth: number;
        xSpeed: number;
        ySpeed: number;
        sprite: PIXI.Sprite;
        texture: PIXI.Texture;

        constructor(xOrigin: number, yOrigin: number, xSpeed: number, ySpeed: number) {
            var bulletShape: PIXI.Graphics;
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;

            this.xSpeed = xSpeed;
            this.ySpeed = ySpeed;

            bulletShape = new PIXI.Graphics();
            bulletShape.beginFill(0xFFFFFF)
            bulletShape.lineStyle(1, 0xFFFFFF, 1);
            bulletShape.drawCircle(0, 0, 3);
            bulletShape.endFill();

            this.texture = bulletShape.generateTexture();
            this.sprite = new PIXI.Sprite(this.texture);

            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.position.x = xOrigin;
            this.sprite.position.y = yOrigin;
        }

        move(pressedKeys: Array<boolean>): boolean {
            this.sprite.position.x += this.xSpeed;
            this.sprite.position.y += this.ySpeed;

            if (this.sprite.y < 0 || this.sprite.y > this.canvasHeight) {
                this.sprite.stage.removeChild(this.sprite);
                this.sprite = null;
                this.texture = null;
                return true;
            }
            return false;
        }
    }
} 