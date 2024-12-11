'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import IngredientList from './IngredientsList';
import { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

const fetchIngredients = async () => {
    const { data } = await axios.get('/api/ingredients');
    return data;
};

const groupByType = (ingredients, selectedIngredients) => {
    return ingredients?.reduce((groups, ingredient) => {
        const { type } = ingredient;
        if (!groups[type]) groups[type] = [];

        const isSelected = selectedIngredients.some(
            (selected) => selected._id === ingredient._id
        );
        
        groups[type].push({ ...ingredient, selected: isSelected });
        return groups;
    }, {});
};

const IngredientsPanel = ({ selectedIngredients, setSelectedIngredients }) => {
    const { data: ingredients, isLoading, error } = useQuery({
        queryKey: ['ingredients'],
        queryFn: fetchIngredients,
    });

    const [groupedIngredients, setGroupedIngredients] = useState({});

    useEffect(() => {
        if (ingredients) {

            if (!selectedIngredients.length) {
                const defaultDough = ingredients.find((ingredient) => ingredient.type === 'dough');
                const defaultSauce = ingredients.find((ingredient) => ingredient.type === 'sauce');
                const defaultCheese = ingredients.find((ingredient) => ingredient.type === 'dairy');
                
                const defaults = [defaultDough, defaultSauce, defaultCheese].filter(Boolean);
                setSelectedIngredients(defaults);
            }

            setGroupedIngredients(groupByType(ingredients, selectedIngredients))
        }
    }, [ingredients, selectedIngredients, setSelectedIngredients])

    const handleToggleSelect = (id) => {
        const ingredient = ingredients.find((ingredient) => ingredient._id === id);
    
        if (ingredient.type === 'dough') {
            setSelectedIngredients((prevSelected) => [
                ...prevSelected.filter((item) => item.type !== 'dough'),
                ingredient,
            ]);
        } else {
            if (selectedIngredients.some((item) => item._id === id)) {
                setSelectedIngredients(
                    selectedIngredients.filter((item) => item._id !== id)
                );
            } else {
                setSelectedIngredients([...selectedIngredients, ingredient]);
            }
        }
    };

    // TODO: add loading skeleton and better error display
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching ingredients</div>;

    return (
        // <div className="grid gap-6">
        //     {Object.entries(groupedIngredients).map(([type, ingredients]) => (
        //         <IngredientList
        //             key={type}
        //             type={type}
        //             ingredients={ingredients}
        //             onToggleSelect={handleToggleSelect}
        //             selectedIngredients={selectedIngredients}
        //         />
        //     ))}
        // </div>
        <div className="flex flex-col gap-6 h-full">
            <h1>Select Ingredients</h1>
            <Accordion type="single" collapsible>
            {Object.entries(groupedIngredients).map(([type, ingredients]) => (
                <AccordionItem key={type} value={type}>
                    <AccordionTrigger>{type.charAt(0).toUpperCase() + type.slice(1)}</AccordionTrigger>
                    <AccordionContent>
                        <IngredientList
                            type={type}
                            ingredients={ingredients}
                            onToggleSelect={handleToggleSelect}
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </div>

    );
};

export default IngredientsPanel;