'use strict';
class BGM {
    constructor() {
        this.synth = new WebAudioTinySynth();
        this.vol = 0.1;
        this._interval = setInterval(() => { }, 1000);
    }
    play() {
        clearInterval(this._interval);
        this._interval = setInterval(this._loop.bind(this), 60000);
        this._loop();
    }

    _loop() {
        this.synth.loadMIDI(assets.bgm1);
        this.synth.setMasterVol(this.vol);
        this.synth.playMIDI();
    }
}

class TitleScene extends Scene {
    constructor() {
        super();
        const sogenImgae = new Texture(new Rect(0, 0, 64, 64), assets.sogen);
        Sogen(this);
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        this.addGameObject(new LoginText());
        this.addGameObject(new TitleText());
        const memeImage = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        this.addGameObject(new Sprite(new Rect(400, 1300, 300, 300), memeImage));
    }

}

class TitleText extends GameObject {
    constructor(x, y) {
        super(x, y);
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "#ffa500";
        ctx.font = `bold ${screen.getX(600 / 4)}px sans-serif `;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.fillText("大集合", screen.getX(150), screen.getY(500));
        ctx.fillStyle = "gold";
        ctx.fillText("★", screen.getY(150 + 600 / 4 * 3), screen.getY(500));
        ctx.fillStyle = "#FFFFE0";
        ctx.font = `bold ${screen.getX(800 / 4)}px sans-serif `;
        ctx.fillText("サモンズ", screen.getX(50), screen.getY(750));
        ctx.fillText("めぇめぇ", screen.getX(50), screen.getY(1000));
    }
}

