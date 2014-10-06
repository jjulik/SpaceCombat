///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export interface IPlayableCharacter extends ICharacter {
        // returns whether the character is dead
        move: (pressedKeys: Array<boolean>) => boolean;
    }
}  