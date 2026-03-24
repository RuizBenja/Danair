var Proveedor = require('../models/proveedor');

function validateProveedorData(data){
  if(!data.nombre || !data.nombre.trim()) return 'Ingresa el nombre.';
  if(!data.contacto || !data.contacto.trim()) return 'Ingresa el contacto.';
  if(!data.email || !data.email.trim()) return 'Ingresa el email.';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) return 'Ingresa un email valido.';
  if(!data.telefono || !data.telefono.trim()) return 'Ingresa el telefono.';
  if(!data.direccion || !data.direccion.trim()) return 'Ingresa la direccion.';
  return null;
}

const registro_proveedor_admin = async function(req,res){
  try{
    const data = req.body;
    const validationError = validateProveedorData(data);
    if(validationError) return res.status(400).send({message: validationError});
    const proveedor = await Proveedor.create({
      nombre: data.nombre,
      contacto: data.contacto || '',
      email: data.email || '',
      telefono: data.telefono || '',
      telefono_alt: data.telefono_alt || '',
      direccion: data.direccion || '',
      sitio: data.sitio || '',
      notas: data.notas || ''
    });
    return res.status(200).send({ data: proveedor });
  }catch(e){
    console.log(e);
    return res.status(500).send({ message:'Error al crear proveedor' });
  }
};

const listar_proveedores_admin = async function(req,res){
  try{
    const proveedores = await Proveedor.find().sort({createdAt:-1});
    return res.status(200).send(proveedores);
  }catch(e){
    console.log(e);
    return res.status(500).send({ message:'Error al listar proveedores' });
  }
};

const obtener_proveedor_admin = async function(req,res){
  try{
    const id = req.params['id'];
    const proveedor = await Proveedor.findById(id);
    if(!proveedor) return res.status(404).send({ message:'No encontrado' });
    return res.status(200).send(proveedor);
  }catch(e){
    console.log(e);
    return res.status(500).send({ message:'Error al obtener proveedor' });
  }
};

const actualizar_proveedor_admin = async function(req,res){
  try{
    const id = req.params['id'];
    const data = req.body;
    const validationError = validateProveedorData(data);
    if(validationError) return res.status(400).send({message: validationError});
    const proveedor = await Proveedor.findByIdAndUpdate(id,{
      nombre: data.nombre,
      contacto: data.contacto || '',
      email: data.email || '',
      telefono: data.telefono || '',
      telefono_alt: data.telefono_alt || '',
      direccion: data.direccion || '',
      sitio: data.sitio || '',
      notas: data.notas || ''
    }, { new:true });
    return res.status(200).send({ data: proveedor });
  }catch(e){
    console.log(e);
    return res.status(500).send({ message:'Error al actualizar proveedor' });
  }
};

const eliminar_proveedor_admin = async function(req,res){
  try{
    const id = req.params['id'];
    const proveedor = await Proveedor.findByIdAndDelete(id);
    if(!proveedor) return res.status(404).send({ message:'No encontrado' });
    return res.status(200).send({ message:'Proveedor eliminado' });
  }catch(e){
    console.log(e);
    return res.status(500).send({ message:'Error al eliminar proveedor' });
  }
};

module.exports = {
  registro_proveedor_admin,
  listar_proveedores_admin,
  obtener_proveedor_admin,
  actualizar_proveedor_admin,
  eliminar_proveedor_admin
};
