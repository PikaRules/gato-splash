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
    splashSprite.x = Environment.width / 2;
    splashSprite.y = Environment.height / 2 - 20;
    splashSprite.anchor.set(0.5, 0.5);

    // text 1
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 22,
        fontWeight: 'bold',
        fill: 'blue',
        stroke: 'white',
        strokeThickness: 3,
        lineJoin: 'round'
    });

    const loadingText = new PIXI.Text('Click to start', style);
    loadingText.x = Environment.width / 2;
    loadingText.y = Environment.height * 0.7;
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

    // adding
    loadingScene.addChild(bg);
    loadingScene.addChild(splashSprite);
    loadingScene.addChild(loadingText2);
    loadingScene.addChild(loadingText);

    return loadingScene;
}
