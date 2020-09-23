require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');

const bodyParser = require('body-parser');

// El use son middleware cada peticion que se hace pasa por esas lineas
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(morgan('combined'));

app.use(require('./routes/user'));

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err, res) => {
        if (err) throw err;
        console.log('base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto ", process.env.PORT);
})