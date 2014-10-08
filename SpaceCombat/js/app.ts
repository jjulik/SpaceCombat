///<reference path="lib/Gamepad.d.ts"/>
///<reference path="lib/PIXI.d.ts"/>
///<reference path="character/Bullet.ts"/>
///<reference path="character/BulletFactory.ts"/>
///<reference path="character/Enemy.ts"/>
///<reference path="character/Fighter.ts"/>
///<reference path="character/INonPlayableCharacter.ts"/>
///<reference path="character/IPlayableCharacter.ts"/>
///<reference path="util/MouseInput.ts"/>
module SpaceCombat {
    class SpaceCombatEngine {
        renderer: PIXI.IPixiRenderer;
        stage: PIXI.Stage;
        NPCs: Array<Character.INonPlayableCharacter>;
        players: Array<Character.IPlayableCharacter>;
        canvasWidth: number;
        canvasHeight: number;
        pressedKeys: Array<boolean>;
        enemyTotal: number;
        level: number;
        newWaveIncoming: boolean;
        textureManager: TextureManager;
        enemyBulletFactory: Character.BulletFactory;
        mouse: Util.MouseInput;

        constructor() {
            var fighter: Character.Fighter;
            var fighterTexture: PIXI.Texture;
            var enemyTexture: PIXI.Texture;
            var bulletShape: PIXI.Graphics;
            var enemyBulletShape: PIXI.Graphics;
            var bulletFactory: Character.BulletFactory;
            this.canvasWidth = document.body.clientWidth;
            this.canvasHeight = document.body.clientHeight;
            this.renderer = PIXI.autoDetectRecommendedRenderer(this.canvasWidth, this.canvasHeight, null, true);
            this.stage = new PIXI.Stage(0x000000);
            this.textureManager = new TextureManager();

            fighterTexture = PIXI.Texture.fromImage('img/ships_2.png');
            fighterTexture.setFrame(new PIXI.Rectangle(0, 0, 64, 64));
            this.textureManager.loadTexture('fighter', fighterTexture);
            enemyTexture = PIXI.Texture.fromImage('img/enemy_v2.png');
            this.textureManager.loadTexture('enemy', enemyTexture);
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

            bulletFactory = new Character.BulletFactory(this.textureManager.textures['bullet'], Enum.CharacterSubType.FRIENDLY_BULLET, 50, (character: Character.INonPlayableCharacter) => this.addCharacter(character));

            this.enemyBulletFactory = new Character.BulletFactory(this.textureManager.textures['enemyBullet'], Enum.CharacterSubType.ENEMY_BULLET, 50, (character: Character.INonPlayableCharacter) => this.addCharacter(character));

            this.players = []
            this.NPCs = []
            fighter = new Character.Fighter(this.textureManager.textures['fighter'], bulletFactory, Enum.InputType.MOUSE);
            this.addPlayer(fighter);

            // add the renderer view element to the DOM
            document.body.appendChild(this.renderer.view);

            this.pressedKeys = [];
            this.mouse = new Util.MouseInput();
            this.registerHandlers();

            this.enemyTotal = 0;
            this.level = 0;
            this.newWaveIncoming = false;
        }

        registerHandlers() {
            document.addEventListener('keydown', (event) => {
                this.pressedKeys[event.keyCode] = true;
            });
            document.addEventListener('keyup', (event) => {
                this.pressedKeys[event.keyCode] = false;
            });
            document.addEventListener('mousemove', (event) => this.mouseMoveWatcher(event));
            document.addEventListener('mousedown', (event) => this.mouseDownWatcher(event));
            document.addEventListener('mouseup', (event) => this.mouseUpWatcher(event));
        }

        mouseMoveWatcher(e: MouseEvent) {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }

        mouseUpWatcher(e: MouseEvent) {
            if (e.which === 1) {
                this.mouse.lbPressed = false;
            } else if (e.which === 3) {
                this.mouse.rbPressed = false;
            }
        }

        mouseDownWatcher(e: MouseEvent) {
            if (e.which === 1) {
                this.mouse.lbPressed = true;
            } else if (e.which === 3) {
                this.mouse.rbPressed = true;
            }
        }

