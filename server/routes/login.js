const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const User = require('../models/user');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        };

        if (!userDB) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'User or password invalid'
                }
            });
        };

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'User or password invalid'
                }
            });
        };

        // expiresIn 30 dias
        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

        res.json({
            status: true,
            user: userDB,
            token
        });

    });
});

// Conf de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

// Crear user por google
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                status: false,
                err
            })
        });

    // Buscamos si el usuario esta creado
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        };
        // Si esta creado no deja auth por Google
        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    status: false,
                    err: {
                        message: 'Ya esta registrado, ingrese con clave y usuario'
                    }
                });
            } else {
                // Si fue por Google se renueva el token
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    status: true,
                    user: userDB,
                    token
                });
            }
        } else {
            // SI no existe user en bd se crea uno nuevo
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        err
                    });
                };

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    status: true,
                    user: userDB,
                    token
                });

            });
        }
    });
});


module.exports = app;