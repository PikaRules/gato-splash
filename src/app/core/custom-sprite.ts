import * as PIXI from 'pixi.js';

export interface CustomSprite extends PIXI.Sprite {
    vx?: number;
    vy?: number;
    pointerdownBindFunc?: () => void;
}

export interface CustomContainer extends PIXI.Container {
    vx?: number;
    vy?: number;
    pointerdownBindFunc?: () => void;
}
