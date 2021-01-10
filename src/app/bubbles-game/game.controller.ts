import * as PIXI from 'pixi.js';
import { Sounds, Images } from '../core/assets-names.constant';
import { BallSpammer } from '../bubbles-game/ball-spammer';
import { BackgroundScene, gameScreenBackgroundSceneProvider } from './game-screen-background.scene';
import { StartGameCountDownRenderer } from './strat-game-coutdown.renderer';
import { Ball } from './ball.model';
import { Keyboard } from './keyboard';
import { GameOverScene, gameOverSceneProvider } from './gameover-scene';
import { getSound, randomInt } from '../core/utils';


const Application = PIXI.Application;
const loader = PIXI.Loader.shared;
const resources = PIXI.Loader.shared.resources;
const Sprite = PIXI.Sprite;
const Container = PIXI.Container;
const GreenColor = 0x1099bb;

export class BubblesGameController {

    private newBalls = new Array<Ball>();
    private activeBalls = new Array<Ball>();
    private scoreBalls = new Array<Ball>();
    private ballSpammer = new BallSpammer();
    private gameLoopTimer: PIXI.Ticker;
    private gameLoopListener: (...params: any[]) => any;
    private app: PIXI.Application;
    private countDown = new StartGameCountDownRenderer();
    private backgroundScene: BackgroundScene;
    private gameOverScene: GameOverScene;
    private keyboard = new Keyboard();
    private defaultHearts = 3;
    private maxHearts = 10;
    private rescuedCats = 0;
    private deadCats = 0;
    private currentHearts = 3;
    private dificultyThreashold = 10;
    private meatBurstSprites = new Array<PIXI.Texture>();
    private lightCircleSprites = new Array<PIXI.Texture>();
    private backgroundSound: HTMLAudioElement;
    private gameOverSound: HTMLAudioElement;
    private gameWinSound: HTMLAudioElement;

    public start(app: PIXI.Application) {
        let self = this;
        this.app = app;
        this.addBackground(app.stage);
        this.currentHearts = this.defaultHearts;
        this.gameOverScene = gameOverSceneProvider(this.onGameOverBgClick.bind(this) as Function);
        this.backgroundSound = getSound(Sounds.GameBGMusic.key);
        this.backgroundSound.loop = true;
        this.gameOverSound = getSound(Sounds.GameOver.key);
        this.gameOverSound.volume = 0.5;
        this.gameOverSound.loop = false;
        this.gameWinSound = getSound(Sounds.GameWin.key);
        this.gameWinSound.volume = 0.7;
        this.gameWinSound.loop = false;

        this.countDown.start(this.app.stage, () => {
            self.backgroundScene.heartsText.text = `${this.currentHearts}`;
            self.keyboard.startListening(<any>self.onKeyDown.bind(self));
            self.gameLoopListener = (...params: any[]) => { self.gameLoop(<any>params); };
            self.gameLoopTimer = app.ticker.add(self.gameLoopListener);
            setTimeout(() => {
                self.backgroundSound.play();
            }, 600);
        });
    }

    public stop() {
        this.backgroundSound.pause();
        this.backgroundSound.currentTime = 0;
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

        if ( spammedBals.length === 0 && this.activeBalls.length <= 2 ) {
            this.ballSpammer.forceSpam();
        }

        for ( let ball of this.newBalls ) {
            this.app.stage.addChild(ball.sprite);
            this.activeBalls.push(ball);
        }
        this.newBalls = [];

        // move active balls
        for ( let ball of this.activeBalls ) {
            ball.sprite.y += ball.sprite.vy;
        }

        // check if key text mached
        for ( let i = this.activeBalls.length - 1; i >= 0; i-- ) {
            const ball = this.activeBalls[i];
            if ( ball.keyboardKey === ball.userTypedKey ) {
                this.activeBalls.splice(i, 1);
                this.scoreBalls.push(ball);
            }
        }

        // check hit bottom
        let ballsThatHitBottom = new Array<Ball>();
        for ( let item of this.activeBalls ) {
            if ( this.doesReachedBottom(item) ) {
                ballsThatHitBottom.push(item);
                this.app.stage.removeChild(item.sprite);
            }
        }

        // remove balls that hit bottom
        for ( let i = ballsThatHitBottom.length - 1; i >= 0; i-- ) {
            let ball = ballsThatHitBottom[i];
            this.deadCats++;
            this.currentHearts--;
            this.app.stage.removeChild(ball.sprite);
            const foundActiveIndex = this.activeBalls.findIndex(t => t === ball);
            if ( foundActiveIndex > -1 ) {
                this.activeBalls.splice(foundActiveIndex, 1);
            }
            this.backgroundScene.heartsText.text = `${this.currentHearts}`;
            this.backgroundScene.deadCatsText.text = `${this.deadCats}`;
            this.playDeadBallAnimation(ball);
        }

        // play ball score
        this.handleScoredBalls();

        if ( this.currentHearts < 0 ) {
            this.showGameOverScreen();
        }
    }

