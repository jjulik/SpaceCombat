///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    /**
     * Makes bullets. Lots and lots of bullets.
     */
    export class BulletFactory {
        canvasHeight: number;
        canvasWidth: number;
        initialClipSize: number;
        texture: PIXI.Texture;
        private expendedBullets: Array<Bullet>;
        private newShinyBullets: Array<Bullet>;
        bulletSubType: Enum.CharacterSubType;
        addCharacter: (INonPlayableCharacter) => void;
        damage: number;

        constructor(damage: number, bulletTexture: PIXI.Texture, bulletSubType: Enum.CharacterSubType, initialClipSize: number, addCharacterCallback: (INonPlayableCharacter) => void) {
            this.damage = damage;

            this.expendedBullets = [];
            this.newShinyBullets = [];

            this.texture = bulletTexture;
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;
            this.initialClipSize = initialClipSize;
            this.bulletSubType = bulletSubType;

            this.loadAmmo(this.initialClipSize);

            this.addCharacter = addCharacterCallback;
        }

        /**
         * Must be called in order to properly destory texture and sprites.
         */
        destroy() {
            //TODO: destory the texture, make sure all the sprites are taken care of

        }

        /**
         * Used to move a bullet from the expended list to the new list.
         */
        recycleBullet(b: Bullet) {
            var bIndex: number = this.expendedBullets.indexOf(b);
            if (bIndex > -1) {
                this.expendedBullets.splice(bIndex, 1);
            }
            this.newShinyBullets.push(b);
        }

        /**
         * Generates some bullets to use.
         */
        loadAmmo(numberOfBullets: number) {
            var bullet: Bullet;
            while (numberOfBullets-- > 0) {
                bullet = new Bullet(this.damage, this.texture, (b: Bullet) => this.recycleBullet(b));
                bullet.subType = this.bulletSubType;
                this.newShinyBullets.push(bullet);
            }
        }

        /**
         * Fire a new bullet.
         */
        fire(xOrigin: number, yOrigin: number, xSpeed: number, ySpeed: number, dx?: (x: number) => number, dy?: (y: number) => number) {
            var bullet = this.newShinyBullets.pop();
            while (bullet === undefined) {
                this.loadAmmo(1);
                bullet = this.newShinyBullets.pop();
                window.setTimeout(() => this.loadAmmo(this.initialClipSize), 0);
            }
            bullet.fire(xOrigin, yOrigin, xSpeed, ySpeed, dx, dy);
            this.addCharacter(bullet);
            this.expendedBullets.push(bullet);
        }
    }
} 