const Usuario = require('../models/usuario.js');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt.js');
const path = require('path');
const fs = require('fs');

const MAX_WEBP = 500 * 1024;
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'usuarios');
const DEFAULT_AVATAR = 'default.jpg';

function currentUserId(req) {
  return String(req.user?.sub || req.user?._id || '');
}

function isAdmin(req) {
  return req.user?.rol === 'Administrador';
}

function canManageUser(req, targetId) {
  return isAdmin(req) || currentUserId(req) === String(targetId || '');
}

function avatarDiskPath(filename) {
  return path.join(UPLOADS_DIR, filename || DEFAULT_AVATAR);
}

function removeFileSafe(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (_) {}
}

function validateWebp(file) {
  if (!file) return 'Archivo requerido';
  if ((file.type || '').toLowerCase() !== 'image/webp') return 'Avatar debe ser WEBP';
  if (file.size && file.size > MAX_WEBP) return 'Avatar debe ser WEBP y <=500KB';
  return null;
}

function validateUsuarioData(data, options) {
  const settings = options || {};
  if (!data.nombres || !String(data.nombres).trim()) return 'Ingresa los nombres.';
  if (!data.apellidos || !String(data.apellidos).trim()) return 'Ingresa los apellidos.';
  if (!data.email || !String(data.email).trim()) return 'Ingresa el email.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) return 'Ingresa un email valido.';
  if (settings.requireRol !== false && (!data.rol || !String(data.rol).trim())) return 'Selecciona un cargo.';
  return null;
}

async function ensureUniqueEmail(email, excludeId) {
  const existing = await Usuario.findOne({ email: String(email).trim(), _id: { $ne: excludeId } });
  return !existing;
}

const registro_usuario_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: 'ErrorToken' });
  if (!isAdmin(req)) return res.status(403).send({ data: undefined, message: 'No autorizado' });

  const data = req.body;
  const validationError = validateUsuarioData(data, { requireRol: true });
  if (validationError) return res.status(400).send({ data: undefined, message: validationError });

  if (!(await ensureUniqueEmail(data.email, null))) {
    return res.status(200).send({ data: undefined, message: 'El correo electronico ya existe' });
  }

  if (req.files && req.files.avatar) {
    const file = req.files.avatar;
    const err = validateWebp(file);
    if (err) {
      removeFileSafe(file.path);
      return res.status(400).send({ message: err });
    }
    data.avatar = path.basename(file.path);
  }

  bcrypt.hash('123456', null, null, async function (err, hash) {
    if (err) return res.status(200).send({ data: undefined, message: 'No se pudo encriptar la contrasena' });
    data.password = hash;
    try {
      const usuario = await Usuario.create(data);
      return res.status(200).send({ data: usuario });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ data: undefined, message: 'Error al crear el usuario' });
    }
  });
};

const login_usuario = async function (req, res) {
  const data = req.body;
  const usuarios = await Usuario.find({ email: data.email });
  if (usuarios.length < 1) return res.status(200).send({ data: undefined, message: 'No se encontro el correo electronico' });
  const u = usuarios[0];
  if (!u.estado) return res.status(200).send({ data: undefined, message: 'Su cuenta esta desactivada' });
  bcrypt.compare(data.password, u.password, function (err, check) {
    if (check) return res.status(200).send({ token: jwt.createToken(u), usuario: u });
    return res.status(200).send({ data: undefined, message: 'La contrasena es incorrecta' });
  });
};

const listar_usuario_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: 'ErrorToken' });
  if (!isAdmin(req)) return res.status(403).send({ data: undefined, message: 'No autorizado' });

  const filtro = req.params.Filtro || '';
  const usuarios = await Usuario.find({
    $or: [
      { nombres: new RegExp(filtro, 'i') },
      { apellidos: new RegExp(filtro, 'i') },
      { email: new RegExp(filtro, 'i') }
    ]
  });
  return res.status(200).send(usuarios);
};

