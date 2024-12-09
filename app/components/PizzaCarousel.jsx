import React from 'react'
import axios from 'axios';

function PizzaCarousel() {
    const fetchPizzas = async () => {
        const { data } = await axios.get('/api/pizzas');
        return data;
    };

    fetchPizzas().then(data => console.log(data))
  return (
    <div>PizzaCarousel</div>
  )
}

export default PizzaCarousel