(function(){
    'use strict';
    console.log('reading js');

    // Initialize Parse
    Parse.initialize("679197vayz1ilrJfZNPXzfVq9MMm0pausZPNrLtX", "0WK5sxra3pLcJPAJxUQ55RYhADWcIyDhn0p8oPdH"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";

    const options = {
        animate: true,
        patternWidth: 100,
        patternHeight: 100,
        grainOpacity: 0.05,
        grainDensity: 1,
        grainWidth: 1,
        grainHeight: 1
    }

    // Initialize grained
    grained('#container', options);
    grained('#gallery', options);

    const categoryColors = {
      person: "#E94E5D",
      place: "#E5AC1C",
      thing: "#D9C950",
      object: "#54D661",
      pet: "#0D9A8F",
      idea: "#8598C0",
      smell: "#762391",
      taste: "#AF1073",
      sound: "#D852A9"
    };


    window.saveText = async function () {
      const inputValue = document.getElementById("textInput").value;
      const selectedCategory = document.getElementById("categorySelect").value;
      
    
      if (!inputValue) {
        alert("please type something first! anything that comes to mind");
        return;
      }

      if (!selectedCategory) {
        alert("please select a category first");
        return;
      }

      const allowedCategories = ["person","place","thing","object","pet","idea","smell","taste","sound"];
      
      if (!allowedCategories.includes(selectedCategory)) {
        alert("invalid category selected");
        return; 
      }
    
      //sending new data to back4app
      const MyData = Parse.Object.extend("home");
      const myData = new MyData();
    
      myData.set("text", inputValue);
      myData.set("category", selectedCategory);
      myData.set("approved", false);
    
      try {
        await myData.save();
        
        showResultsScreen();
        loadTexts();
        
        // alert("saved successfully!");
        document.getElementById("textInput").value = "";
        document.getElementById("categorySelect").value = "";
      } catch (error) {
          alert("Error: " + error.message);
      }

      console.log("saving to class:", myData.className);
    };


    window.addEventListener("DOMContentLoaded", loadTexts);


    async function loadTexts() {
  
      const MyData = Parse.Object.extend("home");
      const query = new Parse.Query(MyData);
      query.equalTo("approved", true);

      //putting newest first
      query.descending("createdAt");

      const results = await query.find();

      const gallery = document.getElementById("gallery");
      gallery.innerHTML = "";

      shuffle(results);

      for (let i=0; i < results.length; i++) {
        const obj = results[i];

        const text = obj.get("text");
        const category = obj.get("category");
        const color = categoryColors[category];
        const div = document.createElement("div");
        div.className = "circle";

        const speed = Math.random() * 7 - 3;
        div.setAttribute("data-rellax-speed", speed);

        const speedX = Math.random() * 2 - 1;
        div.style.transform = `translateX(${speedX * 10}px)`;

        const minSize = 60;
        const maxSize = 450;
        const size = Math.floor(
          minSize + Math.pow(Math.random(), 0.6) * (maxSize - minSize)
        );

        //circle styling
        div.style.width = size + "px";
        div.style.height = size + "px";
        div.style.margin = Math.random() * 20 + "px";
        div.style.border = "none";
        div.style.outline = "none";
        
        div.style.background = `radial-gradient(circle,
          ${color} 0%,
          ${color} 45%,
          rgba(242,240,209,0) 100%)`;

        div.style.boxShadow = `0 0 25px ${color}`;
        div.style.opacity = "0.9";

        div.textContent = text;

        //shrink font size if the circle is small
        if (size < 100) {
          div.style.fontSize = "10px";
        }

        gallery.appendChild(div);
        new Rellax(".circle");
      }
    }

    function showResultsScreen() {
      document.getElementById("inputScreen").style.display = "none";
      document.getElementById("resultsScreen").style.display = "block";

     
      inputScreen.classList.add("hidden");

     
      setTimeout(function () {
        resultsScreen.classList.remove("hidden");
      }, 500); 
    }

    //shuffling order of appearance of the array
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    



    





    






})();