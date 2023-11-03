'use strict';
class Assets {
    constructor() {
        this.count = 0;
        this.onload = () => {}
        let callback = (name) => {
            this.count ++;
            return (asset) => {
                this[name] = asset.getData();
                let func = () => {
                    this.count --;
                    if (this.count == 0) {
                        this.onload();
                    }
                }
                if (asset.type == "img") {
                    this[name].onload = func;
                }
                if (asset.type == "mid") {
                    func();
                }
            }
        }
        new Asset('./data/me.png', "img", callback("meme"));
        new Asset('./data/saku.png', "img", callback("saku"));
        new Asset('./data/banana.png', "img", callback("banana"));
        new Asset('./data/sogen.png', "img", callback("sogen"));
        new Asset('./data/sp_kushon.png', "img", callback("spkushon"));
        new Asset('./data/kushon.png', "img", callback("kushon"));
        new Asset('./data/button.png', "img", callback("button"));
        new Asset('./data/glass.png', "img", callback("glass"));
        new Asset('./data/bgm1.mid', "mid", callback("bgm1"));
        new Asset('./data/pi.mid', "mid", callback("pi"));
    }

    onLoadAll(callback) {
        this.onload = callback;
    }
}

class Asset {
    constructor(url, type, callback) {
        this.type = type;
        this.xhr = new XMLHttpRequest();
        this.xhr.open('GET', url, true);
        this.xhr.onload = () => {
            callback(this);
        };
        this.xhr.responseType = 'arraybuffer';
        this.xhr.send();
    }

    getData() {
        switch(this.type) {
            case "img":
                return this.getImage();
            case "mid":
                return this.getMIDI();
        }
    }

    getImage() {
        const imgblob = new Blob([this.xhr.response],{type:"image/jpeg"});
        const img = new Image();
        img.src = URL.createObjectURL(imgblob);
        return img;
    }

    getMIDI() {
        return this.xhr.response;
    }
}