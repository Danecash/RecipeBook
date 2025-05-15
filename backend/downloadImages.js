const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Image URLs for each recipe
const imageUrls = {
  // Appetizers
  'bruschetta.jpg': 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&h=600&fit=crop',
  'stuffed-mushrooms.jpg': 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&h=600&fit=crop',
  'spinach-dip.jpg': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop',
  'deviled-eggs.jpg': 'https://images.unsplash.com/photo-1611758238044-5b1c902b6c6d?w=800&h=600&fit=crop',
  'caprese-skewers.jpg': 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&h=600&fit=crop',

  // Meals
  'beef-steak.jpg': 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&h=600&fit=crop',
  'chicken-alfredo.jpg': 'https://images.unsplash.com/photo-1645112598816-463679f5a7a1?w=800&h=600&fit=crop',
  'vegetable-stir-fry.jpg': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
  'grilled-salmon.jpg': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
  'beef-tacos.jpg': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',

  // Desserts
  'chocolate-cake.jpg': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
  'apple-pie.jpg': 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=600&fit=crop',
  'tiramisu.jpg': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop',
  'cheesecake.jpg': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=600&fit=crop',
  'chocolate-chip-cookies.jpg': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop',

  // Beverages
  'fruit-smoothie.jpg': 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800&h=600&fit=crop',
  'iced-coffee.jpg': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop',
  'lemonade.jpg': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&h=600&fit=crop',
  'hot-chocolate.jpg': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop',
  'mango-lassi.jpg': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&h=600&fit=crop'
};

// Function to download an image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        writeFile(filepath, buffer)
          .then(() => resolve())
          .catch(reject);
      });
    }).on('error', reject);
  });
};

// Main function to download all images
const downloadAllImages = async () => {
  const categories = ['appetizer', 'meal', 'desserts', 'beverages'];
  
  // Create category directories
  for (const category of categories) {
    const dir = path.join(__dirname, 'uploads', category);
    await mkdir(dir, { recursive: true });
  }

  // Download images
  for (const [filename, url] of Object.entries(imageUrls)) {
    const category = filename.split('-')[0] === 'beef' ? 'meal' :
                    filename.split('-')[0] === 'chocolate' ? 'desserts' :
                    filename.split('-')[0] === 'fruit' ? 'beverages' :
                    filename.split('-')[0] === 'iced' ? 'beverages' :
                    filename.split('-')[0] === 'lemonade' ? 'beverages' :
                    filename.split('-')[0] === 'hot' ? 'beverages' :
                    filename.split('-')[0] === 'mango' ? 'beverages' :
                    filename.split('-')[0] === 'apple' ? 'desserts' :
                    filename.split('-')[0] === 'tiramisu' ? 'desserts' :
                    filename.split('-')[0] === 'cheesecake' ? 'desserts' :
                    'appetizer';

    const filepath = path.join(__dirname, 'uploads', category, filename);
    console.log(`Downloading ${filename} to ${category}...`);
    
    try {
      await downloadImage(url, filepath);
      console.log(`Successfully downloaded ${filename}`);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error);
    }
  }
};

// Run the download function
downloadAllImages().catch(console.error); 