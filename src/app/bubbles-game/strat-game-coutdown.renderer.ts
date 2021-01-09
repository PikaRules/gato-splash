import * as PIXI from 'pixi.js';
import { Environment } from '../core/defaults.constant';


export class StartGameCountDownRenderer {

    public count = 3;
    private currentText: PIXI.Text;
    private currentTinker: PIXI.Ticker;
    private container: PIXI.Container;
    private callback: Function;

    public start(container: PIXI.Container, callback: Function) {
        this.callback = callback;
        this.container = container;
        this.currentText = this.createText();
        container.addChild(this.currentText);
        this.startAnimation();
    }

    private startAnimation() {
        let counter = this.count;
        const scale = 2;

        this.currentText.text = '' + counter;
        this.currentText.scale.set(2, 2);
        this.currentText.alpha = 1;

        const animationDuration = 1000;
        const self = this;

        this.animateNumber(self.currentText, animationDuration, scale, () => { self.animateNext(counter - 1, animationDuration, scale); });
    }

    private animateNext(counter: number, animationDuration: number, scale: number) {
        let self = this;
        if ( counter > 0 ) {
            this.currentText.text = '' + counter;
            this.animateNumber(this.currentText, animationDuration, scale, () => { self.animateNext(counter - 1, animationDuration, scale); });
        } else {
            this.currentText.text = 'start';
            setTimeout(() => {
                self.container.removeChild(self.currentText);
                self.container = null;
                if ( typeof self.callback === 'function' ) {
                    self.callback();
                }
            }, 400);
        }
    }

    private animateNumber(text: PIXI.Text, animationDuration: number, scale: number, complete: Function) {
        const self = this;
        let startTime: number = performance.now();

        const loop = () => {
            const currentTime = performance.now();
            const ellpasedTime = currentTime - startTime;
            const maxBit = animationDuration * 0.8; // 100%
            const multiplier = Math.min(1, ((ellpasedTime * 100) / maxBit) / 100);
            const newScale = Math.max(1, scale - ((scale - 1) * multiplier));
            // console.log(' multiplier: ', multiplier);
            // console.log(' newScale: ', newScale);
            console.log(' ellpasedTime: ', ellpasedTime);
            text.alpha = multiplier;
            text.scale.set(newScale, newScale);
            if ( ellpasedTime >= animationDuration ) {
                self.currentTinker.remove(loop);
                complete();
            }
        };

        this.currentTinker = PIXI.Ticker.shared.add(loop);
    }

    private createText() {
        const style = new PIXI.TextStyle({
            fill: '#0be893',
            fontFamily: 'Comic Sans MS',
            fontStyle: 'italic',
            strokeThickness: 4,
            fontSize: 24
        });
        const text = new PIXI.Text('3', style);
        text.anchor.set(0.5, 0.5);
        text.x = Environment.width / 2;
        text.y = Environment.height / 2;
        return text;
    }
}
