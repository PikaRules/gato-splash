import * as PIXI from 'pixi.js';
import * as Resources from './core/assets-names.constant';

export function loadAllResources(callback: (loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => void) {

    for ( let itemIndex in Resources.Images ) {
        if ( Resources.Images.hasOwnProperty(itemIndex)) {
            const resource = Resources.Images[itemIndex];
            PIXI.Loader.shared.add(resource);
        }
    }

    for ( let itemIndex in Resources.Sounds ) {
        if ( Resources.Sounds.hasOwnProperty(itemIndex)) {
            const resource = Resources.Sounds[itemIndex] as {key: string, url: string};
            PIXI.Loader.shared.add(resource.key, resource.url);
        }
    }

    PIXI.Loader.shared.load(callback);

}


