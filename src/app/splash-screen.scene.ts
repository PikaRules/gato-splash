import * as PIXI from 'pixi.js';
import { Environment } from './core/defaults.constant';
import { Images } from '../app/core/assets-names.constant';

const Container = PIXI.Container;
const loader = PIXI.Loader.shared;

export function splashSceneProvider(onBackgroundClick?: () => void) {

    const loadingScene = new Container();
    loadingScene.width = Environment.width;
    loadingScene.height = Environment.height;

    // splash icon
    let splashSprite = new PIXI.Sprite(loader.resources[Images.SplashIcon].texture);
    splashSprite.x = Environment.width - 90;
    splashSprite.y = Environment.height - 90;
    splashSprite.anchor.set(0.5, 0.5);
    splashSprite.scale.set(0.6, 0.6);

    // text 1
    const style = new PIXI.TextStyle({
        fill: '#1efef3',
        fontFamily: 'Comic Sans MS',
        stroke: '#2f9df8',
        strokeThickness: 2,
        dropShadow: true,
        dropShadowDistance: 1,
        dropShadowAngle: 0.5235987755982988,
        dropShadowColor: 'black',
        dropShadowAlpha: 0.6
    });

    const loadingText = new PIXI.Text('Click to start', style);
    loadingText.x = Environment.width / 2;
    loadingText.y = Environment.height * 0.65;
    loadingText.anchor.set(0.5, 0.5);

    // text 2
    const style2 = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 32,
        fontWeight: 'bold',
        fill: 'yellow',
        stroke: 'blue',
        strokeThickness: 4,
        lineJoin: 'round'
    });
    const loadingText2 = new PIXI.Text('Gato splash', style2);
    loadingText2.x = Environment.width / 2;
    loadingText2.y = Environment.height * 0.46;
    loadingText2.anchor.set(0.5, 0.5);

    // background click

    let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    bg.width = Environment.width;
    bg.height = Environment.height;
    bg.tint = 0xffffff;
    if ( onBackgroundClick ) {
        bg.interactive = true;
        bg.on('click', onBackgroundClick);
    }

    // title

    const titleSprite = new PIXI.Sprite(loader.resources[Images.GatoTitle].texture);
    titleSprite.x = Environment.width / 2;
    titleSprite.y = Environment.height * 0.5;
    titleSprite.anchor.set(0.5, 0.5);

    // adding
    loadingScene.addChild(bg);
    loadingScene.addChild(splashSprite);
    loadingScene.addChild(titleSprite);
    // loadingScene.addChild(loadingText2);
    loadingScene.addChild(loadingText);

    return loadingScene;
}
