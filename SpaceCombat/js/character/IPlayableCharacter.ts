///<reference path="../lib/Gamepad.d.ts"/>
///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../util/MouseInput.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    export interface IPlayableCharacter extends ICharacter {
        // returns whether the character is dead
        move: (pressedKeys: Array<boolean>, gamepads: Array<Gamepad>, mouseInput: Util.MouseInput) => boolean;
    }
}  