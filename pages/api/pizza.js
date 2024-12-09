import { Pizza, Ingredient } from '@/lib/models';
import { connectToDB } from '@/lib/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectToDB();

            const { selectedIngredients, name } = req.body;

            const ingredients = await Ingredient.find({ '_id': { $in: selectedIngredients } });

            const totalPrice = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
            const totalCalories = ingredients.reduce((sum, ingredient) => sum + ingredient.calories, 0);

            const pizza = new Pizza({
                name: name || 'Custom Pizza', // Optional: Default name if none provided
                ingredients: selectedIngredients,
                totalPrice,
                totalCalories,
            });

            await pizza.save();

            res.status(201).json({ message: 'Pizza created successfully', pizza });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create pizza' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}