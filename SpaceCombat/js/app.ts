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
        pressedKeys: Array<boolean>;

        get speedModifer(): number {
            return 10;
        }

        constructor() {
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;
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
            this.fighter.position.y = this.canvasHeight - 50;
            this.stage.addChild(this.fighter);

            this.pressedKeys = [];
            this.registerKeyHandlers();
        }

        registerKeyHandlers() {
            document.addEventListener('keydown', (event) => {
                //should we even bother with a switch case?
                switch (event.keyCode) {
                    case KeyCode.LEFT:
                    case KeyCode.UP:
                    case KeyCode.RIGHT:
                    case KeyCode.DOWN:
                        this.pressedKeys[event.keyCode] = true;
                        break;
                }
            });
        }

        processKeyboardInput() {
            if (this.pressedKeys[KeyCode.LEFT] && this.fighter.position.x > 0) {
                this.fighter.position.x -= this.speedModifer;
            }
            if (this.pressedKeys[KeyCode.RIGHT] && this.fighter.position.x < this.canvasWidth) {
                this.fighter.position.x += this.speedModifer;
            }
            this.pressedKeys = [];
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