import * as PIXI from 'pixi.js';
import { Images } from '../core/assets-names.constant';
import { CustomContainer, CustomSprite } from '../core/custom-sprite';
import { Ball } from './ball.model';
import { assert, randomInt, suffle } from '../core/utils';
import { Environment } from '../core/defaults.constant';
import { DIFICULTIES } from './dificulties.const';

const loader = PIXI.Loader.shared;

interface Dificulty {
    ballsRange: {min: number, max: number};
    ballsSpamRate: Array<number>;
    velocity: Array<number>;
}

export class BallSpammer {

    public onlyOnce = false;
    public get hasStarted() { return this._hasStarted; }
    public get dificulty() { return this.currentDificulty; }
    private bucket = new Array<Ball>();
    private finished = false;
    private timeoutSeed: ReturnType<typeof setTimeout>;
    private _hasStarted = false;
    private kittensTextures = new Array<PIXI.Texture>();
    private keyboardKeys = new Array<string>();
    private dificultyConfig: Dificulty;
    private difficulties = new Array<Dificulty>();
    private spamPositions: Array<{x: number, y: number}>;
    private lastSpamedTime: number;
    private currentSpamWait = 0;
    private waitingForceSpam = false;
    private keyboardTextStyle: PIXI.TextStyle;
    private currentDificulty = -1;

    public start() {
        const self = this;

        this.setupKeyboardKeys();
        this.setupDificulties();
        this.setupSpamPositions();
        this.setupTextStyle();
        this.upgradeDificulty();

        this.kittensTextures.push(loader.resources[Images.KittenA].texture);
        this.kittensTextures.push(loader.resources[Images.KittenB].texture);
        this.kittensTextures.push(loader.resources[Images.KittenC].texture);
        this.kittensTextures.push(loader.resources[Images.KittenD].texture);

        if ( this._hasStarted ) { return; }
        this._hasStarted = true;
        if ( this.timeoutSeed ) {
            clearTimeout(this.timeoutSeed);
            this.timeoutSeed = null;
        }
        this.lauchSpamBalls();
    }

    public stop() {
        if ( this.timeoutSeed ) {
            clearTimeout(this.timeoutSeed);
            this.timeoutSeed = null;
        }
    }

    public fetch(): Array<Ball> {
        let temp = this.bucket;
        this.bucket = [];
        return temp;
    }

    public forceSpam() {
        if ( this.waitingForceSpam ) { return; }
        if ( this.timeoutSeed ) {
            clearTimeout(this.timeoutSeed);
            this.timeoutSeed = null;
        }
        this.waitingForceSpam = true;
        this.currentSpamWait = this.getRandomArrayItem([1000, 2000, 1400]);
        this.lauchSpamBalls();
    }

    public upgradeDificulty() {
        this.currentDificulty++;
        const index = Math.min(this.currentDificulty, this.difficulties.length - 1);
        const dificulty = this.difficulties[index];
        this.dificultyConfig = dificulty;
        console.log('dificulty: ', this.dificulty);
    }

    private lauchSpamBalls() {
        let self = this;
        this.timeoutSeed = setTimeout(() => {
            self.bucket = self.bucket.concat(self.spamBalls());
            self.lauchSpamBalls();
            self.waitingForceSpam = false;
        }, this.currentSpamWait);
    }

    private spamBalls(): Array<Ball> {
        if ( this.finished ) { return []; }

        if ( this.onlyOnce ) {
            this.finished = true;
        }

        let balls = Array<Ball>();
        let spamRate = this.dificultyConfig.ballsRange;

        for ( let i = spamRate.min; i < spamRate.max; i++ ) {

            const group = new PIXI.Container() as CustomContainer;
            const sprite = this.getBallSprite();
            const ball = new Ball(group);
            const position = this.getSpamPosition();
            const velocity = this.getRandomArrayItem(this.dificultyConfig.velocity);
            const keyText = this.createKeyboardBallText();
            const key = this.getRandomArrayItem(this.keyboardKeys);

            ball.keyboardKey = key;
            keyText.text = key;
            keyText.x = 25;
            keyText.y = 10;

            sprite.x = 0;
            sprite.y = 20;

            group.addChild(keyText);
            group.addChild(sprite);
            group.x = position.x;
            group.y = position.y;
            group.vx = 1;
            group.vy = velocity;
            group.pivot.set(45);

            balls.push(ball);

        }

        this.currentSpamWait = this.getRandomArrayItem(this.dificultyConfig.ballsSpamRate);

        return balls;
    }

    private setupKeyboardKeys() {
        this.keyboardKeys = suffle([
            'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
            'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
            'Z', 'X', 'C', 'V', 'B', 'N', 'M',
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
        ]);
    }

    private setupSpamPositions(ys = [30]) {
        const diffs = [0, 10, -10];
        let data = new Array<{x: number, y: number}>();
        for ( let y of ys ) {
            const diffIndex = randomInt(0, diffs.length - 1);
            let cumulated = 40;
            while ( cumulated < Environment.width - 30) {
                data.push({x: cumulated, y: y});
                cumulated += 40 + diffs[diffIndex];
            }
        }
        this.spamPositions = data;
    }

    private setupTextStyle() {
        const counterStyle = new PIXI.TextStyle({
            fill: '#e6532e',
            stroke: '#8d0031',
            fontFamily: 'Arial',
            strokeThickness: 1,
            fontSize: 22
        });
        this.keyboardTextStyle = counterStyle;
    }

    private getBallSprite(): CustomSprite {
        const index = randomInt(0, this.kittensTextures.length - 1);
        const texture = this.kittensTextures[index];
        const sprite = new PIXI.Sprite(texture) as CustomSprite;
        return sprite;
    }

    private getSpamPosition() {
        if ( this.spamPositions.length <= 3 ) {
            this.setupSpamPositions();
        }
        let x = randomInt(0, this.spamPositions.length - 1);
        assert( x >= 0 && x <= this.spamPositions.length - 1, 'spamPosition error');
        return this.spamPositions.splice(x, 1)[0];
    }

    private getRandomArrayItem<T>(collection: Array<T>) {
        let x = randomInt(0, collection.length - 1);
        return collection[x];
    }

    private createKeyboardBallText(): PIXI.Text {
        const xText1a = new PIXI.Text('-', this.keyboardTextStyle);
        xText1a.anchor.set(0.5, 0.5);
        xText1a.x = 10;
        xText1a.y = 25;
        return xText1a;
    }

    private setupDificulties() {
        this.difficulties = DIFICULTIES;
    }

}
