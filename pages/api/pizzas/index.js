import { connectToDB } from '@/lib/database'
import { Pizza } from '@/lib/models'

export default async function handler(req, res) {
    try {
        await connectToDB()
        const pizzas = await Pizza.find({})
        res.status(200).json(pizzas)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pizzas' })
    }
}