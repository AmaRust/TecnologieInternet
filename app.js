require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const { connectDB } = require('./utils/db');
const router = require('./utils/routes');
const session = require('express-session');
const passport = require('passport');

const app = express();

app.use(express.json());
app.use(express.static('./views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
        secret: 'chiaveSegreta',
        saveUninitialized: true,
        resave: false,
    })
);
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.set('views', './views');
app.set('view engine', 'ejs');

// Connessione a MongoDB
connectDB();

// Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
