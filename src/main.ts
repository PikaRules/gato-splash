
import './assets/css/app.scss';
import * as PIXI from 'pixi.js';
import * as PIXI_SOUND from 'pixi-sound';
import { Environment } from './app/core/defaults.constant';
import { loadingSceneProvider } from './app/initial-loading.scene';
import { loadAllResources } from './app/loader';
import { splashSceneProvider } from './app/splash-screen.scene';
import { BubblesGameController } from './app/bubbles-game/game.controller';
import { Sounds } from './app/core/assets-names.constant';
import { getSound } from './app/core/utils';

// Apply the patch to PIXI
import { install } from '@pixi/unsafe-eval';
const pepe = install as (p: any) => void;
pepe(PIXI);

const loader = PIXI.Loader.shared;

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
        getSound(Sounds.Accept1.key).play();
        setTimeout(() => {
            app.stage.removeChild(splashScene);
            bubbleGame.start(app);
        }, 500);
    });
    app.stage.addChild(splashScene);
});