const obtener_usuario_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: 'ErrorToken' });
  const id = req.params.id;
  if (!canManageUser(req, id)) return res.status(403).send({ data: undefined, message: 'No autorizado' });

  try {
    const usuario = await Usuario.findById({ _id: id });
    return res.status(200).send(usuario);
  } catch (_) {
    return res.status(200).send(undefined);
  }
};

const actualizar_usuario_admin = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: 'ErrorToken' });

  const id = req.params.id;
  if (!canManageUser(req, id)) return res.status(403).send({ data: undefined, message: 'No autorizado' });

  const existing = await Usuario.findById({ _id: id });
  if (!existing) return res.status(404).send({ data: undefined, message: 'Usuario no encontrado' });

  const adminEditing = isAdmin(req);
  const data = {
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    email: req.body.email,
    rol: adminEditing ? req.body.rol : existing.rol
  };

  const validationError = validateUsuarioData(data, { requireRol: true });
  if (validationError) return res.status(400).send({ data: undefined, message: validationError });

  if (!(await ensureUniqueEmail(data.email, id))) {
    return res.status(400).send({ data: undefined, message: 'El correo electronico ya existe' });
  }

  const update = {
    nombres: String(data.nombres).trim(),
    apellidos: String(data.apellidos).trim(),
    email: String(data.email).trim(),
    rol: String(data.rol).trim()
  };

  if (req.files && req.files.avatar) {
    const file = req.files.avatar;
    const err = validateWebp(file);
    if (err) {
      removeFileSafe(file.path);
      return res.status(400).send({ message: err });
    }
    const nextAvatar = path.basename(file.path);
    if (existing.avatar && existing.avatar !== DEFAULT_AVATAR) {
      removeFileSafe(avatarDiskPath(existing.avatar));
    }
    update.avatar = nextAvatar;
  }

  if (!req.files?.avatar && req.body.avatar === '') {
    if (existing.avatar && existing.avatar !== DEFAULT_AVATAR) {
      removeFileSafe(avatarDiskPath(existing.avatar));
    }
    update.avatar = DEFAULT_AVATAR;
  }

  const usuario = await Usuario.findByIdAndUpdate({ _id: id }, update, { new: true });
  return res.status(200).send(usuario);
};

const cambiar_estado_usuario = async function (req, res) {
  if (!req.user) return res.status(500).send({ data: undefined, message: 'ErrorToken' });
  if (!isAdmin(req)) return res.status(403).send({ data: undefined, message: 'No autorizado' });

  const id = req.params.id;
  const data = req.body;
  const nuevo_estado = !data.estado;
  const usuario = await Usuario.findByIdAndUpdate({ _id: id }, { estado: nuevo_estado });
  return res.status(200).send(usuario);
};

const reset_password_admin = async function (req, res) {
  try {
    if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
    if (!isAdmin(req)) return res.status(403).send({ message: 'Solo administradores pueden resetear contrasenas' });

    const id = req.params.id;
    const newPassword = req.body.new_password;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).send({ message: 'La contrasena debe tener al menos 6 caracteres' });
    }

    bcrypt.hash(newPassword, null, null, async function (err, hash) {
      if (err) return res.status(500).send({ message: 'No se pudo encriptar la contrasena' });
      const user = await Usuario.findByIdAndUpdate({ _id: id }, { password: hash }, { new: true });
      if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });
      return res.status(200).send({ ok: true });
    });
  } catch (e) {
    console.error('reset_password_admin error:', e);
    return res.status(500).send({ message: 'Error en el servidor' });
  }
};

const obtener_avatar_usuario = async function (req, res) {
  const img = req.params.img;
  const target = avatarDiskPath(img);
  const fallback = avatarDiskPath(DEFAULT_AVATAR);
  fs.stat(target, function (err) {
    if (err) return res.status(200).sendFile(path.resolve(fallback));
    return res.status(200).sendFile(path.resolve(target));
  });
};

module.exports = {
  registro_usuario_admin,
  login_usuario,
  listar_usuario_admin,
  obtener_usuario_admin,
  actualizar_usuario_admin,
  cambiar_estado_usuario,
  obtener_avatar_usuario,
  reset_password_admin
};
