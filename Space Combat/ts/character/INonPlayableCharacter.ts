///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export interface INonPlayableCharacter extends ICharacter {
        // returns whether the character is dead
        move: () => boolean;
    }
} 