class Game {
    constructor (id) {
        this.id;
        this.inviting = false;
        this.playing = false;
        this.acts = [];
        this.turn = 0;
        this.act = "";
        this.selecting = false;
        this.player = new Player();
        this.enemy = new Player();
        this.types = {
            "call": "おいでおいで",
            "atk": "とつげき",
            "dfn": "くっしょん",
            "spAtk": "スーパーとつげき"
        }
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
    }
    atk(n) {
        for (let i=0; i < n; i++){
            this.meme[0].atk();
            this.meme.splice(0, 1);
        }
    }
    dfn(n) {
        this.meme[0].dfn();
    }
    damage() {
        this.banana[this.banana.length-1].damage();
    }
}