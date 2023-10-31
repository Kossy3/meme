class Game {
    constructor (id) {
        this.id;
        this.login = false;
        this.inviting = false;
        this.playing = false;
        this.acts = [];
        this.turn = 0;
        this.act = "";
        this.selecting = false;
        this.player = new Player();
        this.enemy = new Player();
        this.types = {
            "call": "　よぶ　",
            "atk": "とつげき",
            "dfn": "くっしょん",
            "spAtk": "スーパーとつげき"
        }
        this.name = "";
        this.winCount = 0;
    }
    reset() {
        this.player = new Player();
        this.enemy = new Player();
    }
    nextTurn() {
        this.turn ++;
        this.act = "";
    }
}

class Player {
    constructor() {
        this.meme = [];
        this.life = 3;
        this.banana = [];
        this.name = ""
    }
    atk(n, success) {
        for (let i=0; i < n; i++){
            this.meme[0].atk(success);
            this.meme.splice(0, 1);
        }
    }
    dfn(success) {
        this.meme[0].dfn(success);
    }
    damage() {
        this.banana[this.banana.length-1].damage();
    }
}