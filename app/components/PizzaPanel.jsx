'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast';

const PizzaPanel = ({ selectedIngredients, handleClear }) => {
    const [pizzaName, setPizzaName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { toast }= useToast()

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "error",
            });
        }
    }, [error]);

    const validatePizza = () => {
        const hasDough = selectedIngredients.some((ingredient) => ingredient.type === 'dough');
        const hasSauce = selectedIngredients.some((ingredient) => ingredient.type === 'sauce');
        const hasCheese = selectedIngredients.some((ingredient) => ingredient.type === 'dairy');

        if (!hasDough) {
            return 'Please select at least one dough.';
        }
        if (!hasSauce) {
            return 'Please select at least one sauce.';
        }
        if (!hasCheese) {
            return 'Please select at least one cheese.';
        }

        return setError(null)
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const error = validatePizza();
        if (error) {
            setError(error);
            setIsSubmitting(false)
            return;
        }

        try {
            const response = await axios.post('/api/pizza', {
                selectedIngredients: selectedIngredients.map((ingredient) => ingredient._id),
                name: pizzaName || 'Custom Pizza',
            });

            toast({
                title: "Pizza Created!",
                description: "Your custom pizza has been successfully saved.",
                variant: "success",
            });
            handleClear()
            setPizzaName('')
        } catch (err) {
            setError('Failed to create pizza');
            console.error(err);
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
            }, 1000);
        }
    };

    const calcTotalsWithTax = tax => {
        const {totalPrice, totalCalories, price} = selectedIngredients?.reduce((acc, curr) => {
            acc['price'] += curr.price
            acc['totalCalories'] += curr.calories
            acc['totalPrice'] = acc['price'] + (acc['price'] * tax)
            return acc
        }, {price: 0, totalPrice: 0, totalCalories: 0})
        return {price, totalCalories, totalPrice}
    }

    const totals = calcTotalsWithTax(.06)

    return (
        <div className="flex flex-col p-6 bg-gray-800 text-white rounded min-h-96 h-full">
            <h2 className="text-xl font-bold mb-4">Pizza Creation</h2>
      

            <div className="flex w-full py-2 max-w-sm items-center space-x-2">
                <Input 
                  type="text"
                  placeholder="Enter Pizza Name"
                  value={pizzaName}
                  onChange={(e) => setPizzaName(e.target.value)}
                />
                <Button onClick={() => setPizzaName('')}>Clear</Button>
            </div>


            <div className="mb-4">
                <div className="flex flex-col py-4 gap-3 w-1/2">
                    <h3 className="font-bold">Selected Ingredients:</h3>
                    <Separator />
                </div>
         
                <ul>
                    {selectedIngredients.map((ingredient) => (
                        <li key={ingredient._id} className="mb-2">
                            {ingredient.name} - ${ingredient.price.toFixed(2)} ({ingredient.calories} cal)
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex gap-4 w-full mt-auto">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedIngredients.length === 0}
                    className="bg-orange-500 p-2 rounded text-white disabled:bg-gray-500"
                >
                    {isSubmitting ? 'Submitting...' : 'Save Pizza'}
                </button>

                <button
                    onClick={() => {
                        handleClear()
                        setError(undefined)
                    }}
                    disabled={isSubmitting || selectedIngredients.length === 0}
                    className="bg-red-500 p-2 rounded text-white disabled:bg-gray-500"
                >
                    {'Reset'}
                </button>
            <p className="flex mt-auto ml-auto">Price: {totals.price.toFixed(2)} Calories: {totals.totalCalories} Total Price with Tax: {(totals.totalPrice).toFixed(2)}</p>

            </div>

            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
};

export default PizzaPanel;