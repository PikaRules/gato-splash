import * as PIXI from 'pixi.js';
import { TsumuTemplate } from '../core/assets-names.constant';
import { CustomSprite } from '../core/custom-sprite';

const loader = PIXI.Loader.shared;

export class BallSpammer {

    public onlyOnce = false;
    public timeBetweenSpams = 0;
    public max = 1;
    public min = 1;
    public get hasStarted() { return this._hasStarted; }
    private bucket = new Array<CustomSprite>();
    private finished = false;
    private timeoutSeed: ReturnType<typeof setTimeout>;
    private _hasStarted = false;

    public start() {
        const self = this;
        if ( this._hasStarted ) { return; }
        this._hasStarted = true;
        if ( this.timeoutSeed ) {
            clearTimeout(this.timeoutSeed);
            this.timeoutSeed = null;
        }
        this.timeoutSeed = setTimeout(() => {
            self.bucket = self.spamBalls();
        }, this.timeBetweenSpams);
    }

    public stop() {
        if ( this.timeoutSeed ) {
            clearTimeout(this.timeoutSeed);
            this.timeoutSeed = null;
        }
    }

    public fetch(): Array<CustomSprite> {
        let temp = this.bucket;
        this.bucket = [];
        return temp;
    }

    private spamBalls(): Array<CustomSprite> {
        if ( this.finished ) { return []; }

        if ( this.onlyOnce ) {
            this.finished = true;
        }

        let balls = Array<CustomSprite>();
        for ( let i = 0; i < this.max; i++ ) {
            let ball = new PIXI.Sprite(loader.resources[TsumuTemplate].texture) as CustomSprite;
            ball.x = 150;
            ball.y = 0;
            ball.vx = 1;
            ball.vy = 1;
            ball.anchor.set(0.5, 0.5);
            balls.push(ball);
        }

        return balls;
    }
}
