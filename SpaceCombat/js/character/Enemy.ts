///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export class Enemy implements ICharacter {
        sprite: PIXI.Sprite;
        canvasHeight: number;
        canvasWidth: number;
        subType: Enum.CharacterSubType;

        constructor(texture: PIXI.Texture, x: number, y: number) {
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;

            this.sprite = new PIXI.Sprite(texture);

            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.rotation = 0;
            this.sprite.position.x = x;
            this.sprite.position.y = y;

            this.subType = Enum.CharacterSubType.ENEMY_NPC;
        }

        move(pressedKeys: Array<boolean>) : boolean {
            return false;
        }

        die(): boolean {
            this.sprite.stage.removeChild(this.sprite);
            this.sprite = null;
            return true;
        }
    }
} 