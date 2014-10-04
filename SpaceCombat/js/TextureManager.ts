module SpaceCombat {
    export class TextureManager {
        textures: { [key: string]: PIXI.Texture } = {};

        loadTexture(key: string, texture: PIXI.Texture) {
            this.textures[key] = texture;
        }

        purgeTextures() {
            //TODO: destory the textures
            this.textures = {};
        }
    }
}