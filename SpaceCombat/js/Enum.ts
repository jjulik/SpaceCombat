module SpaceCombat.Enum {
    export enum KeyCode {
        SPACE = 32,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40
    }

    export enum CharacterSubType {
        ENEMY_BULLET = -3,
        ENEMY_NPC = -2,
        ENEMY_PLAYER = -1,
        NEUTRAL = 0,
        PLAYER = 1,
        FRIENDLY_NPC = 2,
        FRIENDLY_BULLET = 3,
    }
} 