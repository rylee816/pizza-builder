
import { Ingredient } from '@/lib/models'
import { connectToDB, connectToDBWithRetry } from '@/lib/database'

export default async function handler(req, res) {
    try {
        // await connectToDB()
        await connectToDBWithRetry()
        const ingredients = await Ingredient.find({})
        res.status(200).json(ingredients)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ingredients' })
    }
}