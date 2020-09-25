const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/user');
const { verifyToken, verifyRole } = require('../middlewares/auth')
const app = express();

app.get('/usuario', verifyToken, (req, res) => {

    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 5);

    // Son los campos que se van a mostrar, con estado true
    Usuario.find({ status: true }, 'name email role, status google')
        .skip(from)
        .limit(limit)
        .exec((err, usersBD) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }

            Usuario.countDocuments({ status: true }, (err, count) => {
                res.json({
                    status: true,
                    user: usersBD,
                    count
                });
            });
        });

})

app.post('/usuario', [verifyToken, verifyRole], function(req, res) {
    let body = req.body;

    let user = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userBD) => {

        if (err) {
            return res.status(400).json({
                status: false,
                err
            })
        }

        res.json({
            status: true,
            user: userBD
        })

    });

});

app.put('/usuario/:id', [verifyToken, verifyRole], function(req, res) {
    let id = req.params.id;

    // Funcion de underscore pick para poner cuales son las propiedades que se pueden actualizar
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    // delete body.password;
    // delete body.google;

    // El parametro 3 new es para devolver el nuevo usuario con las modificaciones
    // Runvalidator para las validaciones del modelo
    // El context es para evitar errores con email duplicado al editar
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userBD) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        res.json({
            status: true,
            user: userBD
        })
    })

})

app.delete('/usuario/:id', [verifyToken, verifyRole], function(req, res) {
    let id = req.params.id;
    let changeStatus = {
        status: false
    }

    //Usuario.findByIdAndRemove(id, (err, userBD) => {
    Usuario.findByIdAndUpdate(id, changeStatus, { new: true },
        (err, userBD) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }

            if (!userBD) {
                return res.status(400).json({
                    status: false,
                    err: {
                        message: 'User not found'
                    }
                });
            }

            res.json({
                status: true,
                user: userBD
            })
        })
})


module.exports = app;