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

// Vencimiento token 

process.env.EXPIRE_TOKEN = '48h';

// Semilla de autenticacion

process.env.SEED = process.env.SEED || 'secret_key';


// Google Client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '527580147441-uhkbuth74bhk2f157h7m39rotaecdi39.apps.googleusercontent.com';