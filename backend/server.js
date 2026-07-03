require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth.routes');
const recipesRoutes = require('./routes/recipes.routes');
const ingredientsRoutes = require('./routes/ingredients.routes');
const plannerRoutes = require('./routes/planner.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const collectionsRoutes = require('./routes/collections.routes');
const shoppingListRoutes = require('./routes/shoppingList.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'TasteFlow API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`TasteFlow API corriendo en http://localhost:${PORT}`);
});
