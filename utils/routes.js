const express = require('express');
const router = express.Router();
const { getDB } = require('./db');
const { sendMailRifiutato } = require('./email');
const { ObjectId } = require('mongodb');
const passport = require('./passport-config');

// Mostra la pagina HTML
router.get('/', (req, res) => {
    if(req.isAuthenticated()) return res.redirect('/dashboard');
    res.render('index');
    console.log('Home page');
});

// Ricevo i dati del form e li carico sul DB
router.post('/submit', async (req, res) => {
    const { partenza, data, arrivo, trasporto, quantita, email, telefono } = req.body;
    try {
        const db = getDB();
        const viaggioCollection = db.collection('viaggio');
        await viaggioCollection.insertOne({ partenza, data, arrivo, trasporto, quantita, email, telefono });
        res.send('<script>alert("Preventivo inviato con successo!"); window.location.href="/";</script>');
        console.log('Preventivo inviato con successo alle ' + new Date().toString());
    } catch (err) {
        console.error('Errore durante l\'inserimento dei dati nel database:', err);
        res.status(500).send('Errore durante il salvataggio nel database.');
    }
});

router.get('/login', (req, res) => {
    res.send('<script>alert("Login rifiutato!"); window.location.href="/";</script>');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
    })
);

// Dashboard
router.get('/dashboard', async (req, res) => {
    if(!req.isAuthenticated()) return res.redirect('/');
    try {
        console.log("Entrato in dashboard");
        const username = req.user.username;
        console.log(JSON.stringify(username));
        const db = getDB();
        const viaggioCollection = db.collection('viaggio');
        const viaggioAccettatoCollection = db.collection('viaggioAccettato');
        const utenteCollection = db.collection('utente');
        const viaggi = await viaggioCollection.find().toArray();
        const viaggiAccettati = await viaggioAccettatoCollection.find().toArray();
        const utenti = await utenteCollection.find().toArray();
        res.render('dashboard', { viaggi, viaggiAccettati, utenti, username });
    } catch (err) {
        console.error('Errore durante il caricamento dei dati della dashboard:', err);
        res.status(500).send(err);
    }
});

// Rimuovi viaggio
router.get('/rimuovi/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const db = getDB();
        const viaggioCollection = db.collection('viaggio');
        const viaggio = await viaggioCollection.findOne({ _id: new ObjectId(id) });
        await sendMailRifiutato(viaggio.email);
        await viaggioCollection.deleteOne({ _id: new ObjectId(id) });
        console.log('[' + viaggio.email + '] => Email di rifiuto viaggio inviata.');
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Errore durante la rimozione del viaggio: ', err);
        res.status(500).send('Errore nella rimozione del viaggio.');
    }
});

// Aggiungi viaggio accettato
router.get('/aggiungi/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const db = getDB();
        const viaggioCollection = db.collection('viaggio');
        const viaggioAccettatoCollection = db.collection('viaggioAccettato');
        const viaggio = await viaggioCollection.findOne({ _id: new ObjectId(id) });
        await viaggioAccettatoCollection.insertOne(viaggio);
        await viaggioCollection.deleteOne(viaggio);
        console.log('Viaggio accettato: ' + JSON.stringify(viaggio));
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Errore durante l\'aggiunta del viaggio:', err);
        res.status(500).send('Errore nell\'aggiunta del viaggio.');
    }
});

// Rimuovi utente
router.get('/rimuoviUtente/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const db = getDB();
        const utenteCollection = db.collection('utente');
        const utente = await utenteCollection.findOne({ _id: new ObjectId(id) });
        await utenteCollection.deleteOne(utente);
        console.log("Utente eliminato: " + utente.username);
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Errore durante la rimozione dell\'utente: ', err);
        res.status(500).send('Errore nella rimozione del viaggio.');
    }
});

// Aggiorna utente
router.get('/aggiornaUtente/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const db = getDB();
        const utenteCollection = db.collection('utente');
        const utente = await utenteCollection.findOne({ _id: new ObjectId(id) });
        const idUtente = utente._id;
        const username = utente.username;
        const password = utente.password;
        res.render("aggiornaUtente", { username, password, idUtente, aggiungiUtente:false });

        console.log("Mostra form di aggiornamento utente");
    } catch (err) {
        console.error('Errore durante l\'aggiornamento dell\'utente: ', err);
        res.status(500).send('Errore nell\'aggiornamento dell\'utente.');
    }
});

// Modifica l'utente
router.post('/aggiornamento', async (req, res) => {
    if(!req.isAuthenticated()) return res.redirect('/');
    const { username, password, id } = req.body;
    const db = getDB();
    console.log(id + '  recepito dal form');
    const utenteCollection = db.collection('utente');

    // se l'id è vuoto allora sto aggiungendo un nuovo utente
    if(id===""){
        await utenteCollection.insertOne({ username: username, password: password});
        console.log("Utente aggiunto: " + username);
        res.redirect('/dashboard');
    } else {
        await utenteCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { username: username, password: password } }, (err, result) => {
            if (err) {
                console.error("Errore durante l'aggiornamento dell\'utente: ", err);
                return;
            }
            if (result.value) {
                console.log("Utente aggiornato con successo!");
                console.log("Utente aggiornato: ", result.value);
                res.redirect('/dashboard');
            } else {
                console.log("Documento non trovato.");
                res.send("Errore nell'aggiornamento dell\'utente");
            }
        });
    }
    
});

// Aggiungi nuovo utente
router.get('/aggiornaUtente', (req, res)=>{
    if(!req.isAuthenticated()) return res.redirect('/');
    res.render('aggiornaUtente', { username: "", password: "", idUtente: "", aggiungiUtente: true});
});

// logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
});

module.exports = router;
