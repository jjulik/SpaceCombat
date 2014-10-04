///<reference path="lib/PIXI.d.ts"/>
///<reference path="character/Bullet.ts"/>
///<reference path="character/Enemy.ts"/>
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
        enemyTotal: number;
        level: number;
        newWaveIncoming: boolean;
        textureManager: TextureManager;

        constructor() {
            var fighter: Character.Fighter;
            var bulletShape: PIXI.Graphics;
            var enemyBulletShape: PIXI.Graphics;
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;
            this.renderer = new PIXI.WebGLRenderer(this.canvasWidth, this.canvasHeight);
            this.stage = new PIXI.Stage(0x000000);
            this.textureManager = new TextureManager();

            this.textureManager.loadTexture('fighter', PIXI.Texture.fromImage('img/fighter.png'));
            this.textureManager.loadTexture('enemy', PIXI.Texture.fromImage('img/enemy.png'));
            bulletShape = new PIXI.Graphics();
            bulletShape.beginFill(0xFFFFFF)
            bulletShape.lineStyle(1, 0xFFFFFF, 1);
            bulletShape.drawCircle(0, 0, 3);
            bulletShape.endFill();
            this.textureManager.loadTexture('bullet', bulletShape.generateTexture());
            enemyBulletShape = new PIXI.Graphics();
            enemyBulletShape.beginFill(0xFF0000);
            enemyBulletShape.lineStyle(1, 0xFF0000, 1);
            enemyBulletShape.drawCircle(0, 0, 3);
            enemyBulletShape.endFill();
            this.textureManager.loadTexture('enemyBullet', enemyBulletShape.generateTexture());

            this.characters = [];
            fighter = new Character.Fighter(this.textureManager.textures['fighter'], this.textureManager.textures['bullet'], (character: Character.ICharacter) => this.addCharacter(character));
            this.addCharacter(fighter);

            // add the renderer view element to the DOM
            document.body.appendChild(this.renderer.view);

            this.pressedKeys = [];
            this.registerKeyHandlers();

            this.enemyTotal = 0;
            this.level = 0;
            this.newWaveIncoming = false;
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
            for (; i < characterCount; i++) {
                if (this.characters[i].move(this.pressedKeys)) {
                    this.characters[i] = null;
                    // character has died!
                    this.characters.splice(i, 1);
                    i++;
                    characterCount--;
                }
            }
        }

        detectCollisions() {
            var i: number = 0, characterCount: number = this.characters.length;
            var j: number, killStack: Array<number> = [];
            for (; i < characterCount; i++) {
                for (j = i + 1; j < characterCount; j++) {
                    if (((this.characters[i].subType > 0) !== (this.characters[j].subType > 0)) && this.collideTest(this.characters[i], this.characters[j])) {
                        // kill 'em both
                        killStack.push(i);
                        killStack.push(j);
                    }
                }
            }
            if (killStack.length <= 0) return;

            killStack = this.filterDuplicates(killStack);
            killStack.sort(function(a : number,b: number) {
                if (a > b) {
                    return 1;
                } else if (a === b) {
                    return 0;
                }
                return -1;
            });
            while ((j = killStack.pop()) !== undefined) {
                if (this.characters[j].die()) {
                    if (this.characters[j].subType === Enum.CharacterSubType.ENEMY_NPC) {
                        this.enemyTotal--;
                    }
                    this.characters.splice(j, 1);
                    characterCount--;
                }
            }
        }

        filterDuplicates<T>(array: Array<T>): Array<T> {
            var prims = { "boolean": {}, "number": {}, "string": {} }, objs: Array<T>;
            return array.filter(function (item) {
                var type = typeof item;
                if (type in prims)
                    return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
                else
                    return objs.indexOf(item) >= 0 ? false : objs.push(item) > 0;
            });
        }

        collideTest(character: Character.ICharacter, otherCharacter: Character.ICharacter): boolean {
            try {
                var x1: number = character.sprite.position.x;
                var y1: number = character.sprite.position.y;
                var x2: number = otherCharacter.sprite.position.x;
                var y2: number = otherCharacter.sprite.position.y;
                var bounds1: PIXI.Rectangle = character.sprite.getBounds();
                var bounds2: PIXI.Rectangle = otherCharacter.sprite.getBounds();
                // this collision detection algorithm is designed for circles, but seems to work alright on squares as well
                var diagonal1 = Math.sqrt(Math.pow(bounds1.width / 2, 2) + Math.pow(bounds1.height / 2, 2));
                var diagonal2 = Math.sqrt(Math.pow(bounds2.width / 2, 2) + Math.pow(bounds2.height / 2, 2));
                var distance = Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
                if (distance < (diagonal1 + diagonal2)) {
                    return true;
                }
                return false;
            } catch (error) {
                console.log(error);
                debugger;
            }
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            this.detectCollisions();

            this.moveCharacters();

            if (this.enemyTotal <= 0 && !this.newWaveIncoming) {
                this.newWaveIncoming = true;
                window.setTimeout(() => this.addEnemyWave(this.level++), 1000);
            }

            this.renderer.render(this.stage);
        }

        addCharacter(character: Character.ICharacter) {
            this.stage.addChild(character.sprite);
            this.characters.push(character);
        }

        addEnemyWave(level: number) {
            var enemyCount: number = 12;
            var enemyTexture: PIXI.Texture = this.textureManager.textures['enemy'];
            var spaceBetween: number = this.canvasWidth / (enemyCount + 1);
            var i: number;
            var enemy: Character.Enemy;
            for (i = 1; i <= enemyCount; i++) {
                enemy = new Character.Enemy(enemyTexture, this.textureManager.textures['enemyBullet'], i * spaceBetween, 50, (character: Character.ICharacter) => this.addCharacter(character));
                this.addCharacter(enemy);
                this.enemyTotal++;
            }
            this.newWaveIncoming = false;
        }
    }

    window.onload = () => {
        var sce: SpaceCombatEngine;
        sce = new SpaceCombatEngine();
        sce.animate();
    };
}