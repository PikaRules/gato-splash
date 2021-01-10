import * as PIXI from 'pixi.js';
import { Images } from '../core/assets-names.constant';
import { Environment } from '../core/defaults.constant';

const Container = PIXI.Container;
const loader = PIXI.Loader.shared;

let meatBurstSprites = new Array<PIXI.Texture>();

export interface BackgroundScene {
    container: PIXI.Container;
    rescueCatsText: PIXI.Text;
    deadCatsText: PIXI.Text;
    heartsText: PIXI.Text;
}

export function gameScreenBackgroundSceneProvider(): BackgroundScene {

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
    const backgroundTileTexture = loader.resources[Images.MenuBottomBackgroundTile].texture;
    const backgroundSprite = new PIXI.TilingSprite(backgroundTileTexture, Environment.width, 44);
    backgroundSprite.x = 0;
    backgroundSprite.y = Environment.height - bgTileHeight;

    const catLifeIcon = new PIXI.Sprite(loader.resources[Images.MenuLifeCatIcon].texture);
    catLifeIcon.anchor.set(0.5, 0.5);
    catLifeIcon.x = 30;
    catLifeIcon.y = Environment.height - 20;
    catLifeIcon.scale.set(0.7, 0.7);

    const catDeadIcon = new PIXI.Sprite(loader.resources[Images.MenuDeadCatIcon].texture);
    catDeadIcon.anchor.set(0.5, 0.5);
    catDeadIcon.x = 30 + 50 + 40;
    catDeadIcon.y = Environment.height - 20;
    catDeadIcon.scale.set(0.7, 0.7);

    const xTextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'bold',
        fill: 'black',
        stroke: 'black'
    });

    const xText1 = new PIXI.Text('X', xTextStyle);
    xText1.anchor.set(0.5, 0.5);
    xText1.x = 30 + ((51 * 0.7) / 2) + 10;
    xText1.y = Environment.height - 18;

    const xText2 = new PIXI.Text('X', xTextStyle);
    xText2.anchor.set(0.5, 0.5);
    xText2.x = 30 + 50 + 40 + ((51 * 0.7) / 2) + 10;
    xText2.y = Environment.height - 18;

    const xText3 = new PIXI.Text('X', xTextStyle);
    xText3.anchor.set(0.5, 0.5);
    xText3.x = Environment.width - 50;
    xText3.y = Environment.height - 18;

    const heartIcon = new PIXI.Sprite(loader.resources[Images.HeartLife].texture);
    heartIcon.anchor.set(0.5, 0.5);
    heartIcon.x = Environment.width - 80;
    heartIcon.y = Environment.height - 20;
    heartIcon.scale.set(0.32, 0.32);

    // ---

    const counterStyle = new PIXI.TextStyle({
        fill: '#fafc23',
        fontFamily: 'Comic Sans MS',
        strokeThickness: 1,
        fontSize: 18
    });

    const xText1a = new PIXI.Text('0', counterStyle);
    xText1a.anchor.set(0.5, 0.5);
    xText1a.x = xText1.x + 20;
    xText1a.y = Environment.height - 20;

    const xText2a = new PIXI.Text('0', counterStyle);
    xText2a.anchor.set(0.5, 0.5);
    xText2a.x = xText2.x + 20;
    xText2a.y = Environment.height - 20;

    const xText3a = new PIXI.Text('0', counterStyle);
    xText3a.anchor.set(0.5, 0.5);
    xText3a.x = xText3.x + 20;
    xText3a.y = Environment.height - 20;

    // ---

    const gearSprite1 = createGearSprite();
    const gearSprite2 = createGearSprite();
    const gearSprite3 = createGearSprite();
    const gearSprite4 = createGearSprite();
    const gearSprite5 = createGearSprite();
    const gearSprite6 = createGearSprite();
    const gears = [gearSprite1, gearSprite2, gearSprite3, gearSprite4, gearSprite5, gearSprite6];
    const gPossIncre = Environment.width / gears.length;
    let acumulatedPoss = 30;

    for ( let item of gears ) {
        item.anchor.set(0.5, 0.5);
        item.x = acumulatedPoss;
        item.y = Environment.height - 30;
        item.loop = true;
        item.animationSpeed = 0.7;
        acumulatedPoss += gPossIncre;
    }

    backgroundScene.addChild(sprite);

    for ( let item of gears ) {
        backgroundScene.addChild(item);
    }

    backgroundScene.addChild(backgroundSprite);
    backgroundScene.addChild(catDeadIcon);
    backgroundScene.addChild(catLifeIcon);
    backgroundScene.addChild(xText1);
    backgroundScene.addChild(xText2);
    backgroundScene.addChild(heartIcon);
    backgroundScene.addChild(xText3);
    backgroundScene.addChild(xText1a);
    backgroundScene.addChild(xText2a);
    backgroundScene.addChild(xText3a);

    for ( let item of gears ) {
        item.play();
    }

    return {
        container: backgroundScene,
        rescueCatsText: xText1a,
        deadCatsText: xText2a,
        heartsText: xText3a
    };
}

function createGearSprite() {

    if ( meatBurstSprites.length === 0 ) {
        const width = 60;
        const height = 60;
        const base = loader.resources[Images.SharpGearTile].texture;

        const textrure1 = base.clone();
        textrure1.frame = new PIXI.Rectangle(0, 0, width, height);

        const textrure2 = base.clone();
        textrure2.frame = new PIXI.Rectangle(60, 0, width, height);

        const textrure3 = base.clone();
        textrure3.frame = new PIXI.Rectangle(120, 0, width, height);

        meatBurstSprites = [textrure1, textrure2, textrure3];
    }

    const sprite = new PIXI.AnimatedSprite(meatBurstSprites);

    return sprite;
}
