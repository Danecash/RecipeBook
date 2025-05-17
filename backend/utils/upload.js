// backend/utils/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = (req.body.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-');
    const uploadPath = path.join(__dirname, '../uploads', category);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `recipe-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }
});

// Image optimization with Sharp
let sharp;
try {
  sharp = require('sharp');
  
  upload.optimize = async (filePath, category) => {
    try {
      const categoryDir = category.toLowerCase().replace(/\s+/g, '-');
      const optimizedDir = path.join(__dirname, '../uploads', categoryDir);
      fs.mkdirSync(optimizedDir, { recursive: true });
      
      const optimizedFilename = `optimized-${path.basename(filePath)}.jpg`;
      const optimizedPath = path.join(optimizedDir, optimizedFilename);
      
      await sharp(filePath)
        .resize(800, 600) // Consistent 4:3 ratio
        .jpeg({ quality: 80 })
        .toFile(optimizedPath);
      
      return {
        optimizedPath,
        publicPath: `/uploads/${categoryDir}/${optimizedFilename}`
      };
    } catch (error) {
      console.error('Optimization failed:', error);
      return {
        optimizedPath: filePath,
        publicPath: filePath.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/')
      };
    }
  };
} catch (err) {
  console.warn('Sharp not available - skipping optimization');
  upload.optimize = async (filePath) => ({
    optimizedPath: filePath,
    publicPath: filePath.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/')
  });
}

module.exports = upload;