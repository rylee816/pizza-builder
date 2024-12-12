import { connectToDB } from "@/lib/database"
import { Pizza } from "@/lib/models"

export default async function handler(req, res) {
    const { slug } = req.query
        try {
            await connectToDB()

            const pizza = await Pizza.findById(slug).populate('ingredients')
            console.log(pizza)
            if (!pizza) {
                return res.status(404).json({ error: 'Pizza not found' })
            }

            res.status(200).json(pizza)
        } catch (error) {
            console.error('Error fetching pizza:', error)
            res.status(500).json({ error: 'Internal server error' })
        }
}

// app/api/pizzas/[slug]/route.js