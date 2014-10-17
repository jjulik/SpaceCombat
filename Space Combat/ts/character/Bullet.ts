///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export class Bullet implements INonPlayableCharacter {
        canvasHeight: number;
        canvasWidth: number;
        xSpeed: number;
        ySpeed: number;
        dx: (x: number) => number = (x: number) => { return 0 };
        dy: (y: number) => number = (y: number) => { return 0 };
        sprite: PIXI.Sprite;
        subType: Enum.CharacterSubType;
        recycle: (b: Bullet) => void;
        damage: number;
        hp: number;

        constructor(damage: number, texture: PIXI.Texture, recycle: (b: Bullet) => void) {
            this.damage = damage;

            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;

            this.sprite = new PIXI.Sprite(texture);

            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;

            this.recycle = recycle;
        }

        fire(xOrigin: number, yOrigin: number, xSpeed: number, ySpeed: number, dx?: (x: number) => number, dy?: (y: number) => number) {
            this.xSpeed = xSpeed;
            this.ySpeed = ySpeed;
            if (dx !== null && typeof (dx) !== 'undefined') {
                this.dx = dx;
            }
            if (dy !== null && typeof (dy) !== 'undefined') {
                this.dy = dy;
            }
            this.sprite.position.x = xOrigin;
            this.sprite.position.y = yOrigin;
        }

        move(): boolean {
            this.xSpeed += this.dx(this.sprite.position.x);
            this.ySpeed += this.dy(this.sprite.position.y);
            this.sprite.position.x += this.xSpeed;
            this.sprite.position.y += this.ySpeed;

            if (this.sprite.y < 0 || this.sprite.y > this.canvasHeight) {
                this.applyDamage(1);
                return true;
            }
            return false;
        }

        /**
         * Any amount of damage kills a bullet.
         */
        applyDamage(damage: number): boolean {
            this.sprite.stage.removeChild(this.sprite);
            this.recycle(this);
            return true;
        }
    }
} 