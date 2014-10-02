///<reference path="lib/PIXI.d.ts"/>
module SpaceCombat {
    enum KeyCode {
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40
    }

    class SpaceCombatEngine {
        renderer: PIXI.WebGLRenderer;
        stage: PIXI.Stage;
        texture: PIXI.Texture;
        fighter: PIXI.Sprite;
        canvasWidth: number;
        canvasHeight: number;
        minY: number;
        maxY: number;
        pressedKeys: Array<boolean>;

        get xSpeedModifier(): number {
            return 20;
        }

        get ySpeedModifier(): number {
            return 20;
        }

        constructor() {
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;
            // the lowest the fighter can go on the screen
            this.minY = this.canvasHeight - 50;
            // the highest the fighter can go on the screen
            this.maxY = 50;//Math.max(this.minY - 300, 50);
            this.renderer = new PIXI.WebGLRenderer(this.canvasWidth, this.canvasHeight);
            this.stage = new PIXI.Stage(0x000000);
            this.texture = PIXI.Texture.fromImage('img/fighter.png');
            this.fighter = new PIXI.Sprite(this.texture);

            // add the renderer view element to the DOM
            document.body.appendChild(this.renderer.view);

            this.fighter.anchor.x = 0.5;
            this.fighter.anchor.y = 0.5;
            this.fighter.rotation = -Math.PI / 2;
            this.fighter.position.x = this.canvasWidth / 2;
            this.fighter.position.y = this.minY;
            this.stage.addChild(this.fighter);

            this.pressedKeys = [];
            this.registerKeyHandlers();
        }

        registerKeyHandlers() {
            document.addEventListener('keydown', (event) => {
                this.pressedKeys[event.keyCode] = true;
            });
            document.addEventListener('keyup', (event) => {
                this.pressedKeys[event.keyCode] = false;
            });
        }

        processKeyboardInput() {
            if (this.pressedKeys[KeyCode.LEFT] && this.fighter.position.x > 0) {
                this.fighter.position.x -= this.xSpeedModifier;
            }
            if (this.pressedKeys[KeyCode.RIGHT] && this.fighter.position.x < this.canvasWidth) {
                this.fighter.position.x += this.xSpeedModifier;
            }
            if (this.pressedKeys[KeyCode.DOWN] && this.fighter.position.y < this.minY) {
                this.fighter.position.y += this.ySpeedModifier;
            }
            if (this.pressedKeys[KeyCode.UP] && this.fighter.position.y > this.maxY) {
                this.fighter.position.y -= this.ySpeedModifier;
            }

        }

        animate() {
            requestAnimationFrame(() => this.animate());

            this.processKeyboardInput();

            this.renderer.render(this.stage);
        }
    }

    window.onload = () => {
        var sce: SpaceCombatEngine;
        sce = new SpaceCombatEngine();
        sce.animate();
    };
}