module SpaceCombat {
    export class TextureManager {
        textures: { [key: string]: PIXI.Texture } = {};

        loadTexture(key: string, texture: PIXI.Texture) {
            this.textures[key] = texture;
            //TODO: Add to texture cache via PIXI.Texture.addTextureToCache()
        }

        purgeTextures() {
            //TODO: remove textures from textureCache via PIXI.Texture.removeTextureFromCache()
            //TODO: destory the textures
            this.textures = {};
        }
    }
}