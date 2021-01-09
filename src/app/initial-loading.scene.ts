import * as PIXI from 'pixi.js';
import { Environment } from './core/defaults.constant';

const Container = PIXI.Container;

export function loadingSceneProvider() {

    const loadingScene = new Container();
    loadingScene.width = Environment.width;
    loadingScene.height = Environment.height;

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: 'black',
        stroke: 'white',
        strokeThickness: 2,
        lineJoin: 'round'
    });

    const loadingText = new PIXI.Text('Loading..', style);
    loadingText.x = 240;
    loadingText.y = 580;

    loadingScene.addChild(loadingText);

    return loadingScene;
}
