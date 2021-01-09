
import './assets/css/app.scss';
import * as PIXI from 'pixi.js';
import { Environment } from './app/core/defaults.constant';
import { loadingSceneProvider } from './app/initial-loading.scene';
import { loadAllResources } from './app/loader';
import { splashSceneProvider } from './app/splash-screen.scene';
import { BubblesGameController } from './app/bubbles-game/game.controller';

const app = new PIXI.Application({
    width: Environment.width,
    height: Environment.height,
    backgroundColor: 0xffffff,
    antialias: true,
    resolution: 1
});
document.querySelector('.main-container').appendChild(app.view);

const bubbleGame = new BubblesGameController();
const loadingScene = loadingSceneProvider();
app.stage.addChild(loadingScene);

loadAllResources( (ldr, resources) => {
    app.stage.removeChild(loadingScene);
    const splashScene = splashSceneProvider(() => {
        app.stage.removeChild(splashScene);
        bubbleGame.start(app);
    });
    app.stage.addChild(splashScene);
});


