///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export interface ICharacter {
        sprite: PIXI.Sprite;
        subType: Enum.CharacterSubType;
        // no one lives forever
        die: () => void;
    }
}   