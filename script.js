(function() {
    'use strict';

    const button = document.querySelector('button');
    const body = document.querySelector('body');
    const sections = document.querySelectorAll('section')
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const h2 = document.querySelector('h2');
    const h1 = document.querySelector('h1');
    let mode = 'dark';

    button.addEventListener('click', function() {
        if (mode === 'dark') {
            body.className = 'switch';
            button.className = 'switch';
            button.innerHTML = "<img src='images/lighton.png' width='50'>";
            main.className = 'switch';
            header.className = 'switch';
            h2.className = 'switch';
            h1.className = 'switch';
            for (const section of sections) {
                section.className = 'switch';
            }
            mode = 'light';
        } else {
            body.removeAttribute('class');
            button.removeAttribute('class');
            button.innerHTML = "<img src='images/lightoff.png' width='50'>";
            main.removeAttribute('class');
            header.removeAttribute('class');
            h2.removeAttribute('class');
            h1.removeAttribute('class');
            for (const section of sections) {
                section.removeAttribute('class');
            }
            mode = 'dark'
        }
    })
})()