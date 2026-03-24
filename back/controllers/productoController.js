const Producto = require("../models/producto");
const Categoria = require("../models/categoria");
const Subcategoria = require("../models/subcategoria");
const Galeria = require("../models/galeria");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");
const { ensureDir, validateWebp, validatePdf, deleteFileIfExists } = require('./mediaUtils');

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');
const CATEGORY_RULES = {
  'Compresores de Tornillo Lubricados': ['tecnologia', 'potencia', 'presion', 'caudal'],
  'Compresores Oil-Free': ['tecnologia', 'potencia', 'presion', 'caudal'],
  'Compresores de Piston': ['tecnologia', 'potencia', 'presion', 'caudal'],
  'Tratamiento Aire Comprimido': ['tecnologia', 'presion', 'caudal', 'str_variedad'],
  'Estanques / Acumuladores': ['presion', 'orientacion', 'material', 'volumen', 'str_variedad'],
  'Generadores de Nitrogeno': ['tecnologia', 'pureza', 'caudal', 'presion'],
  'Generadores de Oxigeno': ['tecnologia', 'pureza', 'caudal', 'presion'],
  'Turbo Compresores BOGE': ['tecnologia', 'potencia', 'presion', 'caudal'],
  'Monitoreo / Control': ['str_variedad'],
  'Instrumentos de Medicion': ['str_variedad'],
  'Repuestos, Insumos y Otros': ['str_variedad']
};

const PRODUCTOS_DIR = path.join(UPLOADS_DIR, 'productos');
const GALERIA_DIR = path.join(UPLOADS_DIR, 'galeria');
const FICHAS_DIR = path.join(UPLOADS_DIR, 'fichas');
const DEFAULT_FILE = path.join(UPLOADS_DIR, 'default.jpg');
[UPLOADS_DIR, PRODUCTOS_DIR, GALERIA_DIR, FICHAS_DIR].forEach(ensureDir);

function movePdfToFichas(file) {
  const fileName = path.basename(file.path);
  const targetPath = path.join(FICHAS_DIR, fileName);
  fs.renameSync(file.path, targetPath);
  return fileName;
}

function buildProductoPayload(data) {
  return {
    titulo: data.titulo,
    slug: slugify(data.titulo || "", { lower: true, strict: true }),
    categoria: data.categoria,
    subcategoria: data.subcategoria || "",
    marca: data.marca || "",
    serie: data.serie || "",
    modelo: data.modelo || "",
    extracto: data.extracto,
    descripcion: data.descripcion || "",
    ficha_tecnica: data.ficha_tecnica || '',
    ficha_pdf: Object.prototype.hasOwnProperty.call(data, 'ficha_pdf') ? (data.ficha_pdf || '') : undefined,
    tecnologia: data.tecnologia || "",
    potencia: data.potencia || "",
    presion: data.presion || "",
    caudal: data.caudal || "",
    aplicacion: data.aplicacion || "",
    industria: data.industria || "",
    orientacion: data.orientacion || "",
    material: data.material || "",
    volumen: data.volumen || "",
    pureza: data.pureza || "",
    arriendo: data.arriendo === "true" || data.arriendo === true,
    estado: data.estado === "true" || data.estado === true,
    str_variedad: data.str_variedad || ""
  };
}

function validateProductoData(data) {
  if (!data.titulo || !data.titulo.trim()) return 'Ingresa el titulo del producto.';
  if (!data.categoria || !data.categoria.trim()) return 'Selecciona una categoria.';
  if (!data.subcategoria || !data.subcategoria.trim()) return 'Selecciona una subcategoria.';
  if (!data.marca || !data.marca.trim()) return 'Selecciona una marca.';
  if (!data.serie || !data.serie.trim()) return 'Ingresa la serie.';
  if (!data.modelo || !data.modelo.trim()) return 'Ingresa el modelo.';
  if (!data.extracto || !data.extracto.trim()) return 'Ingresa el extracto.';
  if (!data.descripcion || !data.descripcion.trim()) return 'Ingresa la descripcion.';

  const activeFields = CATEGORY_RULES[data.categoria] || [];
  if (activeFields.includes('tecnologia') && (!data.tecnologia || !data.tecnologia.trim())) return 'Ingresa la tecnologia.';
  if (activeFields.includes('potencia') && (!data.potencia || !data.potencia.trim())) return 'Ingresa la potencia.';
  if (activeFields.includes('presion') && (!data.presion || !data.presion.trim())) return 'Ingresa la presion.';
  if (activeFields.includes('caudal') && (!data.caudal || !data.caudal.trim())) return 'Ingresa el caudal.';
  if (activeFields.includes('aplicacion') && (!data.aplicacion || !data.aplicacion.trim())) return 'Ingresa la aplicacion.';
  if (activeFields.includes('industria') && (!data.industria || !data.industria.trim())) return 'Ingresa la industria.';
  if (activeFields.includes('orientacion') && (!data.orientacion || !data.orientacion.trim())) return 'Ingresa la orientacion.';
  if (activeFields.includes('material') && (!data.material || !data.material.trim())) return 'Ingresa el material.';
  if (activeFields.includes('volumen') && (!data.volumen || !data.volumen.trim())) return 'Ingresa el volumen.';
  if (activeFields.includes('pureza') && (!data.pureza || !data.pureza.trim())) return 'Ingresa la pureza.';
  if (activeFields.includes('str_variedad') && (!data.str_variedad || !data.str_variedad.trim())) return 'Ingresa el texto tecnico adicional.';
  return null;
}

