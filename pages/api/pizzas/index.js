import { connectToDB } from '@/lib/database'
import { Pizza } from '@/lib/models'

export default async function handler(req, res) {
    try {
        await connectToDB()
        const pizzas = await Pizza.find({}).populate('ingredients')
        res.status(200).json(pizzas)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pizzas' })
    }
}

// export default async function handler(req, res) {
//     if (req.method === 'GET') {
//         try {
//             await connectToDB()

//             const pizzas = await Pizza.find()
//             res.setHeader('Cache-Control', 'no-store') // Prevent caching
//             res.status(200).json(pizzas)
//         } catch (error) {
//             console.error('Error fetching pizzas:', error)
//             res.status(500).json({ error: 'Internal server error' })
//         }
//     } else {
//         res.setHeader('Allow', ['GET'])
//         res.status(405).end(`Method ${req.method} Not Allowed`)
//     }
// }