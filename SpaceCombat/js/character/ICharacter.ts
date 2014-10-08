///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export interface ICharacter {
        sprite: PIXI.Sprite;
        subType: Enum.CharacterSubType;
        /**
         * Amount of damage to apply when another character collides with this character;
         */
        damage: number;
        /**
         * Amount of health the character has.
         */
        hp: number;
        /**
         * Applies an amount of damage to the character. Returns whether the character is dead.
         */
        applyDamage: (damage: number) => boolean;
    }
}   