class LoginText extends GameObject {
    constructor(x, y) {
        super(x, y);
        this._txt = "..."
        this._count = 0;
    }
    update(screen) {
        if (game.login) {
            this._destroy();
            const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
            this._spawn(new StartButton(new Rect(300, 1200, 300, 150), btnImage, "　はじめる　"));
            this._spawn(new SettingButton(new Rect(50, 1200, 200, 150), btnImage, "　せってい　"));
            this._spawn(new HelpButton(new Rect(650, 1200, 200, 150), btnImage, "　あそびかた　"));
        }
        this._count++;
        if (this._count > 5) {
            this._count = 0;
            this._txt = Array(1 + (this._txt.length + 1) % 4).join(".");
        }
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(300 / 6)}px sans-serif `;
        ctx.fillText("ログイン中" + this._txt, screen.getX(300), screen.getY(1300));
    }
}

class StartButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, text);
        this.click = false;
        this.addEventListener("click", (e) => {
            bgm.play();
            console.log("click");
            game.inviting = true;
            this.click = true;
        });
    }
    update(screen) {
        if (this.click) {
            const wait = new WaitScene()
            screen.setScene(wait);
            this.click = false;
        }
    }
}

class SettingButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, text);
        this.click = false;
        this.addEventListener("click", (e) => {
            this.click = true;
        });
    }
    update(screen) {
        super.update();
        if (this.click) {
            const setting = new SettingScene();
            screen.setScene(setting);
            this.click = false;
        }
    }
}

class HelpButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, text);
        this.click = false;
        this.addEventListener("click", (e) => {
            this.click = true;
        });
    }
    update(screen) {
        super.update();
        if (this.click) {
            const setting = new HelpScene();
            screen.setScene(setting);
            this.click = false;
        }
    }
}

class HelpScene extends Scene {
    constructor() {
        super();
        Sogen(this);
        this.addGameObject(new HelpText());
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        const memeImgae = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        this.addGameObject(new Sprite(new Rect(70 + 45 * 4, 900 / 8 + 100, 60, 60), memeImgae));
        const bananaImgae = new Texture(new Rect(0, 0, 16, 16), assets.banana);
        this.addGameObject(new Sprite(new Rect(20 + 45 * 2, 900 / 8 + 155, 50, 50), bananaImgae));
        this.addGameObject(new EndButton(new Rect(300, 1400, 300, 150), btnImage, "タイトルへ"));
    }
}

class HelpText extends GameObject {

    render(screen) {
        const ctx = screen.ctx;
        let y = 0;
        let x = 20;
        
        ctx.fillStyle = "darkblue";
        y += 900 / 8;
        ctx.font = `bold ${screen.getX(900 / 8)}px sans-serif `;
        ctx.fillText("-- あそびかた --", screen.getX(x), screen.getY(y));

        ctx.font = `bold ${screen.getX(900 / 20)}px sans-serif `;
        y += 90;
        ctx.fillStyle = "#FFB900";
        ctx.fillText("      大集合", screen.getX(x), screen.getY(y));
        ctx.fillStyle = "yellow";
        ctx.fillText("      ★", screen.getX(x + 900 / 20 * 3), screen.getY(y));
        ctx.fillStyle = "#FFFFE0";
        ctx.fillText("      サモンズめぇめぇ", screen.getX(x + 900 / 20 * 4), screen.getY(y));
        ctx.fillStyle = "darkgreen";
        ctx.shadowColor = "#FEEDC1";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText("      とは、", screen.getX(x + 900 / 20 * 12), screen.getY(y));
        y += 60;
        ctx.font = `bold ${screen.getX(900 / 20)}px sans-serif `;
        ctx.fillText("    めぇめぇ　にめぇれぇして、牧場の", screen.getX(x), screen.getY(y));
        y += 45;
        ctx.fillText("えさ　をうばいあうオンラインゲームです", screen.getX(x), screen.getY(y));
        y += 60;
        ctx.fillText(" 10秒に１度、自分のめぇめぇにめぇれぇ", screen.getX(x), screen.getY(y));
        y += 45;
        ctx.fillText("をすることができます。相手のえさを先に", screen.getX(x), screen.getY(y));
        y += 45;
        ctx.fillText("        食べつくしたほうが勝ちです。", screen.getX(x), screen.getY(y));
        y += 100;
        ctx.fillText("【めぇれぇリスト】", screen.getX(x), screen.getY(y));
        y += 45;
        ctx.fillText("・よぶ　　　：めぇめぇを１ぴきよぶ", screen.getX(0), screen.getY(y));
        y += 60;
        ctx.fillText("・とつげき　：めぇめぇを１ぴき消費し、", screen.getX(0), screen.getY(y));
        y += 45;
        ctx.fillText("　　　　　　　相手のえさを食べる", screen.getX(0), screen.getY(y));
        y += 60;
        ctx.fillText("・くっしょん：めぇめぇを１ぴき使い、", screen.getX(0), screen.getY(y));
        y += 45;
        ctx.fillText("　　　　　　　とつげきを防ぐ", screen.getX(0), screen.getY(y));
        y += 45;
        ctx.fillText("　　　　　　　　※めぇめぇを消費しない", screen.getX(0), screen.getY(y));
        y += 60;
        ctx.fillText("スーパー", screen.getX(900 / 20), screen.getY(y - 20));
        ctx.fillText("とつげき", screen.getX(900 / 20), screen.getY(y + 20));
        ctx.font = `bold ${screen.getX(900 / 20)}px sans-serif `;
        ctx.fillText("・　　　　　：めぇめぇを３ひき消費し、", screen.getX(0), screen.getY(y));
        y += 45;
        ctx.fillText("　　　　　　　相手のえさを食べる", screen.getX(0), screen.getY(y));
        y += 45;
        ctx.fillText("　　　　　　　くっしょんを無視できる", screen.getX(0), screen.getY(y));
        y += 80;
        ctx.fillText("    とつげき、スーパーとつげき同士は", screen.getX(x), screen.getY(y));
        y += 45;
        ctx.fillText("   相殺されてどちらのえさも減りません。", screen.getX(x), screen.getY(y));
        y += 80;
        ctx.fillText("　ゲームに慣れたら、「せってい」から", screen.getX(x), screen.getY(y));
        y += 45;
        ctx.fillText(" 「たつじんめぇれぇ」も選んでみてね。", screen.getX(x), screen.getY(y));
        y += 80;
        ctx.fillStyle = "darkred";
        ctx.fillText("めぇめぇにじょうずにめぇれぇをだして", screen.getX(x+25), screen.getY(y));
        y += 45;
        ctx.fillText("　　　すべてのえさを手に入れよう！", screen.getX(x), screen.getY(y));
    }
}

class WaitScene extends Scene {
    constructor() {
        super();
        socket.emit('invite', "come on");
        Sogen(this);
        this.waitText = new WaitText();
        this.addGameObject(this.waitText);
    }
    start(enemy) {
        this.addGameObject(new WaitMatchingText(enemy));
        this.removeGameObject(this.waitText);
    }
}

class WaitText extends GameObject {
    constructor(x, y) {
        super(x, y)
        this.txt = "..."
        this.count = 0;
    }
    update(screen) {
        this.count++;
        if (this.count > 30) {
            this.count = 0;
            this.txt = Array(1 + (this.txt.length + 1) % 4).join(".");
        }
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "#FFFFE0";
        ctx.font = `bold ${screen.getX(900 / 8)}px sans-serif `;
        ctx.fillText("対戦相手を", screen.getX(900 / 5), screen.getY(1000));
        ctx.fillText("探しています" + this.txt, screen.getX(900 / 5 - 900 / 8), screen.getY(1100));
    }
}

class WaitMatchingText extends GameObject {
    constructor(enemy) {
        super()
        this.enemy = enemy;
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "blue";
        ctx.font = `bold ${screen.getX(900 / 9)}px sans-serif `;
        ctx.fillText("対戦相手", screen.getX(50), screen.getY(500));
        ctx.font = `bold ${screen.getX(900 / 10)}px sans-serif `;
        ctx.fillText(this.enemy.name, screen.getX(50), screen.getY(700));
    }
}

class EndScene extends Scene {
    constructor(result) {
        super();
        Sogen(this);
        if (result == "win") {
            this.addGameObject(new WinText());
        } else {
            this.addGameObject(new LoseText());
        }

        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        this.addGameObject(new EndButton(new Rect(300, 1000, 300, 150), btnImage, "タイトルへ"));
    }
}

class EndButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, text);
        this.click = false;
        this.addEventListener("click", (e) => {
            this.click = true;
        });
    }
    update(screen) {
        super.update();
        if (this.click) {
            const title = new TitleScene()
            screen.setScene(title);
            this.click = false;
        }
    }
}

class WinText extends GameObject {
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "red";
        ctx.font = `bold ${screen.getX(300)}px sans-serif `;
        ctx.fillText("かった", 0, screen.getY(600));
    }
}

class LoseText extends GameObject {
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "blue";
        ctx.font = `bold ${screen.getX(300)}px sans-serif `;
        ctx.fillText("まけた", 0, screen.getY(600));
    }
}

class SettingScene extends Scene {
    constructor() {
        super();
        const input = document.createElement('input');
        input.type = 'text';
        document.body.appendChild(input);
        input.style.position = 'absolute';
        input.style.top = '0px';
        input.style.left = '0px';
        input.value = game.name;
        input.style.display = "none";
        this.input = input;
        Sogen(this);
        this.addGameObject(new SettingNameLabelText());
        this.addGameObject(new SettingNameText(input));
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        this.addGameObject(new EndButton(new Rect(300, 1400, 300, 150), btnImage, "タイトルへ"));
        this.addEventListener("change", (e) => {
            input.remove();
        })
        this.spActs = Object.keys(game.types).slice(4);
        this.spActButtons = [];
        this.addGameObject(new SettingActionLabel(input));
        for (let i = 0; i < this.spActs.length; i++) {
            const btn = new SettingActionButton(new Rect(300 * (i % 3), 300 + 150 * Math.floor(i / 3), 290, 150), btnImage, this.spActs[i]);
            this.addGameObject(btn);
            this.spActButtons.push(btn);
        }
        socket.emit("setSpAct", "");
        this.helps = []
        this.helps.push(new SettingActionHelpText(800));
        this.helps.push(new SettingActionHelpText(1050));
        this.addGameObject(this.helps[0]);
        this.addGameObject(this.helps[1]);
    }

    spAct(types) {
        this.spActButtons.forEach((btn) => {
            btn.select(types.includes(btn.type));
        })
        for(let i=0; i<types.length; i++) {
            this.helps[i].setHelp(types[i]);
        }
    }

    update(screen) {
        super.update(screen);
        const rect = screen._content.getBoundingClientRect();
        this.input.style.top = `${rect.top + screen.getY(50)}px`;
        this.input.style.left = `${rect.left + screen.getX(300)}px`;
        this.input.style.width = `${screen.getX(300)}px`;
        this.input.style.height = `${screen.getX(50)}px`;
    }
}


class SettingNameLabelText extends GameObject {
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(50)}px sans-serif `;
        ctx.fillText("おなまえ", screen.getX(50), screen.getY(100));
    }
}

