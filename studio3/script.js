(function(){
    'use strict';
    console.log('reading js');

    // Initialize Parse
    Parse.initialize("679197vayz1ilrJfZNPXzfVq9MMm0pausZPNrLtX", "0WK5sxra3pLcJPAJxUQ55RYhADWcIyDhn0p8oPdH"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";

    const categoryColors = {
      person: "red",
      place: "orange",
      thing: "yellow",
      object: "gold",
      pet: "green",
      idea: "cyan",
      smell: "blue",
      taste: "purple",
      sound: "pink"
    };

    window.saveText = async function () {
      const inputValue = document.getElementById("textInput").value;
      const selectedCategory = document.getElementById("categorySelect").value;
      
    
      if (!inputValue) {
        alert("Please type something first.");
        return;
      }

      if (!selectedCategory) {
        alert("Please select a category.");
        return;
      }

      const allowedCategories = ["person","place","thing","object","pet","idea","smell","taste","sound"];
      
      if (!allowedCategories.includes(selectedCategory)) {
        alert("Invalid category selected.");
        return; // stop everything
      }
    
      const MyData = Parse.Object.extend("home");
      const myData = new MyData();
    
      myData.set("text", inputValue);
      myData.set("category", selectedCategory);
      myData.set("approved", false);
    
      try {
        await myData.save();
        
        showResultsScreen();
        loadTexts();
        
        alert("Saved successfully!");
        document.getElementById("textInput").value = "";
        document.getElementById("categorySelect").value = "";
      } catch (error) {
          alert("Error: " + error.message);
      }

      console.log("Saving to class:", myData.className);
      };


    window.addEventListener("DOMContentLoaded", loadTexts);


    async function loadTexts() {
      const MyData = Parse.Object.extend("home");
      const query = new Parse.Query(MyData);
      query.equalTo("approved", true);
      query.descending("createdAt");

      query.descending("createdAt"); // newest first

      const results = await query.find();

      const list = document.getElementById("results");
      list.innerHTML = "";

      for (let i=0; i < results.length; i++) {
        const obj = results[i];
        const li = document.createElement("li");
        li.textContent = obj.get("text");

        const category = obj.get("category");
        const color = categoryColors[category];

        if (color) {
            li.style.color = color;
        }

        list.appendChild(li);
      }
    }

    function showResultsScreen() {
      document.getElementById("inputScreen").style.display = "none";
      document.getElementById("resultsScreen").style.display = "block";

      // fade out input screen
      inputScreen.classList.add("hidden");

      // after fade completes, show results screen
      setTimeout(function () {
        resultsScreen.classList.remove("hidden");
      }, 500); // must match CSS transition time
    }

    



    





    






})();