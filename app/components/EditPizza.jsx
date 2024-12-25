'use client';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import IngredientsPanel from './IngredientsPanel';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const fetchPizzaDetails = async (slug) => {
    const { data } = await axios.get(`/api/pizzas/${slug}`);
    return data;
};

const updatePizza = async ({ slug, name, selectedIngredients }) => {
    const { data } = await axios.put(`/api/pizzas/${slug}`, { name, selectedIngredients });
    return data;
};

const EditPizza = ({ params }) => {
    const { slug } = params;
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: pizza, isLoading, isError } = useQuery({
        queryKey: ['pizza', slug],
        queryFn: () => fetchPizzaDetails(slug),
        enabled: !!slug,
    });

    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [pizzaName, setPizzaName] = useState('');

    useEffect(() => {
        if (pizza) {
            setSelectedIngredients(pizza.ingredients);
            setPizzaName(pizza.name);
        }
    }, [pizza]);
    console.log(selectedIngredients, slug, "SLUG")
    const { mutate: handleUpdate, isLoading: isUpdating } = useMutation({
        mutationFn: updatePizza,
        onSuccess: () => {
            queryClient.invalidateQueries(['pizza', slug]);
            queryClient.invalidateQueries(['pizzas']);
            toast({
                title: 'Pizza Updated!',
                description: 'Your pizza has been successfully updated.',
            });
            router.push(`/pizzas/${slug}`);
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to update pizza.',
                variant: 'error',
            });
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading pizza details.</div>;

    const handleSubmit = () => {
        handleUpdate({ slug, name: pizzaName, selectedIngredients: selectedIngredients.map(i => i._id) });
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold">Edit Pizza</h1>
            <div className="mt-4">
                <input
                    type="text"
                    value={pizzaName}
                    onChange={(e) => setPizzaName(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="Pizza Name"
                />
            </div>
            <div className="mt-4">
                <IngredientsPanel
                    selectedIngredients={selectedIngredients}
                    setSelectedIngredients={setSelectedIngredients}
                />
            </div>
            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default EditPizza;