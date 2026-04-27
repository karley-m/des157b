(function(){
    'use strict';
    console.log('reading js');

    const treat = document.querySelector('#treat');
    const time = document.querySelector('#time');
    const action = document.querySelector('#action');

    const fourteen = document.querySelector('#fourteen');
    const fifteen = document.querySelector('#fifteen');
    const sixteen = document.querySelector('#sixteen');
    const seventeen = document.querySelector('#seventeen');
    const eighteen = document.querySelector('#eighteen');
    const nineteen = document.querySelector('#nineteen');
    const twenty = document.querySelector('#twenty');

    let data;

    async function getData(){
        const myTreats = await fetch('data/treats.json');
        data = await myTreats.json();
        console.log(data);
    };

    getData();

    function displayDay(day){
        if (!data) return;

        const treats = data[day];

        action.innerHTML = '<img id="plate" src="images/plate.png" alt="a white plate">';

        let treatText = "";
        let timeText = "";

        for (let i = 0; i < treats.length; i++) {
            treatText += treats[i].treat;
            timeText += treats[i].time;

            if(i < treats.length - 1) {
                treatText += " & ";
                timeText += " & ";
            }
        }

        treat.innerHTML = treatText;
        time.innerHTML = timeText;

        const multiple = treats.length > 1;

        for (let i = 0; i < treats.length; i++) {
            const img = document.createElement('img');
            img.src = treats[i].image;
            img.alt = treats[i].treat;

            img.classList.add('treatimg');

            if (treats[i].treat === "Mango Popsicle" || treats[i].treat === "Ramune Soda") {
                img.classList.add('tall');
            }

            if(multiple){
                img.classList.add('side-by-side');
            }

            action.appendChild(img);
        }
    }

    

    fourteen.addEventListener('click', function(){
        clearClicked();
        displayDay("14");
        fourteen.classList.add('clicked');
    });

    fifteen.addEventListener('click', function(){
        clearClicked();
        displayDay("15");
        fifteen.classList.add('clicked');
    });

    sixteen.addEventListener('click', function(){
        clearClicked();
        displayDay("16");
        sixteen.classList.add('clicked');
    });

    seventeen.addEventListener('click', function(){
        clearClicked();
        displayDay("17");
        seventeen.classList.add('clicked');
    });

    eighteen.addEventListener('click', function(){
        clearClicked();
        displayDay("18");
        eighteen.classList.add('clicked');
    });

    nineteen.addEventListener('click', function(){
        clearClicked();
        displayDay("19");
        nineteen.classList.add('clicked');
    });

    twenty.addEventListener('click', function(){
        clearClicked();
        displayDay("20");
        twenty.classList.add('clicked');
    });

    function clearClicked(){
        fourteen.classList.remove('clicked');
        fifteen.classList.remove('clicked');
        sixteen.classList.remove('clicked');
        seventeen.classList.remove('clicked');
        eighteen.classList.remove('clicked');
        nineteen.classList.remove('clicked');
        twenty.classList.remove('clicked');
    }




})();