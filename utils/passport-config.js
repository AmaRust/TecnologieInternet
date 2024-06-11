const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { getDB } = require('./db');
const { ObjectId } = require('mongodb');

passport.use(
    'local-login',
    new LocalStrategy((username, password, done) => {
        const db = getDB();
        const utenteCollection = db.collection('utente');
        const user = utenteCollection.findOne({ username: username, password: password }, (err, utente) => {
            if (err) return done(null, false);
            if (!utente) return done(null, false);

            return done(null, utente);
        });
    })
);

// funzione per mantenere la sessione
passport.serializeUser((utente, done) => {
    done(null, utente._id);
});

passport.deserializeUser((id, done) => {
    // Recupero dell'utente dal database
    const db = getDB();
    const utenteCollection = db.collection('utente');
    utenteCollection.findOne({ _id: new ObjectId(id) }, (err, utente)=>{
        if (err) return done(err);
        done(null, utente);
    })
    
});

module.exports = passport;