    private addBackground(stage: PIXI.Container) {
        this.backgroundScene = gameScreenBackgroundSceneProvider();
        stage.addChild(this.backgroundScene.container);
    }

    private doesReachedBottom(ball: Ball) {
        const bottomBound = ball.sprite.y + ball.sprite.height * 0.5;
        if ( bottomBound > 596 ) {
            return true;
        }
        return false;
    }

    private onKeyDown(key: string) {
        key = key.toUpperCase();
        for ( let ball of this.activeBalls ) {
            const targetString = getDifference(ball.userTypedKey, ball.keyboardKey);
            if ( !targetString ) { continue; }
            const targetKey = targetString[0];
            if ( targetKey === key ) {
                ball.userTypedKey = ball.userTypedKey +  key;
            }
        }

        function getDifference(text: string, compare: string) {
            if ( !text || text === '' ) { return compare; }
            if ( compare === '' ) { return null; }
            const result = text.match(RegExp(`^${compare}(.+)`));
            if ( !result ) { return null; }
            return result[1];
        }
    }

    private handleScoredBalls() {
        const self = this;
        const meowSound = getSound(Sounds.Meow1.key);
        const meow2 = getSound(Sounds.Meow2.key);
        const meows = [meowSound, meow2];
        for ( let i = this.scoreBalls.length - 1; i >= 0; i-- ) {
            const ball = this.scoreBalls[i];
            const meowIndex = randomInt(0, 1);
            meows[meowIndex].stopAndPlay();
            this.playCircleLightSprite(ball);
            self.rescuedCats++;
            self.dificultyThreashold--;
            self.app.stage.removeChild(ball.sprite);
            self.backgroundScene.rescueCatsText.text = '' + self.rescuedCats;
            self.upgradeDificultyIfNeccessary();
        }
        this.scoreBalls = [];
    }

    private playCircleLightSprite(ball: Ball) {
        const self = this;
        const sprite = this.createCircleLightSprite();
        sprite.anchor.set(0.5, 0.5);
        sprite.x = ball.sprite.x;
        sprite.y = ball.sprite.y;
        sprite.animationSpeed = 0.4;
        sprite.loop = false;
        this.app.stage.addChild(sprite);
        sprite.onComplete = () => {
            self.app.stage.removeChild(sprite);
        };
        sprite.play();
    }

    private upgradeDificultyIfNeccessary() {
        if ( this.dificultyThreashold <= 0 ) {
            if ( this.ballSpammer.dificulty < 2 ) {
                this.dificultyThreashold = 20;
            } else if ( this.ballSpammer.dificulty < 4 ) {
                this.dificultyThreashold = 30;
            } else {
                this.dificultyThreashold = 50;
            }
            this.ballSpammer.upgradeDificulty();
        }
    }

    private playDeadBallAnimation(ball: Ball) {
        getSound(Sounds.ImpactMeat1.key).stopAndPlay();
        const self = this;
        const sprite = this.createMeatBurstSprite();
        sprite.anchor.set(0.5, 0.5);
        sprite.x = ball.sprite.x;
        sprite.y = ball.sprite.y + 8;
        sprite.animationSpeed = 0.2;
        sprite.loop = false;
        sprite.onComplete = () => {
            self.app.stage.removeChild(sprite);
        };

        const showYelling = randomInt(0, 5);
        if ( showYelling === 0 || showYelling === 3 ) {
            const sound = getSound(Sounds.YellingCat1.key);
            sound.playbackRate = 1.4;
            sound.stopAndPlay();
        }

        this.app.stage.addChild(sprite);
        sprite.play();
    }

