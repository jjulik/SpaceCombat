///<reference path="lib/PIXI.d.ts"/>
class SpaceCombatEngine {
    renderer: PIXI.WebGLRenderer;
    stage: PIXI.Stage;
    texture: PIXI.Texture;
    fighter: PIXI.Sprite;
    canvasWidth: number;
    canvasHeight: number;

    constructor() {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.renderer = new PIXI.WebGLRenderer(this.canvasWidth, this.canvasHeight);
        this.stage = new PIXI.Stage(0x000000);
        this.texture = PIXI.Texture.fromImage('img/fighter.png');
        this.fighter = new PIXI.Sprite(this.texture);

        // add the renderer view element to the DOM
        document.body.appendChild(this.renderer.view);

        this.fighter.anchor.x = 0.5;
        this.fighter.anchor.y = 0.5;
        this.fighter.position.x = 400;
        this.fighter.position.y = 300;

        this.stage.addChild(this.fighter);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        this.fighter.rotation += 0.1;

        this.renderer.render(this.stage);
    }
}

window.onload = () => {
    var sce: SpaceCombatEngine;
    sce = new SpaceCombatEngine();
    sce.animate();
};