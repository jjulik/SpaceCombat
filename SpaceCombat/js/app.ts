///<reference path="lib/PIXI.d.ts"/>
///<reference path="character/Fighter.ts"/>
module SpaceCombat {
    class SpaceCombatEngine {
        renderer: PIXI.WebGLRenderer;
        stage: PIXI.Stage;
        fighter: Character.Fighter;
        canvasWidth: number;
        canvasHeight: number;
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
            this.renderer = new PIXI.WebGLRenderer(this.canvasWidth, this.canvasHeight);
            this.stage = new PIXI.Stage(0x000000);
            
            this.fighter = new Character.Fighter(this.canvasWidth, this.canvasHeight);

            // add the renderer view element to the DOM
            document.body.appendChild(this.renderer.view);

            this.stage.addChild(this.fighter.sprite);

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
            this.fighter.processInput(this.pressedKeys);
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