const registro_producto_admin = async function (req, res) {
  if (!req.user) return res.status(401).send({ data: undefined, message: "ErrorToken" });
  try {
    const data = req.body;

    const validationError = validateProductoData(data);
    if (validationError) return res.status(400).send({ data: undefined, message: validationError });

    const exists = await Producto.findOne({ titulo: data.titulo });
    if (exists) return res.status(200).send({ data: undefined, message: "El titulo del producto ya existe." });

    if (!req.files || !req.files.portada) {
      return res.status(400).send({ data: undefined, message: "Debe subir una portada webp." });
    }

    const portadaFile = req.files.portada;
    const err = validateWebp(portadaFile);
    if (err) {
      deleteFileIfExists(portadaFile.path);
      return res.status(400).send({ data: undefined, message: err });
    }

    data.portada = path.basename(portadaFile.path);
    if (req.files && req.files.ficha_pdf) {
      const pdfFile = req.files.ficha_pdf;
      const pdfErr = validatePdf(pdfFile);
      if (pdfErr) {
        deleteFileIfExists(portadaFile.path);
        deleteFileIfExists(pdfFile.path);
        return res.status(400).send({ data: undefined, message: pdfErr });
      }
      data.ficha_pdf = movePdfToFichas(pdfFile);
    }

    const producto = await Producto.create({
      ...buildProductoPayload(data),
      portada: data.portada
    });

    return res.status(200).send({ data: producto });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ data: undefined, message: "No se pudo crear el producto." });
  }
};

const listar_productos_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: "ErrorToken" });
  let Filtro = req.params["Filtro"] || '';
  let productos = await Producto.find({
    $or: [
      { titulo: new RegExp(Filtro, "i") },
      { categoria: new RegExp(Filtro, "i") },
      { subcategoria: new RegExp(Filtro, "i") },
      { marca: new RegExp(Filtro, "i") },
      { serie: new RegExp(Filtro, "i") },
      { modelo: new RegExp(Filtro, "i") }
    ],
  }).sort({ createdAt: -1 });
  res.status(200).send(productos);
};

const obtener_portada_producto = async function (req, res) {
  let img = req.params["img"];
  const path_img = path.join(PRODUCTOS_DIR, img);
  fs.stat(path_img, function (err) {
    if (err) {
      return res.status(200).sendFile(DEFAULT_FILE);
    }
    return res.status(200).sendFile(path.resolve(path_img));
  });
};

const obtener_producto_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: "ErrorToken" });
  let id = req.params["id"];
  try {
    let producto = await Producto.findById({ _id: id });
    res.status(200).send(producto);
  } catch (error) {
    res.status(200).send(undefined);
  }
};

