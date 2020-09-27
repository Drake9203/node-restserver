require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

// El use son middleware cada peticion que se hace pasa por esas lineas
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


app.use(morgan('combined'));

// Config de rutas
app.use(require('./routes/index'));

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