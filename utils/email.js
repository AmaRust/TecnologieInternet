const nodemailer = require('nodemailer');

// Configura Nodemailer con il servizio email che preferisci
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rustrasporti24@gmail.com',
        pass: 'fohzitvzwzbgjjfl' 
    }
});

// Funzione per inviare email
const sendMailRifiutato = (nomeAzienda) => {
    
        const mailOptions = {
        to: 'rustrasporti24@gmail.com',     // Invio a me stesso la mail per questioni di sicurezza di gmail
        subject: 'Preventivo Rustrasporti',
        text: 'Mi dispiace, '+ nomeAzienda + ' ,ma non copriamo questa zona.\n\nCordiali saluti\nRustrasporti Spa'
        };
    
    return transporter.sendMail(mailOptions);
};

module.exports = { sendMailRifiutato };
