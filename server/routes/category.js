const express = require('express');
const { verifyToken, verifyRole } = require('../middlewares/auth');

const app = express();

const Category = require('../models/category');



// Todas la categorias
app.get('/category', verifyToken, (req, res) => {
    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 5);
    Category.find()
        .sort('description')
        .populate('user', 'name email')
        .skip(from)
        .limit(limit)
        .exec((err, categoryBD) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            };

            Category.countDocuments((err, count) => {
                res.json({
                    status: true,
                    categoryBD,
                    count
                });
            });

        });
});

// Categoria por id

app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryBD) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        };

        if (!categoryBD) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Id not found'
                }
            });
        };

        res.json({
            status: true,
            category: categoryBD
        });

    });
})

// Crear categoria

app.post('/category', verifyToken, (req, res) => {
    // Regresa la nueva categoria
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryBD) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        };

        if (!categoryBD) {
            return res.status(400).json({
                status: false,
                err
            });
        };

        res.json({
            status: true,
            category: categoryBD
        });
    });
});


// Actualizar categoria
app.put('/category/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, descCategory, {
            new: true,
            runValidators: true,
            context: 'query'
        },
        (err, categoryBD) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            };

            if (!categoryBD) {
                return res.status(400).json({
                    status: false,
                    err
                });
            };

            res.json({
                status: true,
                category: categoryBD
            });
        });

});


app.delete('/category/:id', [verifyToken, verifyRole], (req, res) => {
    // Solo admin puede borrar
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, categoryBD) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        };

        if (!categoryBD) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Id not found'
                }
            });
        };

        res.json({
            status: true,
            category: categoryBD
        });
    });
});

module.exports = app;