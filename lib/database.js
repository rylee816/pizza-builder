import mongoose from 'mongoose';
import { Ingredient, Pizza } from './models';

export const connectToDB = async () => {
    try {
        if (mongoose.connection.readyState) {
            console.log('Using existing connection');
            // throw new Error("Simulated Error")
            return;
        }
        await mongoose.connect(process.env.NEXT_MONGO_DB)
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw new Error('Database connection failed');
    }
};

export const connectToDBWithRetry = async (retries = 3, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await connectToDB();
            return;
        } catch (err) {
            console.warn(`Attempt ${attempt} to connect to database failed. Retrying in ${delay}ms...`);
            if (attempt < retries) {
                await new Promise((res) => setTimeout(res, delay));
            } else {
                console.error('All retries to connect to database failed.');
                throw err;
            }
        }
    }
}

export const seedDatabase = async () => {
    try {
        await connectToDB();

        await Ingredient.deleteMany({});
        await Pizza.deleteMany({});
        console.log('Cleared existing data');

        const ingredients = [
            { name: 'Standard Dough', type: 'dough', price: 2.5, calories: 200 },
            { name: 'Garlic Herb Crust', type: 'dough', price: 3.0, calories: 230 },
            { name: 'Cheese-Stuffed Crust', type: 'dough', price: 3.5, calories: 300 },
            { name: 'Pepperoni', type: 'meat', price: 1.5, calories: 250 },
            { name: 'Xtra Pepperoni', type: 'meat', price: 1.5, calories: 250 },
            { name: 'Italian Sausage', type: 'meat', price: 1.7, calories: 220 },
            { name: 'Mushrooms', type: 'veggie', price: 0.5, calories: 50 },
            { name: 'Cheese', type: 'dairy', price: 1.0, calories: 200 },
            { name: 'Goat Cheese', type: 'dairy', price: 2.4, calories: 200 },
            { name: 'Tomato Sauce', type: 'sauce', price: 0.75, calories: 100 },
            { name: 'Tomato Garlic Sauce', type: 'sauce', price: 1.10, calories: 100 },
            { name: 'Extra Sauce', type: 'sauce', price: 0.75, calories: 100 },
            { name: 'Olives', type: 'veggie', price: 0.5, calories: 40 },
            // { name: 'Sesame Seed', type: 'other', price: 0.5, calories: 40 },
        ];

        const savedIngredients = await Ingredient.insertMany(ingredients);
        console.log('Seeded ingredients:', savedIngredients);


        const pizzas = [
            {
                name: 'Classic Pepperoni',
                ingredients: [
                    savedIngredients.find((i) => i.name === 'Standard Dough')._id,
                    savedIngredients.find((i) => i.name === 'Tomato Sauce')._id,
                    savedIngredients.find((i) => i.name === 'Cheese')._id,
                    savedIngredients.find((i) => i.name === 'Pepperoni')._id,
                ],
                totalPrice: 2.5 + 0.75 + 1.0 + 1.5, 
                totalCalories: 200 + 100 + 200 + 250, 
            },
            {
                name: 'Veggie Delight',
                ingredients: [
                    savedIngredients.find((i) => i.name === 'Garlic Herb Crust')._id,
                    savedIngredients.find((i) => i.name === 'Tomato Sauce')._id,
                    savedIngredients.find((i) => i.name === 'Cheese')._id,
                    savedIngredients.find((i) => i.name === 'Mushrooms')._id,
                    savedIngredients.find((i) => i.name === 'Olives')._id,
                ],
                totalPrice: 3.0 + 0.75 + 1.0 + 0.5 + 0.5, 
                totalCalories: 230 + 100 + 200 + 50 + 40, 
            },
            {
                name: 'Carnivore',
                ingredients: [
                    savedIngredients.find((i) => i.name === 'Garlic Herb Crust')._id,
                    savedIngredients.find((i) => i.name === 'Pepperoni')._id,
                    savedIngredients.find((i) => i.name === 'Xtra Pepperoni')._id,
                    savedIngredients.find((i) => i.name === 'Cheese')._id,
                    savedIngredients.find((i) => i.name === 'Tomato Sauce')._id,
                ],
                totalPrice: 3.0 + 0.75 + 1.0 + 0.5 + 0.5, 
                totalCalories: 230 + 100 + 200 + 50 + 40, 
            },
        ];

        const savedPizzas = await Pizza.insertMany(pizzas);
        console.log('Seeded pizzas:', savedPizzas);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close()
    }
};
