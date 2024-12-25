import mongoose from 'mongoose'

const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['meat', 'veggie', 'dairy', 'sauce', 'dough', 'other'], required: true },
    price: { type: Number, required: true },
    calories: { type: Number, required: true },
    img: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const PizzaSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true }],
    totalPrice: { type: Number, required: true },
    totalCalories: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});



export const Ingredient = mongoose.models?.Ingredient || mongoose.model('Ingredient', IngredientSchema)
export const Pizza = mongoose.models?.Pizza || mongoose.model('Pizza', PizzaSchema)