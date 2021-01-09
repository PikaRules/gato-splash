import * as PIXI from 'pixi.js';
import { TsumuTemplate, SplashIcon, MenuDeadCatIcon, MenuLifeCatIcon, MenuBottomBackgroundTile } from './core/assets-names.constant';

export function loadAllResources(callback: (loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => void) {

    PIXI.Loader.shared
    .add(TsumuTemplate)
    .add(SplashIcon)
    .add(MenuDeadCatIcon)
    .add(MenuLifeCatIcon)
    .add(MenuBottomBackgroundTile)
    .load(callback);

}


