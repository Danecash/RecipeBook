//backend/middlewares/validateRecipe.js
// Middleware to validate recipe data in requests

const validateRecipeData = (req, res, next) => {
  const { name, category, ingredients, instructions } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Recipe name is required" });
  if (!category?.trim()) return res.status(400).json({ error: "Category is required" });

  try {
    const ingArray = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
    const insArray = Array.isArray(instructions) ? instructions : JSON.parse(instructions);

    if (!ingArray.length) return res.status(400).json({ error: "At least one ingredient is required" });
    if (!insArray.length) return res.status(400).json({ error: "At least one instruction is required" });

    req.parsedData = { ingredients: ingArray, instructions: insArray };
    next();
  } catch (e) {
    return res.status(400).json({
      error: "Invalid ingredients or instructions format",
      details: "Must be valid JSON arrays"
    });
  }
};

module.exports = validateRecipeData;