const actualizar_producto_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: "ErrorToken" });
  try {
    const data = req.body;
    const id = req.params["id"];

    const validationError = validateProductoData(data);
    if (validationError) return res.status(400).send({ data: undefined, message: validationError });

    const productoExistente = await Producto.findOne({ titulo: data.titulo, _id: { $ne: id } });
    if (productoExistente) {
      return res.status(200).send({ data: undefined, message: "El titulo del producto ya existe" });
    }

    let updateData = buildProductoPayload(data);
    if (typeof updateData.ficha_pdf === 'undefined') delete updateData.ficha_pdf;

    if (req.files && req.files.portada) {
      const portadaFile = req.files.portada;
      const err = validateWebp(portadaFile);
      if (err) {
        deleteFileIfExists(portadaFile.path);
        return res.status(400).send({ data: undefined, message: err });
      }
      const old = await Producto.findById(id);
      if (old && old.portada) deleteFileIfExists(path.join(PRODUCTOS_DIR, old.portada));
      updateData.portada = path.basename(portadaFile.path);
    }
    if (req.files && req.files.ficha_pdf) {
      const pdfFile = req.files.ficha_pdf;
      const pdfErr = validatePdf(pdfFile);
      if (pdfErr) {
        deleteFileIfExists(pdfFile.path);
        return res.status(400).send({ data: undefined, message: pdfErr });
      }
      const old = await Producto.findById(id);
      if (old && old.ficha_pdf) deleteFileIfExists(path.join(FICHAS_DIR, old.ficha_pdf));
      updateData.ficha_pdf = movePdfToFichas(pdfFile);
    } else if (Object.prototype.hasOwnProperty.call(data, "ficha_pdf") && !data.ficha_pdf) {
      const old = await Producto.findById(id);
      if (old && old.ficha_pdf) deleteFileIfExists(path.join(FICHAS_DIR, old.ficha_pdf));
      updateData.ficha_pdf = "";
    }

    const producto = await Producto.findByIdAndUpdate({ _id: id }, updateData, { new: true });
    res.status(200).send({ data: producto });
  } catch (error) {
    console.log(error);
    res.status(200).send({ data: undefined, message: "No se pudo actualizar el producto" });
  }
};

const listar_activos_productos_admin = async function (_req, res) {
  let productos = await Producto.find({ estado: true }).sort({ createdAt: -1 });
  res.status(200).send(productos);
};

const subir_imagen_producto_admin = async function (req,res) {
  if(!req.user) return res.status(500).send({data:undefined,message:'ErrorToken'});
  let data = req.body;
  if(!req.files || !req.files.imagen) return res.status(400).send({message:'Imagen requerida'});
  const file = req.files.imagen;
  const err = validateWebp(file);
  if (err) {
    deleteFileIfExists(file.path);
    return res.status(400).send({ message: err });
  }
  var str_imagen = path.basename(file.path);
  data.imagen = str_imagen;
  try{
    let imagen = await Galeria.create(data); 
    res.status(200).send({imagen});
  }catch(error){
     console.log(error);
     res.status(200).send({data:undefined,message:'No se pudo crear la imagen'});
  }
}

const obtener_galeria_producto = async function (req, res) {
  let img = req.params["img"];
  const p = path.join(GALERIA_DIR, img);
  fs.stat(p, function (err) {
    if (err) {
      return res.status(200).sendFile(DEFAULT_FILE);
    }
    return res.status(200).sendFile(path.resolve(p));
  });
};

const obtener_galeria_producto_admin = async function (req,res) {
  if(req.user){
    let id = req.params['id'];
    let galeria = await Galeria.find({producto:id});
    res.status(200).send(galeria);
  }else{
      res.status(500).send({data:undefined,message:'ErrorToken'});
  }
}

