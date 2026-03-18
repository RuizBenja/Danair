require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const Categoria = require('../models/categoria');
const Subcategoria = require('../models/subcategoria');

const MONGO = 'mongodb://127.0.0.1:27017/compresores';

const data = [
  { titulo: 'Compresores de Tornillo Lubricados', subs: ['Velocidad Variable (PM/PM2)', 'Velocidad Fija (D, DV-V)', 'Alta Eficiencia (EPM/EPM2)'] },
  { titulo: 'Compresores Oil-Free', subs: ['Tornillo Oil-Free (Serie G)', 'Scroll Oil-Free (Serie XA)', 'Clase 0'] },
  { titulo: 'Compresores de Piston', subs: ['Alta presion / Booster (40 bar)', 'Oil-Free', 'Lubricada', 'Modular silenciosa (ASO/BSO)'] },
  { titulo: 'Tratamiento Aire Comprimido', subs: ['Secadores frigorificos', 'Secadores de adsorcion', 'Filtros / Separadores', 'Purgas automaticas'] },
  { titulo: 'Estanques / Acumuladores', subs: ['Vertical', 'Horizontal', '11-16 bar', '20-40 bar'] },
  { titulo: 'Generadores de Nitrogeno', subs: ['PSA', 'Membrana'] },
  { titulo: 'Generadores de Oxigeno', subs: ['PSA'] },
  { titulo: 'Turbo Compresores BOGE', subs: ['Alta velocidad', 'Alta eficiencia'] },
  { titulo: 'Monitoreo / Control', subs: ['Telemetria', 'Sensores PdP / Caudal', 'Control maestro'] },
  { titulo: 'Instrumentos de Medicion', subs: ['Caudal', 'Presion', 'Punto de rocio'] },
  { titulo: 'Repuestos, Insumos y Otros', subs: ['Kits servicio', 'Lubricantes', 'Valvulas / Purgas', 'Consumibles filtros'] }
];

(async () => {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', MONGO);

    for (const cat of data) {
      const slug = slugify(cat.titulo, { lower: true, strict: true, locale: 'es' });
      let categoria = await Categoria.findOne({ slug });
      if (!categoria) {
        categoria = await Categoria.create({ titulo: cat.titulo, slug, estado: true });
        console.log('Categoria creada:', cat.titulo);
      } else {
        console.log('Categoria existe:', cat.titulo);
      }

      for (const sub of cat.subs) {
        const slugSub = slugify(sub, { lower: true, strict: true, locale: 'es' });
        const exists = await Subcategoria.findOne({ titulo: sub, categoria: categoria._id });
        if (!exists) {
          await Subcategoria.create({ titulo: sub, slug: slugSub, categoria: categoria._id });
          console.log('  Subcategoria creada:', sub);
        } else {
          console.log('  Subcategoria existe:', sub);
        }
      }
    }
    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