        movePlayers() {
            var i: number = 0, characterCount: number = this.players.length;
            var gamepads: Array<Gamepad> = this.getGamepads();
            for (; i < characterCount; i++) {
                if (this.players[i].move(this.pressedKeys, gamepads, this.mouse)) {
                    this.players[i] = null;
                    // player has died!
                    this.players.splice(i, 1);
                    i++;
                    characterCount--;
                }
            }
        }

        getGamepads(): Array<Gamepad> {
            var gamepads: Array<Gamepad> = [];
            if (typeof navigator.getGamepads !== 'undefined') {
                return navigator.getGamepads();
            }
            return gamepads;
        }

        moveNPCs() {
            var i: number = 0, characterCount: number = this.NPCs.length;
            for (; i < characterCount; i++) {
                if (this.NPCs[i].move()) {
                    this.NPCs[i] = null;
                    // non-playable character has died!
                    this.NPCs.splice(i, 1);
                    i++;
                    characterCount--;
                }
            }
        }

        detectCollisions() {
            var i: number = 0, npcCount: number = this.NPCs.length, playerCount = this.players.length;
            var j: number, deadNPCs: Array<number> = [], deadPlayers: Array<number> = [];
            //compare each 
            for (; i < playerCount; i++) {
                for (j = 0; j < npcCount; j++) {
                    if (((this.players[i].subType > 0) !== (this.NPCs[j].subType > 0)) && this.collideTest(this.players[i], this.NPCs[j])) {
                        // kill 'em both
                        deadPlayers.push(i);
                        deadNPCs.push(j);
                    }
                }
            }
            for (i = 0; i < npcCount; i++) {
                if (this.NPCs[i].subType > 0) {
                    for (j = 0; j < npcCount; j++) {
                        if (this.NPCs[j].subType <= 0 && this.collideTest(this.NPCs[i], this.NPCs[j])) {
                            //kill 'em
                            deadNPCs.push(i);
                            deadNPCs.push(j);
                        }
                    }
                }
            }
            if (deadNPCs.length > 0) {
                deadNPCs = this.filterDuplicates(deadNPCs);
                deadNPCs.sort(function (a: number, b: number) {
                    if (a > b) {
                        return 1;
                    } else if (a === b) {
                        return 0;
                    }
                    return -1;
                });
                while ((j = deadNPCs.pop()) !== undefined) {
                    if (this.NPCs[j].die()) {
                        if (this.NPCs[j].subType === Enum.CharacterSubType.ENEMY_NPC) {
                            this.enemyTotal--;
                        }
                        this.NPCs.splice(j, 1);
                    }
                }
            }
            if (deadPlayers.length > 0) {
                deadPlayers = this.filterDuplicates(deadPlayers);
                deadPlayers.sort(function (a: number, b: number) {
                    if (a > b) {
                        return 1;
                    } else if (a === b) {
                        return 0;
                    }
                    return -1;
                });
                while ((j = deadPlayers.pop()) !== undefined) {
                    if (this.players[j].die()) {
                        this.players.splice(j, 1);
                    }
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

            this.movePlayers();
            this.moveNPCs();

            if (this.enemyTotal <= 0 && !this.newWaveIncoming) {
                this.newWaveIncoming = true;
                window.setTimeout(() => this.addEnemyWave(this.level++), 1000);
            }

            this.renderer.render(this.stage);
        }

        addPlayer(character: Character.IPlayableCharacter) {
            this.stage.addChild(character.sprite);
            this.players.push(character);
        }

        addCharacter(character: Character.INonPlayableCharacter) {
            this.stage.addChild(character.sprite);
            this.NPCs.push(character);
        }

        addEnemyWave(level: number) {
            var enemyCount: number = 12;
            var enemyTexture: PIXI.Texture = this.textureManager.textures['enemy'];
            var spaceBetween: number = this.canvasWidth / (enemyCount + 1);
            var i: number;
            var enemy: Character.Enemy;
            for (i = 1; i <= enemyCount; i++) {
                enemy = new Character.Enemy(enemyTexture, this.enemyBulletFactory, i * spaceBetween, 50);
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