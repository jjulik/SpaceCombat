///<reference path="lib/PIXI.d.ts"/>
///<reference path="character/Bullet.ts"/>
///<reference path="character/Fighter.ts"/>
///<reference path="character/ICharacter.ts"/>
module SpaceCombat {
    class SpaceCombatEngine {
        renderer: PIXI.WebGLRenderer;
        stage: PIXI.Stage;
        characters: Array<Character.ICharacter>;
        canvasWidth: number;
        canvasHeight: number;
        pressedKeys: Array<boolean>;

        constructor() {
            var fighter: Character.Fighter;
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;
            this.renderer = new PIXI.WebGLRenderer(this.canvasWidth, this.canvasHeight);
            this.stage = new PIXI.Stage(0x000000);
            
            this.characters = []
            fighter = new Character.Fighter((character: Character.ICharacter) => this.addCharacter(character));
            this.addCharacter(fighter);

            // add the renderer view element to the DOM
            document.body.appendChild(this.renderer.view);

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

        moveCharacters() {
            var i: number = 0, characterCount: number = this.characters.length;
            try {
                for (; i < characterCount; i++) {
                    if (this.characters[i].move(this.pressedKeys)) {
                        this.characters[i] = null;
                        // character has died!
                        this.characters.splice(i, 1);
                        i++;
                        characterCount--;
                    }
                }
            } catch (error) {
                console.log(i);
            }
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            this.moveCharacters();

            this.renderer.render(this.stage);
        }

        addCharacter(character: Character.ICharacter) {
            this.stage.addChild(character.sprite);
            this.characters.push(character);
        }
    }

    window.onload = () => {
        var sce: SpaceCombatEngine;
        sce = new SpaceCombatEngine();
        sce.animate();
    };
}