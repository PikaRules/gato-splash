import * as PIXI from 'pixi.js';
import { CustomContainer } from '../core/custom-sprite';

export class Ball {

    public keyboardKey: string;
    public userTypedKey = '';

    constructor(
        public sprite: CustomContainer
    ) {}
}