const obtener_ficha_pdf_producto = async function (req, res) {
  let doc = req.params["doc"];
  const p = path.join(FICHAS_DIR, doc);
  fs.stat(p, function (err) {
    if (err) {
      return res.status(404).send({ message: 'PDF no encontrado' });
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="' + path.basename(p) + '"',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    return res.status(200).sendFile(path.resolve(p));
  });
};
const eliminar_galeria_producto_admin = async function (req,res) {
  if(req.user){
    let id = req.params['id'];
    try {
        let reg = await Galeria.findById({_id: id});
        if (reg && reg.imagen) deleteFileIfExists(path.join(GALERIA_DIR, reg.imagen));
        let galeria = await Galeria.findByIdAndRemove({_id :id});
        res.status(200).send(galeria);
    } catch (error) {
      res.status(200).send({data:undefined,message:'No se pudo eliminar la imagen'});
    }
  }else{
      res.status(500).send({data:undefined,message:'ErrorToken'});
  }
}


const crear_categoria_admin = async function (req,res) {
  try {
    if(!req.user) return res.status(500).send({data:undefined,message:'ErrorToken'});
    let data = req.body;
    const slug = slugify(data.titulo, { lower: true, strict: true, locale: 'es' });
    var reg = await Categoria.find({ slug: slug });
    if(reg.length == 0){
      data.slug = slug;
      if(req.user && (req.user._id || req.user.sub)) data.usuario = req.user._id || req.user.sub;
      var categoria = await Categoria.create(data);
      res.status(200).send(categoria);
    }else{
      res.status(200).send({data:undefined,message:'La Categoria ya existe'});
    }
  } catch (e) {
    console.error('crear_categoria_admin error:', e);
    return res.status(500).send({ data: undefined, message: 'Error inesperado' });
  }
}

const listar_categorias_admin = async function (req,res) {
  if(!req.user) return res.status(500).send({data:undefined,message:'ErrorToken'});
  var regs = await Categoria.find().populate('usuario', 'nombres apellidos email avatar').sort({createdAt:-1});
  var categorias = [];
  for(var item of regs){
    var subcategorias = await Subcategoria.find({categoria: item._id}).sort({ titulo: 1 });
    var productos = await Producto.find({categoria: item.titulo});
    categorias.push({ categoria: item, subcategorias, nproductos: productos.length });
  }
  res.status(200).send(categorias);
}

const crear_subcategoria_admin = async function (req,res) {
  try {
    if(!req.user) return res.status(500).send({data: undefined, message: 'ErrorToken'});
    let data = req.body;
    var reg = await Subcategoria.find({titulo: data.titulo});
    if (reg.length == 0) {
      data.slug = slugify(data.titulo).toLowerCase();
      var subcategoria = await Subcategoria.create(data);
      res.status(200).send(subcategoria);
    }else{
      res.status(200).send({data: undefined, message: 'La subcategoria ya existe.'});
    }
  } catch (e) {
    console.error('crear_subcategoria_admin error:', e);
    res.status(500).send({ data: undefined, message: 'Error inesperado' });
  }
}

const eliminar_subcategoria_admin = async function (req,res) {
  try {
    if(!req.user) return res.status(500).send({data: undefined, message: 'ErrorToken'});
    let id = req.params['id'];
    var reg = await Subcategoria.findByIdAndRemove({_id: id});
    res.status(200).send(reg);
  } catch (e) {
    console.error('eliminar_subcategoria_admin error:', e);
    res.status(500).send({ data: undefined, message: 'Error inesperado' });
  }
}

const cambiar_estado_categoria_admin = async function (req,res) {
     if (!req.user) return res.status(500).send({data:undefined,message: 'ErrorToken'});
     let id = req.params['id'];
     let data = req.body;
     let nuevo_estado = !data.estado;
     let categoria = await Categoria.findByIdAndUpdate ({_id: id},{ estado: nuevo_estado });
     res.status(200).send(categoria);
}

const eliminar_categoria_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: 'ErrorToken' });
  try {
    let rol = req.user.rol;
    if (!rol && req.user.sub) {
      const u = await require('../models/usuario').findById(req.user.sub).select('rol');
      rol = u ? u.rol : undefined;
    }
    if (rol !== 'Administrador') return res.status(403).send({ data: undefined, message: 'No autorizado' });
    const id = req.params.id;
    await Subcategoria.deleteMany({ categoria: id });
    const categoria = await Categoria.findByIdAndDelete({ _id: id });
    if (!categoria) return res.status(404).send({ data: undefined, message: 'Categoria no encontrada' });
    return res.status(200).send({ ok: true });
  } catch (e) {
    return res.status(500).send({ data: undefined, message: 'Error del servidor' });
  }
};

const eliminar_producto_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: "ErrorToken" });
  try {
    const id = req.params["id"];
    const imagenes = await Galeria.find({ producto: id });
    imagenes.forEach((img) => {
      const ruta = path.join(GALERIA_DIR, img.imagen);
      deleteFileIfExists(ruta);
    });
    await Galeria.deleteMany({ producto: id });
    const producto = await Producto.findByIdAndDelete({ _id: id });
    if (!producto) return res.status(404).send({ data: undefined, message: "Producto no encontrado" });
    if (producto.portada) deleteFileIfExists(path.join(PRODUCTOS_DIR, producto.portada));
    if (producto.ficha_pdf) deleteFileIfExists(path.join(FICHAS_DIR, producto.ficha_pdf));
    return res.status(200).send({ ok: true });
  } catch (e) {
    console.error("eliminar_producto_admin error:", e);
    return res.status(500).send({ data: undefined, message: "Error del servidor" });
  }
};

module.exports = {
  registro_producto_admin,
  listar_productos_admin,
  obtener_portada_producto,
  obtener_producto_admin,
  actualizar_producto_admin,
  listar_activos_productos_admin,
  subir_imagen_producto_admin,
  obtener_galeria_producto,
  obtener_galeria_producto_admin,
  eliminar_galeria_producto_admin,
  obtener_ficha_pdf_producto,
  crear_categoria_admin,
  listar_categorias_admin,
  crear_subcategoria_admin,
  eliminar_subcategoria_admin,
  cambiar_estado_categoria_admin,
  eliminar_categoria_admin,
  eliminar_producto_admin
};
