const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) //verifica se tem token
        return res.status(401).send({error: 'No token provided'});

    const parts = authHeader.split(' '); //divide o token em bearer e token
    
    if(!parts.length === 2)//verifica se tem duas partes
        return res.status(401).send({error: 'Token error'});
    
    const [scheme, token] = parts;
    
    if(!/^Bearer$/i.test(scheme)) //verifica se o scheme tem a palavra bearer
        return res.status(401).send({error: 'Token malformatted'});  

    jwt.verify(token, authConfig.secret, (err, decoded) => { //verifica se o token esta correto
        if(err) 
            return res.status(401).send({error: 'Invalid Token'});
        
        req.userId = decoded.id;
        return next();
    });
};