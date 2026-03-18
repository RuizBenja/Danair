const fs = require('fs');
const path = require('path');

const MAX_WEBP_SIZE = 500 * 1024; // 500 KB
const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 MB

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function validateWebp(file) {
  if (!file) return 'Archivo requerido';
  const mimeOk = (file.type || '').toLowerCase() === 'image/webp';
  if (!mimeOk) return 'Solo se permite imagen WebP';
  if (file.size && file.size > MAX_WEBP_SIZE) return 'La imagen supera 500KB';
  return null;
}

function validatePdf(file) {
  if (!file) return 'Archivo requerido';
  const mime = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  const mimeOk = mime === 'application/pdf' || name.endsWith('.pdf');
  if (!mimeOk) return 'Solo se permite archivo PDF';
  if (file.size && file.size > MAX_PDF_SIZE) return 'El PDF supera 5MB';
  return null;
}

function deleteFileIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (_) {}
  }
}

module.exports = { ensureDir, validateWebp, validatePdf, deleteFileIfExists, MAX_WEBP_SIZE, MAX_PDF_SIZE };
