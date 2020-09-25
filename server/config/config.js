// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BD

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// Vencimiento token 60 * 60 * 24 * 30

process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

// Semilla de autenticacion

process.env.SEED = process.env.SEED || 'secret_key';