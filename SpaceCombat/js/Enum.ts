module SpaceCombat.Enum {
    export enum CharacterSubType {
        ENEMY_BULLET = -3,
        ENEMY_NPC = -2,
        ENEMY_PLAYER = -1,
        NEUTRAL = 0,
        PLAYER = 1,
        FRIENDLY_NPC = 2,
        FRIENDLY_BULLET = 3,
    }

    export enum InputType {
        GAMEPAD_0 = 0,
        GAMEPAD_1 = 1,
        GAMEPAD_2 = 2,
        GAMEPAD_3 = 3,
        KEYBOARD = 4,
        MOUSE = 5,
        TOUCH = 6
    }

    export enum KeyCode {
        SPACE = 32,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40
    }
} 