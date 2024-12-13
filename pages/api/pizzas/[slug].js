import { connectToDB } from "@/lib/database";
import { Pizza } from "@/lib/models";

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    await connectToDB();

    if (req.method === 'GET') {
      const pizza = await Pizza.findById(slug).populate('ingredients');
      if (!pizza) {
        return res.status(404).json({ error: 'Pizza not found' });
      }
      return res.status(200).json(pizza);
    } 

    if (req.method === 'DELETE') {
      const deletedPizza = await Pizza.findByIdAndDelete(slug);
      if (!deletedPizza) {
        return res.status(404).json({ error: 'Pizza not found for deletion' });
      }
      return res.status(200).json({ message: 'Pizza deleted successfully' });
    }

    if (req.method === 'PUT') {
      const { name, ingredients } = req.body;

      if (!name || !ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const updatedPizza = await Pizza.findByIdAndUpdate(
        slug,
        { name, ingredients },
        { new: true }
      ).populate('ingredients');

      if (!updatedPizza) {
        return res.status(404).json({ error: 'Pizza not found for update' });
      }

      return res.status(200).json(updatedPizza);
    }

    res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}