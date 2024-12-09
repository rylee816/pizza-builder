  
const IngredientList = ({ type, ingredients, onToggleSelect }) => {
    return (
        <div className="p-3 text-white rounded flex flex-col">
            <h2 className="text-lg font-bold mb-2">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <ul className="grid gap-2">
                {ingredients.map((ingredient) => (
                    <li
                        key={ingredient._id}
                        className={`p-2 border rounded cursor-pointer ${
                            ingredient.selected ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                        onClick={() => onToggleSelect(ingredient._id)}
                    >
                        <span>{ingredient.name}</span> - ${ingredient.price} ({ingredient.calories} cal)
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IngredientList