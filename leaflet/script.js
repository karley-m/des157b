(function(){
    'use strict';

    const map = L.map('map').setView([38.66031, -121.34812], 13);
    const marker1 = L.marker([38.6367978, -121.2926353]).addTo(map);
    const marker2 = L.marker([38.6174638, -121.3118938]).addTo(map);
    const marker3 = L.marker([38.6435353, -121.3329492]).addTo(map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    marker1.bindPopup("<b>My first job</b><br>Pasquale's Italian Pizza! It's closed now :(").openPopup();
    marker2.bindPopup("<b>I like this nature center</b><br>I go all the time").openPopup();
    marker3.bindPopup("<b>Field where I used to have soccer practice</b><br>Every September through November").openPopup();

}());