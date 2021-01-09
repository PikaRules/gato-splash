import * as PIXI from 'pixi.js';

export interface CustomSprite extends PIXI.Sprite {
    vx?: number;
    vy?: number;
    pointerdownBindFunc?: () => void;
}
