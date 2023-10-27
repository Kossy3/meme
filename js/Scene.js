'use strict';
const createTitleScene = (assets) => {
    let title = new Scene();
    title.addObject(new Image2D(assets.sogen, Config.d(0, 0, 900, 1600)));
    let btn = new Image2D(assets.button, Config.d(300, 1200, 300, 150));
    title.addObject(new Button((e) => {
        let synth = new WebAudioTinySynth({ voices: 64 });
        synth.loadMIDI(assets.bgm1);
        setTimeout(() => { synth.playMIDI(); }, 1000)
    }, btn));
    title.addObject(new TitleText());
    title.addObject(new Image2D(assets.me, Config.d(400, 1300, 300, 300)));
    return title;
}

const createWaitScene = (assets) => {
    let wait = new Scene();
    wait.addObject(new Image2D(assets.sogen, Config.d(0, 0, 900, 1600)))
}
