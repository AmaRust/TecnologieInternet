// Funzione per aggiornare l'orologio
function updateClock() {
    var now = new Date();
    var days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    var timeString = hours + ':' + minutes + ':' + seconds;
    document.getElementById('clock').textContent = days[now.getDay()] +', ' + timeString;
}

// Aggiorna l'orologio ogni secondo
setInterval(updateClock, 1000);

// Inizia aggiornamento orologio
updateClock();