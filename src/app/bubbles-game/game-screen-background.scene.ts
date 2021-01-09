import * as PIXI from 'pixi.js';
import { MenuBottomBackgroundTile, MenuDeadCatIcon, MenuLifeCatIcon } from '../core/assets-names.constant';
import { Environment } from '../core/defaults.constant';

const Container = PIXI.Container;
const loader = PIXI.Loader.shared;

export function gameScreenBackgroundSceneProvider() {

    const backgroundScene = new Container();
    backgroundScene.width = Environment.width;
    backgroundScene.height = Environment.height;

    const canvas = document.createElement('canvas');
    canvas.width = Environment.width;
    canvas.height = Environment.height;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, Environment.height);
    gradient.addColorStop(0, '#01A8FF');
    gradient.addColorStop(1, '#CDF1FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, Environment.width, Environment.height);

    const sprite = new PIXI.Sprite(PIXI.Texture.from(canvas));
    sprite.x = 0;
    sprite.y = 0;

    // bottom menu
    const bgTileHeight = 44;
    const backgroundTileTexture = loader.resources[MenuBottomBackgroundTile].texture;
    const backgroundSprite = new PIXI.TilingSprite(backgroundTileTexture, Environment.width, 44);
    backgroundSprite.x = 0;
    backgroundSprite.y = Environment.height - bgTileHeight;

    const catLifeIcon = new PIXI.Sprite(loader.resources[MenuLifeCatIcon].texture);
    catLifeIcon.anchor.set(0.5, 0.5);
    catLifeIcon.x = 30;
    catLifeIcon.y = Environment.height - 20;
    catLifeIcon.scale.set(0.7, 0.7);

    const catDeadIcon = new PIXI.Sprite(loader.resources[MenuDeadCatIcon].texture);
    catDeadIcon.anchor.set(0.5, 0.5);
    catDeadIcon.x = 30 + 50 + 40;
    catDeadIcon.y = Environment.height - 20;
    catDeadIcon.scale.set(0.7, 0.7);

    const xTextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'bold',
        fill: 'black',
        stroke: 'black',
        lineJoin: 'round'
    });

    const xText1 = new PIXI.Text('X', xTextStyle);
    xText1.anchor.set(0.5, 0.5);
    xText1.x = 30 + ((51 * 0.7) / 2) + 10;
    xText1.y = Environment.height - 20;

    const xText2 = new PIXI.Text('X', xTextStyle);
    xText2.anchor.set(0.5, 0.5);
    xText2.x = 30 + 50 + 40 + ((51 * 0.7) / 2) + 10;
    xText2.y = Environment.height - 20;

    backgroundScene.addChild(sprite);
    backgroundScene.addChild(backgroundSprite);
    backgroundScene.addChild(catDeadIcon);
    backgroundScene.addChild(catLifeIcon);
    backgroundScene.addChild(xText1);
    backgroundScene.addChild(xText2);

    return backgroundScene;
}
