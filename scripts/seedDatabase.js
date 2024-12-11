import 'module-alias/register.js'
import mongoose from 'mongoose'
import { connectToDB } from '@/lib/database'
import { Ingredient, Pizza } from '@/lib/models'

const seedDatabase = async () => {
    try {
        await connectToDB()

        await Ingredient.deleteMany({})
        await Pizza.deleteMany({})
        console.log('Cleared existing data')

        const ingredients = [
            { name: 'Standard Dough', type: 'dough', price: 2.5, calories: 200 },
            { name: 'Garlic Herb Crust', type: 'dough', price: 3.0, calories: 230 },
            { name: 'Cheese-Stuffed Crust', type: 'dough', price: 3.5, calories: 300 },
            { name: 'Pepperoni', type: 'meat', price: 1.5, calories: 250 },
            { name: 'Mushrooms', type: 'veggie', price: 0.5, calories: 50 },
            { name: 'Cheese', type: 'dairy', price: 1.0, calories: 200 },
            { name: 'Tomato Sauce', type: 'sauce', price: 0.75, calories: 100 },
            { name: 'Olives', type: 'veggie', price: 0.5, calories: 40 },
        ]

        const savedIngredients = await Ingredient.insertMany(ingredients)
        console.log('Seeded ingredients:', savedIngredients)


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
        ]

        const savedPizzas = await Pizza.insertMany(pizzas)
        console.log('Seeded pizzas:', savedPizzas)

        mongoose.connection.close()
        console.log('Database seeded successfully and connection closed')
    } catch (error) {
        console.error('Error seeding database:', error)
        mongoose.connection.close()
    }
}