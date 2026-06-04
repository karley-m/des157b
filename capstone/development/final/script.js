(function(){
    'use strict';
    console.log('reading js');

    // Initialize Parse
    Parse.initialize("c63E3rBrRA8lZ0UXb0ymLEARRqZke8VE2b4StrUd", "iybQA2vMXht09mlAxY9yrsBwGu8o2PiPRBz2Fb04"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";

    console.log("Parse object:", Parse);
    console.log("Parse initialized:", Parse.applicationId);

    //getting tooltip data from JSON
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

    //additional buttons
    const assetMap = {
        cat: "images/cat.png",
        couch: "images/couch.png",
        dog: "images/dog.png",
        tree: "images/tree.png",
        bike: "images/bike.png"
    };

    const totalSteps = 8;

    function updateProgress(stepIndex) {
        const progress = (stepIndex / totalSteps) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    }

    //handling error
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

    function footerVisuals() {
        const climate = selections.climate?.value;
        const html = document.querySelector('html');
        if (climate === 'dry') {
            html.style.backgroundImage = "url('images/dry-footer.png')";
        } else if (climate === 'temperate') {
            html.style.backgroundImage = "url('images/temperate-footer.png')";
        } else {
            html.style.backgroundImage = "url('images/tropical-footer.png')"
        }

    }

    //hiding and showing sections
    function showSection(indexToShow) {
        sections.forEach(function (sec) {
            sec.classList.add('hidden');
            sec.classList.remove('show');
        });

        sections[indexToShow].classList.remove('hidden');
        sections[indexToShow].classList.add('show');

        updateProgress(indexToShow);

        TweenMax.fromTo(sections[indexToShow], 1, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0
        })
    }

    //grabbing image
    function getImageFilename(shape, material, climate) {
        return `images/${shape}-${material}-${climate}.png`;
    }
    

    //identifying climate & shape chosen and grabbing the images for the material section
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

    //identifying shape chosen and grabbing the images for the solar-roof option in energy section
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

    //identifying climate & shape chosen and grabbing the images for the garden-roof option in water section
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

    function renderGardenChoices() {
        const shape = selections.shape?.value;
        if (!shape) return;
        const container = document.querySelector('#garden-options');
        container.innerHTML = '';
        const imagePath = `images/vegetables-${shape}.png`;
        const wrapper = document.createElement('div');
        console.log("shape:", shape);
        console.log("path:", imagePath);
    
        wrapper.innerHTML = `
            <img
                src="${imagePath}"
                class="choice"
                data-category="food"
                data-value="rooftop-gardens"
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

    //UI for choice/option selection
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
        this.style.border = "2px dashed green";

        if(category === "shape") {
            renderMaterialChoices();
        }
    }

    // -------------- going to climate screen ------------------
    document.querySelector('#gotostep1').addEventListener('click', function(){
        introTimeline.scrollTrigger.kill();
        introTimeline.kill();

        document.querySelector('#intro').style.display = "none";
        document.querySelector('#progress-container').classList.remove("hidden");
        showSection(1);
        
    });
    
    // -------------- going to shape screen ------------------
    document.querySelector('#gotostep2').addEventListener('click', function(){
        if (!validateSelection('climate','error-step1')) return;
        showSection(2);
        footerVisuals()
    });

    // -------------- going to material screen ------------------
    document.querySelector('#gotostep3').addEventListener('click', function(){
        if (!validateSelection('shape','error-step2')) return;
        clearError();
        showSection(3);
        renderSolarChoices();
    });

    // -------------- going to energy screen ------------------
    document.querySelector('#gotostep4').addEventListener('click', function(){
        if (!validateSelection('material','error-step3')) return;
        clearError();
        showSection(4);
        renderGreenRoofChoices();
    });

    // -------------- going to water screen ------------------
    document.querySelector('#gotostep5').addEventListener('click', function(){
        if (!validateSelection('energy','error-step4')) return;
        clearError();
        showSection(5);
    });

    // -------------- going to food screen ------------------
    document.querySelector('#gotostep6').addEventListener('click', function(){
        if (!validateSelection('water','error-step5')) return;
        clearError();
        showSection(6);
        renderGardenChoices();
    });
    
    // -------------- going to social screen ------------------
    document.querySelector('#gotostep7').addEventListener('click', function(){
        if (!validateSelection('food','error-step6')) return;
        clearError();
        showSection(7);
    });

    // -------------- going to assemble screen ------------------
    document.querySelector('#gotoassemble').addEventListener('click', function(){
        if (!validateSelection('social','error-step7')) return;
        clearError();
        showSection(8);
        renderFabricScene();
    });

    function showOverlay(message) {
        document.getElementById('overlayMessage').textContent = message;
        document.getElementById('saveOverlay').classList.remove('hidden');
    }
    
    function showSuccess() {
        document.getElementById('overlayMessage').textContent = 'Success!';
        document.getElementById('successActions').classList.remove('hidden');
    }

    document.querySelector('#helpBtn').addEventListener('click', function(){
        document.querySelector('#helpOverlay').classList.remove("hidden");

        document.querySelectorAll('.neighborhoodBtn').forEach((neighborhoodBtn) => {
            neighborhoodBtn.addEventListener('click', async function () {
                if (introTimeline.scrollTrigger) {
                    introTimeline.scrollTrigger.kill();
                }
                introTimeline.kill();

                ScrollTrigger.getAll().forEach(st => st.kill());

                document.getElementById('helpOverlay')?.classList.add('hidden');
                document.querySelector('html').style.backgroundImage = 'none';
                document.querySelector('#progress-container')?.classList.add('hidden');
        
                const introSection = document.querySelector('#intro');
                introSection.classList.add('hidden');
                introSection.style.display = "none";
                gsap.set(introSection, {
                    clearProps: "all"
                });
                ScrollTrigger.refresh();
                showSection(9);
                await loadDesignIntoNeighborhood();

                const designImages = document.querySelectorAll('.design-gallery img');
                const colors = ['rgba(164, 221, 5, 0.3)', 'rgba(231, 255, 0, 0.3)', 'rgba(0, 221, 120, 0.3)'];
                        
                designImages.forEach(img => {
                    const randomIndex = Math.floor(Math.random() * colors.length);
                    img.style.backgroundColor = colors[randomIndex];
                });
            });
          });
    });

    document.querySelector('#hideHelp').addEventListener('click', function(){
        document.querySelector('#helpOverlay').classList.add("hidden");
    });

    // -------------- save button ------------------
    document.querySelector('#saveDesign').addEventListener('click', async function () {
        showOverlay('Saving...');
      
        const originalBg = canvas.backgroundColor;
      
        canvas.backgroundColor = 'white';
        canvas.renderAll();
      
        const jpgData = canvas.toDataURL({
          format: 'jpeg',
          quality: 1
        });
      
        canvas.backgroundColor = null;
        canvas.renderAll();
      
        const pngData = canvas.toDataURL({
          format: 'png'
        });
      
        canvas.backgroundColor = originalBg;
        canvas.renderAll();
      
        await Parse.Cloud.run('saveDesignPng', {
          pngData,
          selections
        });
      
        showSuccess();
      
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
          downloadBtn.addEventListener('click', function () {
            const link = document.createElement('a');
            link.href = jpgData;
            link.download = 'climate-home.jpg';
            link.click();
          });
        }

        document.querySelectorAll('.neighborhoodBtn').forEach((neighborhoodBtn) => {
            neighborhoodBtn.addEventListener('click', async function () {
              document.getElementById('saveOverlay')?.classList.add('hidden');
              document.querySelector('html').style.backgroundImage = 'none';
              document.querySelector('#progress-container')?.classList.add('hidden');
        
              showSection(9);
              await loadDesignIntoNeighborhood();
            const designImages = document.querySelectorAll('.design-gallery img');
            const colors = ['rgba(164, 221, 5, 0.3)', 'rgba(231, 255, 0, 0.3)', 'rgba(0, 221, 120, 0.3)'];
                        
            designImages.forEach(img => {
                const randomIndex = Math.floor(Math.random() * colors.length);
                img.style.backgroundColor = colors[randomIndex];
            });
            });
          });
      
        
      });

      

    
    // TODO: create loading screen before displaying neighborhood


    // -------------- loading back4app into neighborhood ------------------
    async function loadDesignIntoNeighborhood() {
        try {
            const SavedDesign = Parse.Object.extend("SavedDesign");
            const query = new Parse.Query(SavedDesign);
            query.descending("createdAt");
      
            const results = await query.find();
            const items = Array.isArray(results) ? results : Array.from(results || []);

            const neighborhoodSection = document.querySelectorAll("section")[9];
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


    // -------------- going back to first intro screen ------------------
    // document.querySelector('#backtohome').addEventListener('click', function(){
    //     showSection(0);
    // });

    //for adjusting fabric.js canvas size based on mobile view
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
        canvas.calcOffset(); 
    }

    


    // -------------- canvas for fabric.js ------------------
    function renderFabricScene() {
        canvas.clear();
    
        const layout = getLayoutConfig();
    
        const filteredSelections = Object.keys(selections).filter(function(key) {
            return key !== "shape" && selections[key]?.image;
        });
    
        const total = filteredSelections.length;
        let loaded = 0;
    
        filteredSelections.forEach(function(key) {
    
            const item = selections[key];
    
            fabric.Image.fromURL(item.image, function(img) {
    
                img.scaleToWidth(layout.maxIconSize);
    
                canvas.add(img);
    
                loaded++;
    
                if (loaded === total) {
                    positionObjects();
                }
    
            });
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
                img.isAdditional = true;
                canvas.add(img);
                if (type === 'tree') {
                    img.sendToBack();
                }
                canvas.setActiveObject(img);
            });
        });
    });

    document.addEventListener('keydown', function(e) {

        if (e.key !== 'Delete' && e.key !== 'Backspace') return;
    
        const active = canvas.getActiveObject();
    
        if (!active) return;
    
        if (active.isAdditional) {
            canvas.remove(active);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    });

    loadTooltipData();

    // -------------- tippy.js tooltips ------------------
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

    function createIntroAnimation(sectionId, buttonSelector) {
        const paragraphs = gsap.utils.toArray(`${sectionId} p`);
    
        gsap.set(`${sectionId} p`, {
            opacity: 0,
            y: 40
        });
        
        gsap.set(paragraphs[0], {
            opacity: 1,
            y: 0
        });
    
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionId,
                start: "top top",
                end: `+=${paragraphs.length * 100}%`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });
    
        paragraphs.forEach((p, i) => {
            if (i === 0) return;
    
            tl.to(paragraphs[i - 1], {
                opacity: 0,
                y: -80,
                duration: 1
            });
            
            tl.fromTo(p,
            {
                opacity: 0,
                y: 80
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            });
        });
    
        tl.to(buttonSelector, {
            opacity: 1,
            duration: 0.5,
            stagger: 0.2
        });
    
        return tl;
    }

    gsap.registerPlugin(ScrollTrigger);

    // intro 1
    const introTimeline = createIntroAnimation(
        "#intro",
        "#gotostep1"
    );

    function hideAllGifs() {
        document.querySelectorAll(".concept-gif").forEach(gif => {
            gif.classList.remove("active");
        });
    }
    
    ScrollTrigger.create({
        trigger: ".hover-states",
    
        start: "top center",
        end: "bottom center",
    
        onLeave: hideAllGifs,
        onLeaveBack: hideAllGifs
    });

    const words = document.querySelectorAll(".hover-states span");

    words.forEach(word => {

        const target = document.querySelector(
            "." + word.dataset.target
        );
    
        word.addEventListener("mouseenter", () => {
    
            const opacity = gsap.getProperty(
                document.querySelector(".hover-states"),
                "opacity"
            );
    
            if (opacity < 0.5) return;
    
            hideAllGifs();
    
            target.classList.add("active");
        });
    
        word.addEventListener("mouseleave", () => {
            hideAllGifs();
        });
    
    });

    const scene = document.querySelector(".catalog-scene");
    const images = document.querySelectorAll(".catalog-img");

    gsap.fromTo(images,
    {
        opacity: 0,
        y: 40
    },
    {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        ease: "none",
        scrollTrigger: {
        trigger: scene,
        start: "top 70%",
        end: "bottom 30%",
        scrub: true
        }
    }
    );

    images.forEach((img, i) => {

        gsap.to(img, {
          y: -80 - (i * 30),
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      
    });

    

    
        


})();