const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req,res,next){
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        const user = jwt.verify(token,process.env.SECRET_KEY);
        console.log(user)
        next();
    } catch (error) {
        res.status(401).send({error: error.message});
    }

}

module.exports = auth;