class SettingNameText extends Button {
    constructor(input) {
        const btnImage = new Texture(new Rect(0, 0, 16, 16), new Image());
        const rect = new Rect(300, 50, game.name.length * 50, 100);
        super(rect, btnImage, "");
        this.input = input;
        this.click = false;
        this.addEventListener("click", (e) => {
            this.click = true;
        });
    }
    update(screen) {
        super.update();
        if (this.click) {
            this.input.style.display = "block";
            this._spawn(new SettingNameButton(this.input))
            this._destroy();
            this.click = false;
        }
    }
    render(screen) {
        super.render(screen);
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(50)}px sans-serif `;
        ctx.fillText(game.name, screen.getX(300), screen.getY(100));
    }
}

class SettingNameButton extends Button {
    constructor(input) {
        const rect = new Rect(650, 50, 200, 75);
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        super(rect, btnImage, "けってい");
        this.input = input;
        this.click = false;
        this.addEventListener("click", (e) => {
            this.click = true;
        });
    }
    update(screen) {
        super.update();
        if (this.click) {
            this.input.style.display = "none";
            this._spawn(new SettingNameText(this.input))
            this._destroy();
            socket.emit('name', this.input.value);
            this.click = false;
        }
    }
}

class SettingActionLabel extends GameObject {
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(50)}px sans-serif `;
        ctx.fillText("たつじんめぇれぇ(2つまで)", screen.getX(50), screen.getY(250));
    }
}

