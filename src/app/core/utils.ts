import * as PIXI from 'pixi.js';
import * as PIXI_SOUND from 'pixi-sound';

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function assert(condition: any, message: string | any = null) {
    if (!condition) {
        let parsedMessage = '';
        if ( message ) {
            parsedMessage = 'Assertion failed: ' + message;
        } else {
            parsedMessage = 'Assertion failed';
        }
        if (typeof Error !== 'undefined') {
            throw new Error(parsedMessage);
        }
        throw parsedMessage; // Fallback
    }
}

export function suffle<T>(list: Array<T>): Array<T> {
    return list.sort(() => Math.random() - 0.5);
}


export function getSound(id: string) {
    const loader = PIXI.Loader.shared;
    const resource = loader.resources[id];
    // resource.sound -> is undefined
    const sound: HTMLAudioElement & {stop: Function, stopAndPlay: ()  => Promise<void>} = <any>resource.data;

    try {
        sound.stop = function() {
            const self = this as HTMLAudioElement;
            self.pause();
            self.currentTime = 0;
        };
        sound.stopAndPlay = function() {
            const self = this as HTMLAudioElement;
            if ( !self.paused ) {
                self.pause();
            }
            self.currentTime = 0;
            return self.play();
        };
    } catch (e) {
        console.log(sound);
    }

    return sound;
}
