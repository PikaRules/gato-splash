
import './assets/css/app.scss';
import * as PIXI from 'pixi.js';
import { Environment } from './app/core/defaults.constant';
import { loadingSceneProvider } from './app/initial-loading.scene';

interface Pepino {
    hola: string;
}

const Application = PIXI.Application;
const loader = PIXI.Loader.shared;
const resources = PIXI.Loader.shared.resources;
const Sprite = PIXI.Sprite;
const Container = PIXI.Container;

const app = new PIXI.Application({
    width: Environment.width,
    height: Environment.height,
    backgroundColor: 0x1099bb, 
    antialias: true,
    resolution: 1
});
document.querySelector('.main-container').appendChild(app.view);


const loadingScene = loadingSceneProvider()
app.stage.addChild(loadingScene);

