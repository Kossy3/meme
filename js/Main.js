'use strict';

window.onload = () => {
    screen = new Screen();
    let assets = new Assets();
    
    assets.onLoadAll(() => {
        let titleScene = createTitleScene(assets);
        screen.setScene(titleScene);
        screen.draw();
    });
}

