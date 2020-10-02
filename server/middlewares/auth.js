const jwt = require('jsonwebtoken');

// Verificar token

let verifyToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                err: {
                    message: 'Token invalid'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

let verifyRole = (req, res, next) => {
    let role = req.user.role;
    if (role != 'ADMIN_ROLE') {
        res.json({
            status: false,
            err: {
                message: 'El usuario no es rol Admin'
            }
        })
    } else {
        next();
    }
};

// Verifica token imagen

let verifyTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                err: {
                    message: 'Token invalid'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
}


module.exports = { verifyToken, verifyRole, verifyTokenImg };