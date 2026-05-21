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
    const tl = gsap.timeline();

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

        TweenMax.fromTo(sec, 1, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0
        })
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



    // save button
    document.querySelector('#saveDesign').addEventListener('click', async function () {

        // JPG for user download
        const jpgData = canvas.toDataURL({
            format: 'jpeg',
            quality: 0.9
        });
    
        // PNG for backend/database
        const pngData = canvas.toDataURL({
            format: 'png'
        });

        try {
            const result = await Parse.Cloud.run('saveDesignPng', {
                pngData: pngData,
                selections: selections
            });
    
            console.log('Saved design:', result);
        } catch (error) {
            console.error('Save failed:', error);
        }

        // download JPG locally
        const link = document.createElement('a');
        link.href = jpgData;
        link.download = 'climate-home.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });


    // neighborhood button
    document.querySelectorAll('.gotoneighborhood').forEach(function (btn) {
        btn.addEventListener('click', async function () {
            showSection(10);
            await loadDesignIntoNeighborhood();
        });
    });

    
    // create loading screen before displaying neighborhood


    async function loadDesignIntoNeighborhood() {
        

        try {
            const SavedDesign = Parse.Object.extend("SavedDesign");
            const query = new Parse.Query(SavedDesign);
            query.descending("createdAt");
      
            const results = await query.find();
            const items = Array.isArray(results) ? results : Array.from(results || []);

            const neighborhoodSection = document.querySelectorAll("section")[10];
            if (!neighborhoodSection) return;

            let gallery = neighborhoodSection.querySelector(".design-gallery");

            if(!gallery) {
                gallery = document.createElement("div");
                gallery.className = "design-gallery";
                neighborhoodSection.appendChild(gallery);
            }

            gallery.innerHTML = "";

            items.forEach(function (item) {
                const file = item.get("designImage");
                if (!file) return;
    
                const img = document.createElement("img");
                img.src = file.url();
                img.alt = "Saved design";
                img.style.width = "100%";
                img.style.height = "auto";
                img.style.display = "block";
    
                gallery.appendChild(img);
            });
        } catch (error) {
            console.error("could not load saved desgins:", error);
        }
    } 




    // back button
    document.querySelector('#backtohome').addEventListener('click', function(){
        showSection(0);
    });





    // canvas for fabric.js
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


    // tippy js settings
    document.addEventListener('DOMContentLoaded', function () {
        
        const dry = document.querySelector('#dry');

        tippy(dry, {
            content: 'Tooltip',
            followCursor: true,
            maxWidth: 200,
        })

        dry._tippy.setContent('Drought followed by flash floods. Extreme heatwaves, dust storms, and wildfires.');
    });

    // tippy('#dry', {
        //     content: 'Tooltip',
        //     followCursor: true
        // });

})();