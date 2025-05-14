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
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
  
  // Image optimization function
  upload.optimize = async (filePath) => {
    try {
      const optimizedPath = filePath + '-optimized.jpg';
      
      await sharp(filePath)
        .resize(800, 800, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(optimizedPath);
      
      return optimizedPath;
    } catch (error) {
      console.error('Error optimizing image:', error);
      return filePath; // Fallback to original
    }
  };
} catch (sharpError) {
  console.warn('Sharp module not found, image optimization disabled');
  upload.optimize = async (filePath) => filePath; // No optimization
}

module.exports = upload;