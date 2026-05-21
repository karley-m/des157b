(function(){
    'use strict';
    console.log('reading js');

    // Initialize Parse
    Parse.initialize("c63E3rBrRA8lZ0UXb0ymLEARRqZke8VE2b4StrUd", "iybQA2vMXht09mlAxY9yrsBwGu8o2PiPRBz2Fb04"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";

    console.log("Parse object:", Parse);
    console.log("Parse initialized:", Parse.applicationId);

    const canvas = new fabric.Canvas('c');

    const sections = document.querySelectorAll('section');

    const selections = {
        location: null,
        shape: null,
        material: null,
        energy: null,
        water: null,
        food: null,
        social: null
    };

    function showSection(indexToShow) {
        sections.forEach(function (sec) {
            sec.classList.add('hidden');
            sec.classList.remove('show');
        });

        sections[indexToShow].classList.remove('hidden');
        sections[indexToShow].classList.add('show');
    }

    document.querySelectorAll('.choice').forEach(function (img) {
        img.addEventListener('click',function() {
            const category = img.dataset.category;
            const value = img.dataset.value;

            // if (selections[category] !== null) {
            //     return;
            // }

            selections[category] = {
                value: img.dataset.value,
                image: img.dataset.image
            };

            console.log(selections);

            document.querySelectorAll(`.choice[data-category="${category}"]`).forEach(function (el) {
                el.style.opacity = "0.4";
                el.style.border = "none";
            });

            img.style.opacity = "1";
            img.style.border = "2px solid green";
        })
    })

    document.querySelector('#begin').addEventListener('click', function(){
        showSection(1);
        
    });

    document.querySelector('#gotostep1').addEventListener('click', function(){
        showSection(2);
    });

    document.querySelector('#gotostep2').addEventListener('click', function(){
        showSection(3);
    });

    document.querySelector('#gotostep3').addEventListener('click', function(){
        showSection(4);
    });

    document.querySelector('#gotostep4').addEventListener('click', function(){
        showSection(5);
    });

    document.querySelector('#gotostep5').addEventListener('click', function(){
        showSection(6);
    });

    document.querySelector('#gotostep6').addEventListener('click', function(){
        showSection(7);
    });

    document.querySelector('#gotostep7').addEventListener('click', function(){
        showSection(8);
    });

    document.querySelector('#gotoassemble').addEventListener('click', function(){
        showSection(9);
        renderFabricScene();
    });

    document.querySelector('#saveDesign').addEventListener('click', function () {

        // JPG for user download
        const jpgData = canvas.toDataURL({
            format: 'jpeg',
            quality: 0.9
        });
    
        // PNG for backend/database
        const pngData = canvas.toDataURL({
            format: 'png'
        });
    
        // JSON for editable scene
        const jsonData = canvas.toJSON();
    
        console.log("PNG for database:", pngData);
        console.log("JSON:", jsonData);
    
        // download JPG locally
        const link = document.createElement('a');
    
        link.href = jpgData;
        link.download = 'climate-home.jpg';
    
        document.body.appendChild(link);
    
        link.click();
    
        document.body.removeChild(link);
    
    });

    document.querySelectorAll('.gotoneighborhood').forEach(function (btn) {
        btn.addEventListener('click', function () {
            showSection(10);
        })
        // canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
    })

    document.querySelector('#backtohome').addEventListener('click', function(){
        showSection(0);

    });

    function renderFabricScene() {

        canvas.clear();
    
        const padding = 20;
        const itemsPerRow = 4;
        const cellSize = 150;
    
        Object.keys(selections).forEach(function (key, index) {
    
            const item = selections[key];
    
            if(item && item.image) {
    
                fabric.Image.fromURL(item.image, function (img) {
    
                    // SCALE IMAGE
                    const maxWidth = 120;
                    const maxHeight = 120;
    
                    const scale = Math.min(
                        maxWidth / img.width,
                        maxHeight / img.height
                    );
    
                    img.scale(scale);
    
                    // GRID POSITION
                    const row = Math.floor(index / itemsPerRow);
                    const col = index % itemsPerRow;
    
                    const x = padding + (col * cellSize);
                    const y = padding + (row * cellSize);
    
                    img.set({
                        left: x,
                        top: y,
                        selectable: true,
                        hasControls: true
                    });
    
                    canvas.add(img);
                    canvas.renderAll();
    
                });
            }
        });
    }







})();