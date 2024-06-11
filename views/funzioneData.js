// Listener per gestire la data

document.addEventListener("DOMContentLoaded", function() {
    // Ottieni la data e l'ora attuali
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0'); // I mesi vanno da 0 a 11
    var day = String(now.getDate()).padStart(2, '0');
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');

    // Formatta la data e l'ora come yyyy-MM-ddTHH:mm
    var currentDateTime = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

    // Imposta la data e l'ora correnti e la data e l'ora minime dell'input datetime-local
    var datetimePicker = document.getElementById("data");
    datetimePicker.setAttribute("min", currentDateTime);
    datetimePicker.value = currentDateTime;
});
