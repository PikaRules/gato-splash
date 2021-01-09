import * as PIXI from 'pixi.js';
import { CustomSprite } from '../core/custom-sprite';
import { TsumuTemplate } from '../core/assets-names.constant';
import { BallSpammer } from '../bubbles-game/ball-spammer';
import { gameScreenBackgroundSceneProvider } from './game-screen-background.scene';
import { StartGameCountDownRenderer } from './strat-game-coutdown.renderer';

const Application = PIXI.Application;
const loader = PIXI.Loader.shared;
const resources = PIXI.Loader.shared.resources;
const Sprite = PIXI.Sprite;
const Container = PIXI.Container;
const GreenColor = 0x1099bb;

export class BubblesGameController {

    private newBalls = new Array<CustomSprite>();
    private activeBalls = new Array<CustomSprite>();
    private ballSpammer = new BallSpammer();
    private gameLoopTimer: PIXI.Ticker;
    private gameLoopListener: (...params: any[]) => any;
    private app: PIXI.Application;
    private countDown = new StartGameCountDownRenderer();

    public start(app: PIXI.Application) {
        let self = this;
        this.app = app;
        this.addBackground(app.stage);

        this.countDown.start(this.app.stage, () => {
            self.gameLoopListener = (...params: any[]) => { self.gameLoop(<any>params); };
            self.gameLoopTimer = app.ticker.add(self.gameLoopListener);
        });
    }

    public stop() {
        this.gameLoopTimer.remove(this.gameLoopListener);
        this.gameLoopTimer = null;
        this.gameLoopListener = null;
    }

    private gameLoop(delta: number) {

        // add new spammed balls
        if ( !this.ballSpammer.hasStarted ) {
            this.ballSpammer.start();
        }
        let spammedBals = this.ballSpammer.fetch();
        this.newBalls = this.newBalls.concat(spammedBals);

        for ( let ball of this.newBalls ) {
            this.app.stage.addChild(ball);
            this.activeBalls.push(ball);
            ball.interactive = true;
            ball.pointerdownBindFunc = <any>this.onBallClick.bind(this, ball);
            ball.on('pointerdown', ball.pointerdownBindFunc);
        }
        this.newBalls = [];

        // move active balls
        for ( let ball of this.activeBalls ) {
            ball.y += ball.vy;
        }

        // check hit bottom
        let ballsThatHitBottom = new Array<CustomSprite>();
        for ( let ball of this.activeBalls ) {
            if ( this.doesReachedBottom(ball) ) {
                ballsThatHitBottom.push(ball);
                this.app.stage.removeChild(ball);
            }
        }

        // remove balls that hit bottom
        for ( let i = ballsThatHitBottom.length - 1; i >= 0; i-- ) {
            let ball = ballsThatHitBottom[i];
            this.app.stage.removeChild(ball);
            ballsThatHitBottom.splice(i, 1);
        }
    }

    private addBackground(stage: PIXI.Container) {
        const backgroundScene = gameScreenBackgroundSceneProvider();
        stage.addChild(backgroundScene);
    }

    private doesReachedBottom(sprite: CustomSprite) {
        const bottomBound = sprite.y + sprite.height * 0.5;
        if ( bottomBound > 640 ) {
            return true;
        }
        return false;
    }

    private onBallClick(sprite: CustomSprite, event: PIXI.InteractionEvent) {
        sprite.off('pointerdown', sprite.pointerdownBindFunc);
        sprite.pointerdownBindFunc = null;
        let foundIndex = this.activeBalls.findIndex(t => t.name === sprite.name);
        if ( foundIndex > -1 ) {
            const foundItem = this.activeBalls[foundIndex];
            this.app.stage.removeChild(foundItem);
            this.activeBalls.splice(foundIndex, 1);
        }
    }

}
