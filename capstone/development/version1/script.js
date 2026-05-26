(function(){
    'use strict';
    console.log('reading js');

    // Initialize Parse
    Parse.initialize("c63E3rBrRA8lZ0UXb0ymLEARRqZke8VE2b4StrUd", "iybQA2vMXht09mlAxY9yrsBwGu8o2PiPRBz2Fb04"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";

    console.log("Parse object:", Parse);
    console.log("Parse initialized:", Parse.applicationId);

    let tooltipData = {};

    async function loadTooltipData() {
    
        const response = await fetch('data.json');
    
        tooltipData = await response.json();
    
        console.log(tooltipData);
    }

    const canvas = new fabric.Canvas('c');

    const sections = document.querySelectorAll('section');

    const selections = {
        climate: null,
        shape: null,
        material: null,
        energy: null,
        water: null,
        food: null,
        social: null
    };

    const options = {
        climate: {
          dry: {
            label: "Dry/Arid",
            shape: ["barn", "dome", "shell", "cell"]
          },
          temperate: {
            label: "Temperate",
            shape: ["barn", "dome", "shell", "cell"]
          },
          tropical: {
            label: "Tropical",
            shape: ["barn", "dome", "shell", "cell"]
          }
        },
        shape: {
          barn: {
            label: "Barn",
            materials: ["mycelium", "plastic", "earth", "bamboo"]
          },
          dome: {
            label: "Dome",
            materials: ["mycelium", "plastic", "earth", "bamboo"]
          },
          shell: {
            label: "Shell",
            materials: ["mycelium", "plastic", "earth", "bamboo"]
          },
          cell: {
            label: "Cell",
            materials: ["mycelium", "plastic", "earth", "bamboo"]
          }
        },
        materials: ["mycelium", "plastic", "earth", "bamboo"]
      };

    const assetMap = {
        cat: "images/cat.png",
        couch: "images/couch.png",
        dog: "images/dog.png",
        tree: "images/tree.png",
        bike: "images/bike.png"
    };

      function showError(errorId, message) {
        const errorBox = document.getElementById(errorId);
        if (errorBox) {
            errorBox.innerHTML = message;
        }
    }
    
    function clearError(errorId) {
        const errorBox = document.getElementById(errorId);
        if (errorBox) {
            errorBox.innerHTML = '';
        }
    }

    function validateSelection(category, errorId) {
        if (!selections[category]) {
            showError(errorId, `Please choose one for ${category} before moving on.`);
            return false;
        }
        clearError(errorId);
        return true;
    }


    function showSection(indexToShow) {
        sections.forEach(function (sec) {
            sec.classList.add('hidden');
            sec.classList.remove('show');
        });

        sections[indexToShow].classList.remove('hidden');
        sections[indexToShow].classList.add('show');

        TweenMax.fromTo(sections[indexToShow], 1, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0
        })
    }

    function getImageFilename(shape, material, climate) {
        return `images/${shape}-${material}-${climate}.png`;
    }
    
    function renderMaterialChoices() {
        const climate = selections.climate?.value;
        const shape = selections.shape?.value;
        console.log("Climate:", climate);
        console.log("Shape:", shape);
        if (!climate || !shape) return;
        const container = document.querySelector('#material-options');
        container.innerHTML = '';
        options.materials.forEach(function(material) {
            const imagePath = getImageFilename(shape, material, climate);
            console.log(imagePath);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <img 
                    src="${imagePath}"
                    class="choice"
                    data-category="material"
                    data-value="${material}"
                    data-image="${imagePath}"
                    width="300"
                >
                <p>${material}</p>
            `;
    
            container.appendChild(wrapper);
        });
    
        attachChoiceListeners();
        setTimeout(() => {
            setupTooltips();
        }, 0);
    }



    function renderSolarChoices() {
        const shape = selections.shape?.value;
        if (!shape) return;
        const container = document.querySelector('#solar-options');
        container.innerHTML = '';
        const imagePath = `images/solar-${shape}.png`;
        const wrapper = document.createElement('div');
    
        wrapper.innerHTML = `
            <img
                src="${imagePath}"
                class="choice"
                data-category="energy"
                data-value="solar-skin"
                data-image="${imagePath}"
                width="300"
            >

        `;
    
        container.appendChild(wrapper);
        attachChoiceListeners();
        setTimeout(() => {
            setupTooltips();
        }, 0);
    }

    function renderGreenRoofChoices() {
        const shape = selections.shape?.value;
        const climate = selections.climate?.value;
        if (!shape || !climate) return;
        const container = document.querySelector('#greenroof-options');
        container.innerHTML = '';
        const imagePath = `images/garden-${shape}-${climate}.png`;
        const wrapper = document.createElement('div');
    
        wrapper.innerHTML = `
            <img
                src="${imagePath}"
                class="choice"
                data-category="water"
                data-value="green-roof"
                data-image="${imagePath}"
                width="300"
            >
            
        `;
    
        container.appendChild(wrapper);
        attachChoiceListeners();
        setTimeout(() => {
            setupTooltips();
        }, 0);
    }


    function attachChoiceListeners() {
        document.querySelectorAll('.choice').forEach(function(img) {
            img.removeEventListener('click', handleChoiceClick);
            img.addEventListener('click', handleChoiceClick);
        });
    }

    function handleChoiceClick() {

        const category = this.dataset.category;
        const value = this.dataset.value;

       
    
        selections[category] = {
            value: value,
            image: this.dataset.image
        };
    
        console.log(selections);
    
        document.querySelectorAll(`.choice[data-category="${category}"]`).forEach(function(el) {
            el.style.opacity = "0.4";
            el.style.border = "none";
        });
    
        this.style.opacity = "1";
        this.style.border = "2px solid green";

        if(category === "shape") {
            renderMaterialChoices();
        }
    }



    document.querySelector('#begin').addEventListener('click', function(){
        showSection(1);
    });

    document.querySelector('#gotostep1').addEventListener('click', function(){
        showSection(2);
    });

    document.querySelector('#gotostep2').addEventListener('click', function(){
        if (!validateSelection('climate','error-step1')) return;
        showSection(3);
    });

    document.querySelector('#gotostep3').addEventListener('click', function(){
        if (!validateSelection('shape','error-step2')) return;
        clearError();
        showSection(4);
        renderSolarChoices();
    });

    document.querySelector('#gotostep4').addEventListener('click', function(){
        if (!validateSelection('material','error-step3')) return;
        clearError();
        showSection(5);
        renderGreenRoofChoices();
    });

    document.querySelector('#gotostep5').addEventListener('click', function(){
        if (!validateSelection('energy','error-step4')) return;
        clearError();
        showSection(6);
    });

    document.querySelector('#gotostep6').addEventListener('click', function(){
        if (!validateSelection('water','error-step5')) return;
        clearError();
        showSection(7);
    });

    document.querySelector('#gotostep7').addEventListener('click', function(){
        if (!validateSelection('food','error-step6')) return;
        clearError();
        showSection(8);
    });

    document.querySelector('#gotoassemble').addEventListener('click', function(){
        if (!validateSelection('social','error-step7')) return;
        clearError();
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

    
    // TODO: create loading screen before displaying neighborhood


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

    function getLayoutConfig() {
        const isMobile = window.innerWidth < 768;
    
        return {
            padding: isMobile ? 10 : 20,
            cellSize: isMobile ? 90 : 150,
            itemsPerRow: isMobile ? 2 : 4,
            maxIconSize: isMobile ? 70 : 120
        };
    }

    function resizeCanvas() {
        const isMobile = window.innerWidth < 768;
    
        const width = isMobile ? window.innerWidth - 20 : 800;
        const height = isMobile ? 400 : 600;
    
        canvas.setWidth(width);
        canvas.setHeight(height);
    
        canvas.calcOffset(); // important for correct mouse/touch alignment
    }

    


    // canvas for fabric.js
    function renderFabricScene() {

        canvas.clear();
    
        const layout = getLayoutConfig();
    
        const filteredSelections = Object.keys(selections).filter(function(key) {
            return key !== "shape";
        });
    
        filteredSelections.forEach(function(key, index) {
    
            const item = selections[key];
    
            if (item && item.image) {
    
                fabric.Image.fromURL(item.image, function(img) {
    
                    // const row = Math.floor(index / layout.itemsPerRow);
                    // const col = index % layout.itemsPerRow;
    
                    // const x = layout.padding + (col * layout.cellSize);
                    // const y = layout.padding + (row * layout.cellSize);

                    img.scaleToWidth(layout.maxIconSize);
    
                    // img.set({
                    //     left: x,
                    //     top: y,
                    //     selectable: true,
                    //     hasControls: true
                    // });
    
                    canvas.add(img);
                    // canvas.renderAll();
                    loaded++;
                    if(loaded === total) {
                        positionObjects();
                    }
                    
                });
            }
        });
    }

    function positionObjects() {

        const layout = getLayoutConfig();
        const objects = canvas.getObjects();
    
        objects.forEach(function(obj, index) {
    
            const row = Math.floor(index / layout.itemsPerRow);
            const col = index % layout.itemsPerRow;
    
            obj.set({
                left: layout.padding + col * layout.cellSize,
                top: layout.padding + row * layout.cellSize,
                originX: 'left',
                originY: 'top'
            });
    
            obj.setCoords();
        });
    
        canvas.renderAll();
    }

    window.addEventListener('resize', function() {
        resizeCanvas();
        renderFabricScene();
    });

    document.querySelectorAll('.add-item').forEach(btn => {
        btn.addEventListener('click', function() {
    
            const type = this.dataset.item;
            const url = assetMap[type];
    
            fabric.Image.fromURL(url, function(img) {
    
                img.set({
                    left: 100,
                    top: 100,
                    selectable: true,
                    hasControls: true
                });
    
                img.scaleToWidth(80);
    
                canvas.add(img);
                canvas.setActiveObject(img);
            });
        });
    });

    loadTooltipData();

    function setupTooltips() {
        document.querySelectorAll('.choice').forEach(function(item) {
            if (item._tippy) return;
            const category = item.dataset.category;
            const value = item.dataset.value;
            if (!category || !value) return;
            const data = tooltipData?.[category]?.[value];
            if (!data) return;
            console.log("tooltips initialized for:", document.querySelectorAll('.choice').length);

            let compatibilityHTML = '';

            if (data.compatibility) {

            compatibilityHTML = `
                <div class="compatibility-chart">
                <div>Dry ${getCompatibilityDot(data.compatibility.dry)}</div>
                <div>Temperate ${getCompatibilityDot(data.compatibility.temperate)}</div>
                <div>Tropical ${getCompatibilityDot(data.compatibility.tropical)}</div>
                </div>
                `;
            }

            const content = `
                <div class="tooltip-content">
                    <p>${data.description}</p>
                    ${compatibilityHTML}
                </div>
                `;
    
            tippy(item, {
                content: content,
                allowHTML: true,
                maxWidth: 250,
                followCursor:true
            });
        });
    }

    function getCompatibilityDot(score) {

        const colors = [
            '#ff4d4d',
            '#ffd24d',
            '#9be564',
            '#2ecc71'
        ];
    
        return `
            <span style="
                display:inline-block;
                width:12px;
                height:12px;
                border-radius:50%;
                background:${colors[score]};
                margin-left:6px;
            "></span>
        `;
    }

    document.addEventListener('DOMContentLoaded', async function () {
        await loadTooltipData();
        setupTooltips();
    });
        

    attachChoiceListeners();
    setupTooltips();


})();