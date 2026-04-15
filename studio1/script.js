(function(){
    'use strict';
    console.log('reading js');

    const fs = document.querySelector('.fas');
    const overlay = document.querySelector('#overlay');
    const beach = document.querySelector('#beach');
    const sky = document.querySelector('#sky');
    const section = document.querySelectorAll('section');
    const phrase1 = "the weather is nice today...";
    const line1 = document.querySelector('#line1');
    const words1 = phrase1.split(" ");

    const phrase2 = "said the universe as it observed itself";
    const line2 = document.querySelector('#line2');
    const words2 = phrase2.split(" ");
    let i1 = 0;
    let i2 = 0;
    const intervalID = setInterval(checkTime, 1000);

    const loading = document.querySelector('.fa-star');

    beach.addEventListener('playing',function(){
        loading.style.display = 'none';
    })


    fs.addEventListener('click', function(){
        if(!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    })

    window.addEventListener('mousemove', function(event){
        const width = window.innerWidth;
        const x = event.clientX;

        const overlayOpacityValue = x / width;
        overlay.style.opacity = overlayOpacityValue;

        const beachOpacityValue = 1 - (x / width);
        beach.style.opacity = beachOpacityValue;
        console.log(overlayOpacityValue);
        console.log(beachOpacityValue);
    });

    window.addEventListener('mousedown',function(){
        sky.style.opacity = '1';
        section.forEach(function(sec){
            sec.style.mixBlendMode = 'normal';
        })
            
    });

    window.addEventListener('mouseup',function(){
        sky.style.opacity = '0';
        section.forEach(function(sec){
            sec.style.mixBlendMode = 'color-dodge';
        })
        
    })

    function showWords1() {
        if (i1 < words1.length) {
            line1.textContent += words1[i1] + " ";
            i1++;
            setTimeout(showWords1,400);
        }
    }

    function showWords2(){
        if(i2 < words2.length) {
            line2.textContent += words2[i2] + " ";
            i2++;
            setTimeout(showWords2, 400);
        }
    }

    function checkTime() {
        if (0 < beach.currentTime && beach.currentTime < 30) {
            showWords1();
        }

        if (15 < beach.currentTime && beach.currentTime < 25) {
            line2.removeAttribute("class");
            showWords2();
        }
    }

   

    

    






})();