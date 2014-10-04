///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    sprite: PIXI.Sprite;
    texture: PIXI.Texture;

    export class Bullet implements ICharacter {
        canvasHeight: number;
        canvasWidth: number;
        xSpeed: number;
        ySpeed: number;
        dx: (x: number) => number = (x: number) => { return 0 };
        dy: (y: number) => number = (y: number) => { return 0 };
        sprite: PIXI.Sprite;
        subType: Enum.CharacterSubType;

        constructor(texture: PIXI.Texture, xOrigin: number, yOrigin: number, xSpeed: number, ySpeed: number, dx?: (x: number) => number, dy?: (y: number) => number) {
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;

            this.xSpeed = xSpeed;
            this.ySpeed = ySpeed;
            if (dx !== null && typeof(dx) !== 'undefined') {
                this.dx = dx;
            }
            if (dy !== null && typeof(dy) !== 'undefined') {
                this.dy = dy;
            }

            this.sprite = new PIXI.Sprite(texture);

            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.position.x = xOrigin;
            this.sprite.position.y = yOrigin;
        }

        move(pressedKeys: Array<boolean>): boolean {
            this.xSpeed += this.dx(this.sprite.position.x);
            this.ySpeed += this.dy(this.sprite.position.y);
            this.sprite.position.x += this.xSpeed;
            this.sprite.position.y += this.ySpeed;

            if (this.sprite.y < 0 || this.sprite.y > this.canvasHeight) {
                this.die();
                return true;
            }
            return false;
        }

        die(): boolean {
            this.sprite.stage.removeChild(this.sprite);
            this.sprite = null;
            return true;
        }
    }
} 