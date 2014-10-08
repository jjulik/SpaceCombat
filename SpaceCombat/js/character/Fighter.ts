///<reference path="../lib/Gamepad.d.ts"/>
///<reference path="../lib/PIXI.d.ts"/>
///<reference path="../util/MouseInput.ts"/>
///<reference path="../Enum.ts"/>
module SpaceCombat.Character {
    import KeyCode = Enum.KeyCode;

    export class Fighter implements IPlayableCharacter {
        canvasHeight: number;
        canvasWidth: number;
        minY: number;
        maxY: number;
        sprite: PIXI.Sprite;
        subType: Enum.CharacterSubType;
        inputType: Enum.InputType;
        bulletFactory: BulletFactory;

        get xSpeedModifier(): number {
            return 20;
        }

        get ySpeedModifier(): number {
            return 20;
        }

        constructor(texture: PIXI.Texture, bulletFactory: BulletFactory, inputType: Enum.InputType) {
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

            this.bulletFactory = bulletFactory;

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

        handleGamepadInput(gamepad: Gamepad): boolean {
            if (gamepad.buttons[Enum.GamepadButton.LEFT].pressed && this.sprite.position.x > 0) {
                this.sprite.position.x -= this.xSpeedModifier;
            }
            if (gamepad.buttons[Enum.GamepadButton.RIGHT].pressed && this.sprite.position.x < this.canvasWidth) {
                this.sprite.position.x += this.xSpeedModifier;
            }
            if (gamepad.buttons[Enum.GamepadButton.DOWN].pressed && this.sprite.position.y < this.minY) {
                this.sprite.position.y += this.ySpeedModifier;
            }
            if (gamepad.buttons[Enum.GamepadButton.UP].pressed && this.sprite.position.y > this.maxY) {
                this.sprite.position.y -= this.ySpeedModifier;
            }
            if (gamepad.buttons[Enum.GamepadButton.TRIGGER].pressed) {
                this.fireBullet();
            }
            // Check the thumb sticks
            if (gamepad.axes[Enum.GamepadAxes.LEFT_X] < -0.1 && this.sprite.position.x > 0) {
                this.sprite.position.x += this.xSpeedModifier * gamepad.axes[Enum.GamepadAxes.LEFT_X];
            }
            if (gamepad.axes[Enum.GamepadAxes.LEFT_X] > 0.1 && this.sprite.position.x < this.canvasWidth) {
                this.sprite.position.x += this.xSpeedModifier * gamepad.axes[Enum.GamepadAxes.LEFT_X];
            }
            if (gamepad.axes[Enum.GamepadAxes.LEFT_Y] > 0.1 && this.sprite.position.y < this.minY) {
                this.sprite.position.y += this.ySpeedModifier * gamepad.axes[Enum.GamepadAxes.LEFT_Y];
            }
            if (gamepad.axes[Enum.GamepadAxes.LEFT_Y] < -0.1 && this.sprite.position.y > this.maxY) {
                this.sprite.position.y += this.ySpeedModifier * gamepad.axes[Enum.GamepadAxes.LEFT_Y];
            }
            return false;
        }

        handleMouseInput(mouseInput: Util.MouseInput): boolean {
            if (mouseInput.x < this.sprite.position.x) {
                this.sprite.position.x -= this.xSpeedModifier;
            }
            if (mouseInput.x > this.sprite.position.x) {
                this.sprite.position.x += this.xSpeedModifier;
            }
            if (mouseInput.y < this.sprite.position.y) {
                this.sprite.position.y -= this.ySpeedModifier;
            }
            if (mouseInput.y > this.sprite.position.y) {
                this.sprite.position.y += this.ySpeedModifier;
            }
            if (mouseInput.lbPressed) {
                this.fireBullet();
            }
            return false;
        }

        handleTouchInput(): boolean {
            // TODO: this
            return false;
        }

        move(pressedKeys: Array<boolean>, gamepads: Array<Gamepad>, mouseInput: Util.MouseInput): boolean {
            switch (this.inputType) {
                case Enum.InputType.GAMEPAD_0:
                case Enum.InputType.GAMEPAD_1:
                case Enum.InputType.GAMEPAD_2:
                case Enum.InputType.GAMEPAD_3:
                    if (!gamepads[this.inputType]) {
                        return false;
                    }
                    return this.handleGamepadInput(gamepads[this.inputType]);
                case Enum.InputType.KEYBOARD:
                    return this.handleKeyboardInput(pressedKeys);
                case Enum.InputType.MOUSE:
                    return this.handleMouseInput(mouseInput);
                case Enum.InputType.TOUCH:
                    return this.handleTouchInput();
            }
            throw new Error('Unknown input type' + this.inputType);
        }

        fireBullet() {
            this.bulletFactory.fire(this.sprite.position.x, this.sprite.position.y - 20, 0, -20);
        }

        die(): boolean {
            // ha ha I am invincible!
            return false;
        }
    }
} 