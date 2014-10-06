///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    import KeyCode = Enum.KeyCode;

    export class Fighter implements IPlayableCharacter {
        canvasHeight: number;
        canvasWidth: number;
        minY: number;
        maxY: number;
        sprite: PIXI.Sprite;
        bulletTexture: PIXI.Texture;
        addCharacter: (character: Character.INonPlayableCharacter) => void;
        subType: Enum.CharacterSubType;
        inputType: Enum.InputType;

        get xSpeedModifier(): number {
            return 20;
        }

        get ySpeedModifier(): number {
            return 20;
        }

        constructor(texture: PIXI.Texture, bulletTexture: PIXI.Texture, addCharacterCallback: (character: Character.INonPlayableCharacter) => void, inputType: Enum.InputType) {
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;
            // the lowest the fighter can go on the screen
            this.minY = this.canvasHeight - 50;
            // the highest the fighter can go on the screen
            this.maxY = 50;
            
            this.sprite = new PIXI.Sprite(texture);

            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.rotation = 0;
            this.sprite.position.x = this.canvasWidth / 2;
            this.sprite.position.y = this.minY;

            this.addCharacter = addCharacterCallback;

            this.bulletTexture = bulletTexture;

            this.subType = Enum.CharacterSubType.PLAYER;

            this.inputType = inputType;
        }

        handleKeyboardInput(pressedKeys: Array<boolean>): boolean {
            if (pressedKeys[KeyCode.LEFT] && this.sprite.position.x > 0) {
                this.sprite.position.x -= this.xSpeedModifier;
            }
            if (pressedKeys[KeyCode.RIGHT] && this.sprite.position.x < this.canvasWidth) {
                this.sprite.position.x += this.xSpeedModifier;
            }
            if (pressedKeys[KeyCode.DOWN] && this.sprite.position.y < this.minY) {
                this.sprite.position.y += this.ySpeedModifier;
            }
            if (pressedKeys[KeyCode.UP] && this.sprite.position.y > this.maxY) {
                this.sprite.position.y -= this.ySpeedModifier;
            }
            if (pressedKeys[KeyCode.SPACE]) {
                this.fireBullet();
            }
            return false;
        }

        handleGamepadInput(): boolean {
            // TODO: this
            return false;
        }

        handleMouseInput(): boolean {
            // TODO: this
            return false;
        }

        handleTouchInput(): boolean {
            // TODO: this
            return false;
        }

        move(pressedKeys: Array<boolean>): boolean {
            switch (this.inputType) {
                case Enum.InputType.GAMEPAD_0:
                    return this.handleGamepadInput();
                case Enum.InputType.GAMEPAD_1:
                    return this.handleGamepadInput();
                case Enum.InputType.GAMEPAD_2:
                    return this.handleGamepadInput();
                case Enum.InputType.GAMEPAD_3:
                    return this.handleGamepadInput();
                case Enum.InputType.KEYBOARD:
                    return this.handleKeyboardInput(pressedKeys);
                case Enum.InputType.MOUSE:
                    return this.handleMouseInput();
                case Enum.InputType.TOUCH:
                    return this.handleTouchInput();
            }
            throw new Error('Unknown input type' + this.inputType);
        }

        fireBullet() {
            var bullet: Bullet;
            bullet = new Bullet(this.bulletTexture, this.sprite.position.x, this.sprite.position.y - 20, 0, -20);
            bullet.subType = Enum.CharacterSubType.FRIENDLY_BULLET;
            this.addCharacter(bullet);
        }

        die(): boolean {
            // ha ha I am invincible!
            return false;
        }
    }
} 