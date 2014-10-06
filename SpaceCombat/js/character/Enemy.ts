///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export class Enemy implements INonPlayableCharacter {
        sprite: PIXI.Sprite;
        canvasHeight: number;
        canvasWidth: number;
        // The number of frames before your the Enemy's weapon is ready to fire again
        coolDown: number;
        subType: Enum.CharacterSubType;
        bulletTexture: PIXI.Texture;
        addCharacter: (character: Character.INonPlayableCharacter) => void;

        constructor(texture: PIXI.Texture, bulletTexture: PIXI.Texture, x: number, y: number, addCharacterCallback: (character: Character.INonPlayableCharacter) => void) {
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;

            this.sprite = new PIXI.Sprite(texture);

            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.rotation = 0;
            this.sprite.position.x = x;
            this.sprite.position.y = y;

            this.subType = Enum.CharacterSubType.ENEMY_NPC;

            this.bulletTexture = bulletTexture;

            this.addCharacter = addCharacterCallback;
        }

        move(): boolean {
            var rand: number;
            if (this.coolDown > 0) {
                this.coolDown--;
                return false;
            }
            rand = Math.random();
            if (rand < .05) {
                this.fireBullet();
                this.coolDown = 30;
            }
            return false;
        }

        fireBullet() {
            var bullet: Bullet;
            bullet = new Bullet(this.bulletTexture, this.sprite.position.x, this.sprite.position.y, 0, 10);
            bullet.subType = Enum.CharacterSubType.ENEMY_BULLET;
            this.addCharacter(bullet);
        }

        die(): boolean {
            this.sprite.stage.removeChild(this.sprite);
            this.sprite = null;
            return true;
        }
    }
} 