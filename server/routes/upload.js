const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Product = require('../models/product');
const User = require('../models/user');

const fs = require('fs');
const path = require('path');

// Convierte lo que se suba a un objeto req.files
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            status: false,
            err: {
                message: 'No files were uploaded'
            }
        });
    }

    // Validar tipos en el req

    let typesAllowed = ['products', 'users'];

    if (typesAllowed.indexOf(type) < 0) {
        return res.status(400).json({
            status: false,
            err: {
                message: 'Type not allowed, type allowed ' + typesAllowed.join(', '),
                tipos: type
            }
        });
    }

    let sampleFile = req.files.file;

    let cutFileName = sampleFile.name.split('.');
    // Para obtener la ultima posicion
    let extensions = cutFileName[cutFileName.length - 1];

    // Extenciones permitidas
    let extAllowed = ['png', 'jpg', 'gif'];

    if (extAllowed.indexOf(extensions) < 0) {
        return res.status(400).json({
            status: false,
            err: {
                message: 'Extensions not allowed, extensions allowed ' + extAllowed.join(', '),
                ext: extensions
            }
        });
    }

    // Cambiar nombre archivo

    let nameFile = `${id}-${new Date().getMilliseconds()}-${sampleFile.name}`

    sampleFile.mv(`uploads/${type}/${nameFile}`, (err) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        }

        //Actualizar imagen
        updateImg(id, type, res, nameFile);
    });
});

function updateImg(id, type, res, nameFile) {
    let TypeSchema = '';
    switch (type) {
        case 'products':
            TypeSchema = Product
            break;
        case 'users':
            TypeSchema = User
            break;
    }
    TypeSchema.findById(id, (err, itemDB) => {
        if (err) {
            deleteFile(type, nameFile);
            return res.status(500).json({
                status: false,
                err
            });
        }
        if (!itemDB) {
            deleteFile(type, nameFile);
            return res.status(400).json({
                status: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        deleteFile(type, itemDB.img);
        itemDB.img = nameFile;

        itemDB.save((err, userSave) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            }
            res.json({
                status: true,
                user: userSave,
                img: nameFile
            });
        });
    });
}

function deleteFile(type, pathImg) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${type}/${pathImg}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}


module.exports = app;