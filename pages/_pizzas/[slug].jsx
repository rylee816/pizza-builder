'use client'
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchPizzaBySlug = async (slug) => {
  const response = await axios.get(`/api/pizzas/${slug}`);
  return response.data;
};

const PizzaDetails = () => {
  // const router = useRouter();
  // const { slug } = router.query;

  // const { data: pizza, isLoading, isError } = useQuery({
  //   queryKey: ['pizza', slug],
  //   queryFn: () => fetchPizzaBySlug(slug), // Correctly pass the function reference
  //   enabled: !!slug, // Prevent query from firing until slug is available
  // });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div className="text-red-500">Failed to fetch pizza details</div>;
  // }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">{pizza.name}</h2>
          <div className="flex justify-between mt-4">
            <span className="text-lg font-bold text-gray-800">${pizza.totalPrice}</span>
            <span className="text-sm text-gray-600">
              {new Date(pizza.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PizzaDetails;