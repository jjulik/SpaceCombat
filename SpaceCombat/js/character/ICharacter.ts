///<reference path="../lib/PIXI.d.ts"/>
module SpaceCombat.Character {
    export interface ICharacter {
        sprite: PIXI.Sprite;
        texture: PIXI.Texture;
        // returns whether the character is dead
        move: (pressedKeys: Array<boolean>) => boolean;
    }
} 