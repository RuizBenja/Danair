var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'benja123';



exports.createToken = function(cliente){
    var payload ={
        sub: cliente._id,
        nombres: cliente._nombres,
        apellidos: cliente._apellidos,
        email: cliente._email,
        genero: cliente._genero,
        iat: moment().unix(),
        exp: moment().add(1, 'day').unix()
    }
    return jwt.encode(payload,secret);
}