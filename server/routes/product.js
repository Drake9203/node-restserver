const express = require('express');
const { verifyToken } = require('../middlewares/auth');

const app = express();

const Product = require('../models/product');


app.get('/product', verifyToken, (req, res) => {
    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 5);

    Product.find()
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            };

            res.json({
                status: true,
                product: productDB
            })
        });
});

app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            };

            if (!productDB) {
                return res.status(400).json({
                    status: false,
                    err: {
                        message: 'ID no found'
                    }
                });
            };

            res.json({
                status: true,
                productDB: productDB
            })

        });
});

app.get('/product/find/:name', verifyToken, (req, res) => {

    let name = req.params.name;
    let regEx = new RegExp(name, 'i');
    console.log(regEx);
    Product.find({ name: regEx })
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            };

            res.json({
                status: true,
                product: productDB
            });
        });
});

app.post('/product', verifyToken, (req, res) => {
    let body = req.body;
    let product = new Product({
        user: req.user._id,
        name: body.name,
        priceUnit: body.priceUnit,
        description: body.description,
        avalible: body.avalible,
        category: body.category
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        };
        res.status(201).json({
            status: true,
            product: productDB
        });
    });
});


app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        };
        if (!productDB) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'ID no found'
                }
            });
        };

        productDB.name = body.name;
        productDB.priceUnit = body.priceUnit;
        productDB.category = body.category;
        productDB.avalible = body.avalible;
        productDB.description = body.description;

        productDB.save((err, productSaveDB) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            };

            res.json({
                status: true,
                product: productSaveDB
            });
        });
    });
});


app.delete('/product/:id', (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        };
        if (!productDB) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'ID no found'
                }
            });
        };

        productDB.avalible = false;

        productDB.save((err, productSaveDB) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            };

            res.json({
                status: true,
                product: productSaveDB
            });
        });
    });
});




module.exports = app;