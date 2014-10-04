///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export interface ICharacter {
        sprite: PIXI.Sprite;
        subType: Enum.CharacterSubType;
        // returns whether the character is dead
        move: (pressedKeys: Array<boolean>) => boolean;
        // no one lives forever
        die: () => void;
    }
} 