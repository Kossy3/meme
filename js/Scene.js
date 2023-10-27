'use strict';
const createTitleScene = () => {
    let title = new Scene();
    title.addObject(new Image2D(assets.sogen, Config.d(0, 0, 900, 1600)));
    let btn = new Image2D(assets.button, Config.d(300, 1200, 300, 150));
    title.addObject(new Button((e) => {
        let synth = new WebAudioTinySynth({ voices: 64 });
        synth.loadMIDI(assets.bgm1);
        let wait = createWaitScene(assets)
        inviting = true;
        screen.setScene(wait);
    }, btn));
    title.addObject(new TitleText());
    title.addObject(new Image2D(assets.me, Config.d(400, 1300, 300, 300)));
    return title;
}

const createWaitScene = () => {
    let wait = new Scene();
    socket.emit('invite', "come on");
    wait.addObject(new Image2D(assets.sogen, Config.d(0, 0, 900, 1600)))
    wait.addObject(new WaitText());
    return wait;
}

const createGameScene = () => {
    inviting = false;
    inGame = true;
    let wait = new Scene();
    wait.addObject(new Image2D(assets.sogen, Config.d(0, 0, 900, 1600)))
    wait.addObject(new testText());
    return wait;
}