    private reset() {
        this.rescuedCats = 0;
        this.deadCats = 0;
        this.currentHearts = this.defaultHearts;
        this.dificultyThreashold = 10;
        this.keyboard.stop();

        this.gameOverSound.pause();
        this.gameOverSound.currentTime = 0;
        this.gameWinSound.pause();
        this.gameWinSound.currentTime = 0;

        this.backgroundScene.heartsText.text = `0`;

        for ( let ball of this.activeBalls ) {
            this.app.stage.removeChild(ball.sprite);
        }

        this.newBalls = new Array<Ball>();
        this.activeBalls = new Array<Ball>();
        this.scoreBalls = new Array<Ball>();
        this.ballSpammer = new BallSpammer();
    }

    private showGameOverScreen() {
        this.stop();

        const topScore = parseInt(window.localStorage.getItem('topScore') || '0', 10);
        if ( this.rescuedCats > topScore ) {
            this.gameWinSound.play();
        } else {
            this.gameOverSound.play();
        }

        this.gameOverScene.adjustUserScore(this.rescuedCats);
        this.app.stage.addChild(this.gameOverScene.container);
    }

    private onGameOverBgClick() {
        const self = this;
        this.reset();
        this.app.stage.removeChild(this.gameOverScene.container);
        this.backgroundScene.heartsText.text = `${this.currentHearts}`;
        this.backgroundScene.rescueCatsText.text = '0';
        this.backgroundScene.deadCatsText.text = '0';

        this.countDown.start(this.app.stage, () => {
            self.keyboard.startListening(<any>self.onKeyDown.bind(self));
            self.gameLoopListener = (...params: any[]) => { self.gameLoop(<any>params); };
            self.gameLoopTimer = self.app.ticker.add(self.gameLoopListener);
            setTimeout(() => {
                self.backgroundSound.play();
            }, 600);
        });
    }

    private createMeatBurstSprite() {

        if ( this.meatBurstSprites.length === 0 ) {
            const base = loader.resources[Images.MeatBurst].texture;

            const textrure1 = base.clone();
            textrure1.frame = new PIXI.Rectangle(0, 0, 50, 50);

            const textrure2 = base.clone();
            textrure2.frame = new PIXI.Rectangle(50, 0, 50, 50);

            const textrure3 = base.clone();
            textrure3.frame = new PIXI.Rectangle(100, 0, 50, 50);

            const textrure4 = base.clone();
            textrure4.frame = new PIXI.Rectangle(150, 0, 50, 50);

            const textrure5 = base.clone();
            textrure5.frame = new PIXI.Rectangle(200, 0, 50, 50);

            const textrure6 = base.clone();
            textrure6.frame = new PIXI.Rectangle(250, 0, 50, 50);

            this.meatBurstSprites = [textrure1, textrure2, textrure3, textrure4, textrure5, textrure6];
        }

        const sprite = new PIXI.AnimatedSprite(this.meatBurstSprites);

        return sprite;
    }

    private createCircleLightSprite() {

        if ( this.meatBurstSprites.length === 0 ) {
            const base = loader.resources[Images.Firework1].texture;
            const size = 60;

            const textrure1 = base.clone();
            textrure1.frame = new PIXI.Rectangle(0, 0, size, size);

            const textrure2 = base.clone();
            textrure2.frame = new PIXI.Rectangle(60, 0, size, size);

            const textrure3 = base.clone();
            textrure3.frame = new PIXI.Rectangle(120, 0, size, size);

            const textrure4 = base.clone();
            textrure4.frame = new PIXI.Rectangle(180, 0, size, size);

            const textrure5 = base.clone();
            textrure5.frame = new PIXI.Rectangle(240, 0, size, size);

            this.lightCircleSprites = [textrure1, textrure2, textrure3, textrure4, textrure5];
        }

        const sprite = new PIXI.AnimatedSprite(this.lightCircleSprites);

        return sprite;
    }

}
