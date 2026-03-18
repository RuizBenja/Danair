var jwt = require('jwt-simple');
var moment = require('moment');  // 👈 ESTA LÍNEA ES FUNDAMENTAL
var secret = 'benja';

exports.createToken = function(usuario){
    var payload = {
        sub: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().add(1, 'day').unix()
    }

    console.log('PAYLOAD NUEVO ===>', payload);

    return jwt.encode(payload, secret);
}
