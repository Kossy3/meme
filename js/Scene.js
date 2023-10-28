'use strict';

class TitleText extends GameObject {
    constructor(x, y) {
        super(x, y);
    }
    render(screen) {
        const ctx = screen.c.getContext('2d');
        ctx.fillStyle = "blue";
        ctx.font = `bold ${screen.getX(300)}px さわらび明朝 `;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.fillText("大集合", 0, screen.getY(600));
        ctx.fillStyle = "gold";
        ctx.fillText("★", screen.getY(300), screen.getY(900));
        ctx.fillStyle = "orange";
        ctx.font = `bold ${screen.getX(900 / 8)}px selif `;
        ctx.fillText("サモンズめぇめぇ", 0, screen.getY(1100));
    }
}

class StartButton extends Button {
    constructor(rect, texture) {
        super(rect, texture);
        this.click = false;
        this.addEventListener("click", (e) => {
            const synth = new WebAudioTinySynth();
            synth.loadMIDI(assets.bgm1);
            //synth.playMIDI();
            console.log("click");
            //let wait = createWaitScene(assets)
            inviting = true;
            this.click = true;
        })
    }
    update() {
        if (this.click) {
            //screen.setScene(wait);
            this.click = false;
        }
    }

    render(screen) {
        super.render(screen);
        const ctx = screen.c.getContext('2d');
        const text = "はじめる"
        ctx.fillStyle = "green";

        const px = screen.getX(this.w / text.length);
        ctx.font = `bold ${px}px さわらび明朝 `;
        ctx.fillText("はじめる", screen.getX(this.x), screen.getY(this.y + px/2 + this.h/2));
    }
}
class WaitText extends GameObject {
    constructor() {
        super()
        this.txt = "..."
        this.count = 0;
    }
    update() {
        this.count++;
        if (this.count > 30) {
            this.count = 0;
            this.txt = Array(1 + (this.txt.length + 1) % 4).join(".");
        }
    }
    render(screen) {
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(900 / 8)}px selif `;
        ctx.fillText("対戦相手を", 0, screen.getY(1000));
        ctx.fillText("探しています" + this.txt, 0, screen.getY(1100));
    }
}

class testText extends GameObject {
    render(ctx, screen) {
        ctx.fillStyle = "red";
        ctx.font = `bold ${screen.getX(900 / 8)}px selif `;
        ctx.fillText("対戦相手を発見", 0, screen.getY(1000));
    }
}

class TitleScene extends Scene {
    constructor() {
        super();
        const sogenImgae = new Texture(assets.sogen, new Rect(0, 0, 32, 32));
        this.addGameObject(new Sprite(new Rect(0, 0, 900, 1600), sogenImgae));
        const btnImage = new Texture(assets.button, new Rect(0, 0, 16, 16));
        this.addGameObject(new StartButton(new Rect(300, 1200, 300, 150), btnImage));
        this.addGameObject(new TitleText());
        const memeImage  = new Texture(assets.me, new Rect(0, 0, 64, 64));
        this.addGameObject(new Sprite(new Rect(400, 1300, 300, 300), memeImage));
    }

}

const createWaitScene = () => {
    let wait = new Scene();
    socket.emit('invite', "come on");
    wait.addGameObject(new Texture(assets.sogen, new Rect(0, 0, 900, 1600)))
    wait.addGameObject(new WaitText());
    return wait;
}

const createGameScene = () => {
    inviting = false;
    inGame = true;
    let game = new Scene();
    game.addGameObject(new Texture(assets.sogen, new Rect(0, 0, 900, 1600)))
    let btn1 = new Texture(assets.button, new Rect(0, 1200, 300, 150));
    game.addGameObject(btn1);
    let btn2 = new Texture(assets.button,new Rect(300, 1200, 300, 150));
    game.addGameObject(btn2);
    let btn3 = new Texture(assets.button, Rect(600, 1200, 300, 150));
    game.addGameObject(btn3);
    return game;
}
