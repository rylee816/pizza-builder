'use client'
import React from 'react'
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const fetchPizzaBySlug = async (slug) => {
  const response = await axios.get(`/api/pizzas/${slug}`);
  return response.data;
};

const deletePizza = async (slug) => {
  const response = await axios.delete(`/api/pizzas/${slug}`);
  return response.data;
};

const PizzaDetails = ({ params }) => {
    const router = useRouter()
    const { slug } = React.use(params);
    const { toast } = useToast()

  const queryClient = useQueryClient();

  const { data: pizza, isLoading, isError } = useQuery({
    queryKey: ['pizza', slug],
    queryFn: () => fetchPizzaBySlug(slug),
    enabled: !!slug, 
  });

  const { mutate: handleDelete, isLoading: isDeleting } = useMutation({
    mutationFn: () => deletePizza(slug),
    onSuccess: () => {
      queryClient.invalidateQueries(['pizza', slug]); 
      queryClient.invalidateQueries(['pizzas']); 
      toast({
        title: "Pizza Deleted!",
        description: "Your pizza has been successfully deleted.",
    });
      router.push('/');
    },
    onError: (error) => {
      console.error('Failed to delete pizza:', error);
      alert('Failed to delete pizza.');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Failed to fetch pizza details</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/">Back to Home</Link>
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
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
          <div className="flex gap-4 mt-6">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              onClick={() => {
                if (confirm('Are you sure you want to delete this pizza?')) {
                  handleDelete();
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Pizza'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetails;