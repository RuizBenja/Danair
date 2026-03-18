var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/cjwt');
var fs = require('fs');          
var path = require('path');  

const registro_cliente_ecommerce  = async function (req,res) {
        let data = req.body;

        let reg = await Cliente.find({email:data.email});

       if(reg.length >= 1){
            res.status(200).send({message:'El correo electrónico ya existe'});
       }else{
            bcrypt.hash(data.password,null,null,async function(err,hash){
                if(err){
                    res.status(200).send({message:'surgio un error al encriptar la contraseña'});
                }else{
                    data.password = hash;
                    let cliente = await Cliente.create(data);
                    res.status(200).send(cliente);
                }
            });
            
       }
} 

const login_cliente = async function (req,res) {
    var data = req.body;
    var clientes = await Cliente.find({email: data.email});

    if (clientes.length >=1) {
        //correo existe
        if(clientes[0].estado){
            bcrypt.compare(data.password, clientes[0].password, async function(err, check){
            if (check) {
                //
                res.status(200).send({
                    token:jwt.createToken(clientes[0]),
                    cliente: clientes[0]
                });
            } else {
                res.status(200).send({data:undefined,message: 'La contraseña es incorrecta'});
            } 
        });
        }else{
             res.status(200).send({data:undefined,message: 'Su cuenta esta desactivada'});
        }
    } else {
        res.status(200).send({data:undefined,message: 'No se encontro el correo electronico'});
    }
}

const actualizar_perfil_cliente = async function (req, res) {
  if (req.user) {
    let id   = req.user.sub;   // viene del token
    let data = req.body;       // { nombres, apellidos, celular, region, ciudad }

    try {
      let cliente = await Cliente.findByIdAndUpdate(
        { _id: id },
        {
          nombres:   data.nombres,
          apellidos: data.apellidos,
          celular:   data.celular,
          region:    data.region,
          ciudad:    data.ciudad
        },
        { new: true }
      );

      res.status(200).send(cliente);
    } catch (error) {
      console.log(error);
      res.status(500).send({ data: undefined, message: 'Error al actualizar el perfil' });
    }
  } else {
    res.status(500).send({ data: undefined, message: 'ErrorToken' });
  }
}

const actualizar_foto_cliente = async function (req, res) {
  if (req.user) {
    let id = req.user.sub;

    try {
      var file = req.files.imagen; // nombre del campo en el form-data
      if (!file) {
        return res.status(200).send({ data: undefined, message: 'No se envió ninguna imagen' });
      }

      var file_path = file.path;
      var file_name = file_path.split('\\').pop().split('/').pop();
      var ext = file_name.split('.').pop().toLowerCase();

      if (['png','jpg','jpeg','webp'].indexOf(ext) === -1) {
        fs.unlinkSync(file_path);
        return res.status(200).send({ data: undefined, message: 'Formato de imagen no permitido' });
      }

      // borrar foto anterior si existe
      let cliente = await Cliente.findById({ _id: id });
      if (cliente && cliente.foto) {
        let path_old = './uploads/clientes/' + cliente.foto;
        if (fs.existsSync(path_old)) {
          fs.unlinkSync(path_old);
        }
      }

      // guardar nuevo nombre
      let cliente_act = await Cliente.findByIdAndUpdate(
        { _id: id },
        { foto: file_name },
        { new: true }
      );

      res.status(200).send(cliente_act);

    } catch (error) {
      console.log(error);
      res.status(500).send({ data: undefined, message: 'Error al actualizar foto de perfil' });
    }

  } else {
    res.status(500).send({ data: undefined, message: 'ErrorToken' });
  }
}

const obtener_portada_cliente = async function (req, res) {
  let img = req.params['img'];
  let path_img = './uploads/clientes/' + img;

  if (fs.existsSync(path_img)) {
    return res.status(200).sendFile(path.resolve(path_img));
  } else {
    return res.status(404).send('No image');
  }
}
const eliminar_foto_cliente = async function (req, res) {
  if (req.user) {
    let id = req.user.sub;

    try {
      let cliente = await Cliente.findById({ _id: id });

      if (cliente && cliente.foto) {
        let path_img = './uploads/clientes/' + cliente.foto;
        if (fs.existsSync(path_img)) {
          fs.unlinkSync(path_img);
        }
      }

      let cliente_act = await Cliente.findByIdAndUpdate(
        { _id: id },
        { foto: null },
        { new: true }
      );

      res.status(200).send(cliente_act);

    } catch (error) {
      console.log(error);
      res.status(500).send({ data: undefined, message: 'Error al eliminar la foto' });
    }

  } else {
    res.status(500).send({ data: undefined, message: 'ErrorToken' });
  }
}
module.exports = {
    registro_cliente_ecommerce,
    login_cliente,
    actualizar_perfil_cliente,
    actualizar_foto_cliente,
    obtener_portada_cliente,
    eliminar_foto_cliente
}