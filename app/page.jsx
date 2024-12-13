'use client';
import { useState } from 'react';
import IngredientsPanel from './components/IngredientsPanel';
import PizzaPanel from './components/PizzaPanel';
import PizzaCarousel from './components/PizzaCarousel';

export default function Home() {
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const handleSelectIngredient = (ingredient) => {
        setSelectedIngredients((prev) => {
            if (prev.some((item) => item._id === ingredient._id)) {
                return prev.filter((item) => item._id !== ingredient._id);
            } else {
                return [...prev, ingredient];
            }
        });
    };

    const handleClear = () => {
      setSelectedIngredients([])
    }

    return (
        <div className="grid grid-rows-[150px_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <PizzaCarousel />
            <div className="grid gap-4 grid-cols-6 p-4 w-full h-full">
                <div className="col-span-2 justify-content-start">
                    <IngredientsPanel selectedIngredients={selectedIngredients} onSelectIngredient={handleSelectIngredient} setSelectedIngredients={setSelectedIngredients} defaultList={false} />
                </div>
                <div className="col-span-4">
                    <PizzaPanel selectedIngredients={selectedIngredients} handleClear={handleClear}/>
                </div>
            </div>
        </div>
    );
}