class SettingActionHelpText extends GameObject {
    constructor(y) {
        super();
        this.y = y;
        this.helpTexts = {
            "dxAtk": "デラックスとつげき：えさ1コとめぇめぇ1ぴきを消費し、めぇめぇデラックスを作ってとつげきさせる。このとつげきはスーパーとつげきとみなされる。",
            "heso": "へそくり：めぇめぇを2ひき消費し、えさを1コ補充する。",
            "dbAtk": "ダブルとつげき：めぇめぇ2ひきでとつげきする。相手のとつげきを無視できる。", 
            "ult": "いっせいとつげき：めぇめぇ10ぴきでとつげきし、相手のえさを全て食べつくす。", 
            "spy": "すぱい：めぇめぇを1ぴき消費し、相手の牧場に派遣する。相手は次のめぇれぇでくっしょんを使えない。", 
            "spDfn": "スーパーくっしょん：めぇめぇ1ぴきを消費し、相手のとつげき、ダブルとつげきをはねかえす。", 
            "wairo": "わいろ：えさ1コとめぇめぇ1ぴきを消費し、とつげき、ダブルとつげき、スーパーとつげき、デラックスとつげき、いっせいとつげきしてきた相手のめぇめぇを買収する。"
        }
        this.help = "";
    }
    setHelp(type) {
        this.help = this.helpTexts[type];
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(30)}px sans-serif `;
        for (let i=0; i<this.help.length ; i+=27){
            const text = this.help.slice(i, i+27);
            ctx.fillText(text, screen.getX(50), screen.getY(this.y + i*3));
        }
        
    }
}

class SettingActionButton extends Button {
    constructor(rect, texture, type) {
        super(rect, texture, game.types[type]);
        this.type = type;
        this.spAct = game.types[type];
        this.selected = false;
        this.addEventListener("click", (e) => {
            socket.emit("setSpAct", this.type);
        });
    }
    select(bool) {
        this.selected = bool;
    }
    render(screen) {
        const ctx = screen.ctx;
        super.render(screen);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = "green";
        const px = Math.min(Math.max(screen.getX(this.w / this.text.length), screen.getX(16)));
        ctx.font = `bold ${px}px sans-serif `;
        if (this.selected) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "green";
        }
        ctx.fillText(this.text, screen.getX(this.x), screen.getY(this.y + px / 2 + this.h / 2), this.w);
    }
}

class GameScene extends Scene {
    constructor() {
        super();
        console.log("game")
        Sogen(this);
        for (let i = 0; i < 30; i++) {
            if (i == 12) { i += 6 }
            this.addGameObject(new Saku(new Rect(i * 30, 600 - 15, 30, 30)));
        }
        this.UI = [
            new NameText(game.player.name, 900 - game.player.name.length * 50, 1150),
            new NameText(game.enemy.name, 0, 50)
        ]
        this.UI.forEach((ui) => {
            this.addGameObject(ui);
        });
    }

    nextTurn() {
        this.UI.forEach((ui) => {
            this.removeGameObject(ui);
            this.addGameObject(ui);
        });
        this.addGameObject(new CountText(383, 675));
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        for (let i = 0; i < game.acts.length; i++) {
            console.log(game.acts[i]);
            this.addGameObject(new ActionButton(new Rect(300 * (i % 3), 1200 + 150 * Math.floor(i / 3), 300, 150), btnImage, game.acts[i]));
        }
        game.player.banana.splice(0)
        for (let i = 0; i < game.player.life; i++) {
            const banana = new Banana(new Rect(100 * (i % 9), 1100 + 100 * Math.floor(i / 9), 100, 100));
            this.addGameObject(banana);
            game.player.banana.push(banana);
        }
        game.enemy.banana.splice(0)
        for (let i = 0; i < game.enemy.life; i++) {
            const banana = new Banana(new Rect(800 - 100 * (i % 9), 0 + 100 * Math.floor(i / 9), 100, 100))
            this.addGameObject(banana);
            game.enemy.banana.push(banana)
        }
    }
}


class ActionButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, game.types[text]);
        this.act = text;
        this.turn = game.turn;
        this.addEventListener("click", (e) => {
            if (game.act == "") {
                socket.emit("act", this.act);
            }
        });
    }
    update(screen) {
        if (game.turn != this.turn || !game.selecting) {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
}

class CountText extends GameObject {
    constructor(x, y) {
        super(x, y)
        this._date = Date.now();
        this._count = 9;
    }
    update() {
        this._count = Math.floor(10 + (this._date - Date.now()) / 1000);
    }
    render(screen) {
        if (this._count > 0) {
            const ctx = screen.ctx;
            ctx.fillStyle = "red";
            ctx.font = `bold ${screen.getX(200)}px sans-serif `;
            ctx.fillText(`${this._count}`, screen.getX(this.x), screen.getY(this.y));
        } else {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
}

class ActionText extends GameObject {
    constructor(type) {
        super();
        this.text = game.types[type];
    }
    update(screen) {
        if (game.selecting) {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        const px = screen.getX(900 / this.text.length);
        ctx.font = `bold ${px}px sans-serif `;
        ctx.fillText(this.text, 0, screen.getY(1500 - px / 2));
    }
}

class Saku extends Sprite {
    constructor(rect) {
        const sakuImage = new Texture(new Rect(0, 0, 16, 16), assets.saku);
        super(rect, sakuImage)
    }
}

const Sogen = (scene) => {
    const sogenImgae = new Texture(new Rect(0, 0, 16, 16), assets.sogen);
    scene.addGameObject(new Sprite(new Rect(0, 0, 450, 450), sogenImgae));
    scene.addGameObject(new Sprite(new Rect(450, 0, 450, 450), sogenImgae));
    scene.addGameObject(new Sprite(new Rect(0, 450, 450, 450), sogenImgae));
    scene.addGameObject(new Sprite(new Rect(450, 450, 450, 450), sogenImgae));
    scene.addGameObject(new Sprite(new Rect(0, 900, 450, 450), sogenImgae));
    scene.addGameObject(new Sprite(new Rect(450, 900, 450, 450), sogenImgae));
    scene.addGameObject(new Sprite(new Rect(0, 1350, 450, 450), sogenImgae));
    scene.addGameObject(new Sprite(new Rect(450, 1350, 450, 450), sogenImgae));
}


class Banana extends Sprite {
    constructor(rect) {
        const bananaImage = new Texture(new Rect(0, 0, 16, 16), assets.banana);
        super(rect, bananaImage)
        this.turn = game.turn;
        this._damaged = 0;
    }
    update() {
        if (game.turn != this.turn) {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
    render(screen) {
        if (this._damaged > 0) {
            if (this._damaged % 10 < 5) {
                super.render(screen);

            }
            this._damaged++;
        } else {
            super.render(screen);
        }
    }
    damage() {
        this._damaged = 1;
    }
}


class HesoBanana extends Sprite {
    constructor(rect, myMeme) {
        const bananaImage = new Texture(new Rect(0, 0, 16, 16), assets.banana);
        super(rect, bananaImage)
        this._turn = game.turn;
        this._myMeme = myMeme;
        this._cnt = 0;
    }
    update() {
        if (game.turn != this._turn) {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
        if (this._myMeme) {
            this.x += (0 - this.x + 100 * (game.player.life - 1)) / (60 - this._cnt);
            this.y += (1100 - this.y) / (60 - this._cnt);
        } else {
            this.x += (900 - this.x - 100 * (game.enemy.life)) / (60 - this._cnt);
            this.y += (0 - this.y) / (60 - this._cnt);
        }
        if (this._cnt < 59) {
            this._cnt++;
        }
    }
}
class WairoBanana extends Sprite {
    constructor(meme) {
        const bananaImage = new Texture(new Rect(0, 0, 16, 16), assets.banana);
          super(new Rect(0, 0, 50, 50), bananaImage)
        this._turn = game.turn;
        this._meme = meme;
        this._cnt = 0;
    }
    update() {
        if (game.turn != this._turn) {
            this.dispatchEvent("destroy", new GameEvent(this));
            this.dispatchEvent("destroy", new GameEvent(this._meme));
        }
        this.x = this._meme.x + 32;
        this.y = this._meme.y + 46;
    }
}

class Glass extends Sprite {
    constructor(meme) {
        const glassImage = new Texture(new Rect(0, 0, 8, 8), assets.glass);
        super(new Rect(0, 0, 50, 50), glassImage);
        this._turn = game.turn;
        this._meme = meme;
    }
    update() {
        if (game.turn == 2 + this._turn) {
            this.dispatchEvent("destroy", new GameEvent(this));
            this.dispatchEvent("destroy", new GameEvent(this._meme));
        }
        this.x = this._meme.x + 32;
        this.y = this._meme.y + 46;
    }
}

class NameText extends GameObject {
    constructor(name, x, y) {
        super();
        this._name = name;
        this._x = x;
        this._y = y;
    }
    render(screen) {
        super.render(screen);
        const ctx = screen.ctx;
        ctx.fillStyle = "blue";
        ctx.font = `bold ${screen.getY(50)}px sans-serif `;
        ctx.fillText(this._name, screen.getX(this._x), screen.getY(this._y));
    }
}

class Meme extends Sprite {
    constructor(rect, myMeme) {
        const memeImage = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        super(rect, memeImage)
        this._vecX = 0;
        this._vecY = 0;
        this._myMeme = myMeme;
        this._initcnt = 0;
        this._cnt = 0;
        this._speed = 2;
        this._awayX = Math.random() * 900;
        this._go = false;
        this._mode = "";
        this._away = false;
        this._reciveWairo = false;
        this._angle = 0;
        this._reset();
    }
    _reset() {
        this._go = false;
        this._mode = "";
        this._away = false;
    }
    atk(success) { // away時に削除
        this._reset();
        this._go = true;
        this._mode = "atk";
        this._away = !success;
    }
    dfn(success) {
        this._reset();
        this._go = true;
        this._away = !success;
        setTimeout(() => {
            this._dfn = false;
            this.texture = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        }, 4000);
        this.texture = new Texture(new Rect(0, 0, 64, 64), assets.kushon);
    }
    dxAtk(success) { // 画像拡大するだけ
        this.w = 300;
        this.h = 300;
        this.x -= 50;
        this.y -= 50;
        this.atk(success);
    }
    reciveWairo() { // チーム入れ替えるだけ
        this._reciveWairo = true;
        this._myMeme = !this._myMeme;
    }
    wairo() { // ばなな生成するだけ。　バナナ側から削除
        this._reset();
        this._spawn(new WairoBanana(this));
        this._go = true;
    }
    heso() { // バナナ生成して away時に削除
        this._reset();
        this._spawn(new HesoBanana(new Rect(this.x + 50, this.y + 50, 100, 100), this._myMeme));
        this._away = true;
        this._mode = "heso";
    }
    spy() { // サングラス生成 サングラス側から削除
        this._reset();　
        this._spawn(new Glass(this));
        this._go = true;
        this._myMeme = !this._myMeme;
    }
    spDfn(success) { // 自分で削除
        this._reset();
        this._go = true;
        this._away = !success
        this.texture = new Texture(new Rect(0, 0, 64, 64), assets.spkushon);
        setTimeout(() => {
            this._destroy();
        }, 3000);
    }
    gotoCenter() {
        if (this._myMeme) {
            this.x += (350 - this.x) / (30 - this._cnt);
            this.y += (550 - this.y) / (30 - this._cnt);
        } else {
            this.x += (350 - this.x) / (30 - this._cnt);
            this.y += (450 - this.y) / (30 - this._cnt);
        }
    }
    gotoBanana(myBanana) {
        if (myBanana) {
            this.x += (0 - this.x) / (30 - this._cnt);
            this.y += (1000 - this.y) / (30 - this._cnt);
        } else {
            this.x += (700 - this.x) / (30 - this._cnt);
            this.y += (0 - this.y) / (30 - this._cnt);
        }

    }
    gotoAway(myMeme) {
        if (myMeme) {
            this.x += (this._awayX - this.x) / (30 - this._cnt);
            this.y += (1200 - this.y) / (30 - this._cnt);
        } else {
            this.x += (this._awayX - this.x) / (30 - this._cnt);
            this.y += (0 - this.y) / (30 - this._cnt);
        }
    }
    update(screen) {
        if (this._initcnt < 150) {
            this._initcnt++;
            this.x -= this._speed;
            return
        }
        if (this._go) {
            this.gotoCenter();
            this._cnt++;
            if (this._cnt == 30) {
                this._go = false;
                this._cnt = 0;
            }
            return;
        }
        
        if (this._reciveWairo) {
            this._reciveWairo = false;
            this._mode = "";
            this._away = false;
            return;
        }
        if (this._away) {
            this.gotoAway(this._myMeme);
            this._angle += 10;
            this._cnt++;
            if (this._cnt == 30) {
                this._cnt = 0;
                if (this._mode == "atk" || this._mode == "heso") {
                    this._destroy();
                } else {
                    this._reset();
                    this._angle = 0;
                    this._cnt = 0;
                }
            }
            return;
        }
        
        if (this._mode == "atk") {
            this.gotoBanana(!this._myMeme);
            this._cnt++;
            if (this._cnt == 30) {
                this._destroy();
                this._reset();
                this._cnt = 0;
            }
            return;
        }

        if (Math.random() * 30 < 1) {
            this._vecX = Math.floor(Math.random() * 3) - 1;
            this._vecY = Math.floor(Math.random() * 3) - 1;
        }
        this.x += this._vecX * this._speed;
        this.y += this._vecY * this._speed;
        this.x = Math.min(Math.max(this.x, 0), 900 - 200);
        let maxY;
        let minY;
        if (this._myMeme) {
            maxY = 1200 - 150;
            minY = 600 - 50;
        } else {
            maxY = 600 - 150;
            minY = -50;
        }
        this.y = Math.min(Math.max(this.y, minY), maxY);
    }

    render(screen) {
        const ctx = screen.ctx;
        if (this._angle > 0) {
            this._angle += 10;
            
            const TO_RADIANS = Math.PI / 180;
            // コンテキストを保存する
            ctx.save();
            // 回転の中心に原点を移動する
            ctx.translate(screen.getX(this.x + 100), screen.getY(this.y + 100));
            // canvasを回転する
            ctx.rotate(this._angle * TO_RADIANS);
            const rect = this.texture.rect;
            ctx.drawImage(this.texture.image,
                rect.x, rect.y,
                rect.w, rect.h,
                -screen.getX(this.w) / 2, -screen.getY(this.h) / 2,
                screen.getX(this.w), screen.getY(this.h));

            // コンテキストを元に戻す
            ctx.restore();
        } else {
            super.render(screen);
        }

    }
}
