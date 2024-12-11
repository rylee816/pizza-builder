import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function PizzaCarousel() {
  const { data: pizzas, isLoading, isError, error } = useQuery({
    queryKey: ['pizzas'],
    queryFn: async () => {
      const { data } = await axios.get('/api/pizzas');
      return data;
    },
  });

  // TODO: add loading skeleton and better error display
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <ul>
        {pizzas.map((pizza) => (
          <li key={pizza._id}>{pizza.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PizzaCarousel;