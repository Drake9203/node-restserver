require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// El use son middleware cada peticion que se hace pasa por esas lineas
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    res.json('get Usuario')
})

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            status: false,
            mesagge: "El nombre es requerido"
        })
    } else {
        res.json({
            persona: body
        })
    }

})

app.put('/usuario/:id/:ids', function(req, res) {
    let id = req.params.id;
    let ids = req.params.ids;
    res.json({
        id,
        ids
    })
})

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario')
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto ", process.env.PORT);
})