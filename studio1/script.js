(function(){
    'use strict';
    console.log('reading js');

    const fs = document.querySelector('.fas');

    fs.addEventListener('click', function(){
        if(!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    })






})();