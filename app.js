const { json } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('./settings/keys');
const verificacion = express.Router();

const app = express();

app.set('key', keys.key);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => {
    console.log('Servidor UP en http://localhost:3000');
});

app.post('/login', (req, res) => {
    if (req.body.usuario == 'admin' && req.body.pass == '12345') {
        const payload = {
            check: true
        };

        const token = jwt.sign(payload, app.get('key'), {
            expiresIn: '7d'
        });

        res.json({
            message: '¡AUTENTICACION EXITOSA!',
            token: token
        });
    } else {
        res.json({
            message: "Usuario y/o password son incorrectas"
        });
    }
});


verificacion.use((req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if (!token) {
        res.status(401).send({
            error: 'es necesario un token'
        });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        console.log(token);
    }
    if (token) {
        jwt.verify(token, app.get('key'), (error, decoded) => {
            if (error) {
                return res.json({
                    message: 'el token no es valido'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
});

app.get('/info', verificacion, (req, res) => {
    res.send('Informacion privada obtenida');
});



