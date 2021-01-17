import * as PIXI from 'pixi.js';
import { Images } from '../core/assets-names.constant';
import { Environment } from '../core/defaults.constant';

const Container = PIXI.Container;
const loader = PIXI.Loader.shared;

export interface GameOverScene {
    container: PIXI.Container;
    adjustUserScore: (userScore: number) => void;
}

export function gameOverSceneProvider(onBackgroundClick: Function): GameOverScene {

    const backgroundScene = new Container();
    backgroundScene.width = Environment.width;
    backgroundScene.height = Environment.height;

    let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    bg.width = Environment.width;
    bg.height = Environment.height;
    bg.tint = 0xee212f;
    if ( onBackgroundClick ) {
        bg.interactive = true;
        bg.on('click', onBackgroundClick);
    }

    backgroundScene.addChild(bg);


    const bgPattern1 = new PIXI.Sprite(loader.resources[Images.EndingBGPattern1].texture);
    backgroundScene.addChild(bgPattern1);

    const style1 = new PIXI.TextStyle({
        fontSize: 32,
        fontFamily: 'Arial Black',
        fill: 'white',
        stroke: 'black',
        strokeThickness: 3,
        dropShadow: true,
        dropShadowAngle: 0.5235987755982988,
        dropShadowColor: 'black',
        dropShadowDistance: 5
    });

    const style2 = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 22,
        fill: '#fdff00',
        dropShadow: true,
        dropShadowAngle: 0.5235987755982988,
        dropShadowColor: 'black',
        dropShadowDistance: 1
    });

    const style3 = new PIXI.TextStyle({
        fontSize: 18,
        fontFamily: 'Arial',
        strokeThickness: 1,
        fill: 'white',
        stroke: 'black',
        dropShadow: true,
        dropShadowAngle: 0.5235987755982988,
        dropShadowColor: 'black',
        dropShadowDistance: 2
    });

    const score = new PIXI.Text(`new top score: 0`, style3);
    score.anchor.set(0.5, 0.5);
    score.x = Environment.width / 2;
    score.y = Environment.height * 0.5;
    backgroundScene.addChild(score);

    const userScoreTxt = new PIXI.Text(`Congratulations!`, style1);
    userScoreTxt.anchor.set(0.5, 0.5);
    userScoreTxt.x = Environment.width / 2;
    userScoreTxt.y = Environment.height * 0.6;
    backgroundScene.addChild(userScoreTxt);

    const gameOverText = new PIXI.Text('Game Over', style1);
    gameOverText.anchor.set(0.5, 0.5);
    gameOverText.x = Environment.width / 2;
    gameOverText.y = Environment.height * 0.3;

    const retryText = new PIXI.Text('Click to retry', style2);
    retryText.anchor.set(0.5, 0.5);
    retryText.x = Environment.width / 2;
    retryText.y = Environment.height * 0.8;

    backgroundScene.addChild(gameOverText);
    backgroundScene.addChild(retryText);

    return {
        container: backgroundScene,
        adjustUserScore: adjustUserScore
    };

    function adjustUserScore(userScore: number) {

        const congratulationsStyle = new PIXI.TextStyle({
            fontFamily: 'Comic Sans MS',
            fontSize: 34,
            fontWeight: 'bold',
            fill: 'yellow',
            stroke: 'blue',
            strokeThickness: 2
        });

        let showCongratulations = false;
        const topScore = parseInt(window.localStorage.getItem('topScore') || '0', 10);
        if ( userScore > topScore ) {
            showCongratulations = true;
            window.localStorage.setItem('topScore', userScore + '');
        }

        if ( showCongratulations ) {
            score.anchor.set(0.5, 0.5);
            score.text = `new top score: ${userScore}`;
            score.style = style3;
            score.x = Environment.width / 2;
            score.y = Environment.height * 0.5;

            userScoreTxt.anchor.set(0.5, 0.5);
            userScoreTxt.text = `Congratulations!`;
            userScoreTxt.style = congratulationsStyle;
            userScoreTxt.x = Environment.width / 2;
            userScoreTxt.y = Environment.height * 0.6;
        } else {
            score.anchor.set(0.5, 0.5);
            score.text = `Top score: ${topScore}`;
            score.style = style3;
            score.x = Environment.width / 2;
            score.y = Environment.height * 0.5;
            backgroundScene.addChild(score);

            userScoreTxt.anchor.set(0.5, 0.5);
            userScoreTxt.text = `your score: ${userScore}`;
            userScoreTxt.style = style3;
            userScoreTxt.x = Environment.width / 2;
            userScoreTxt.y = Environment.height * 0.6;
            backgroundScene.addChild(userScoreTxt);
        }

    }

}

