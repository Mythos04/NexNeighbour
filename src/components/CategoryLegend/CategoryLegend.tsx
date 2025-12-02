"use client";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const defaultCategories: Category[] = [
  { id: "neighbors", name: "Neighbors", icon: "👥", color: "#0F6D70" },
  { id: "services", name: "Services", icon: "🛠️", color: "#1a8a8e" },
  { id: "events", name: "Events", icon: "📅", color: "#0a5355" },
  { id: "places", name: "Places", icon: "📍", color: "#2a9a9e" },
  { id: "community", name: "Community", icon: "🏘️", color: "#0F6D70" },
  { id: "help", name: "Help", icon: "🤝", color: "#1a8a8e" },
];

interface CategoryLegendProps {
  categories?: Category[];
  onCategoryClick?: (categoryId: string) => void;
}

export default function CategoryLegend({ 
  categories = defaultCategories,
  onCategoryClick 
}: CategoryLegendProps) {
  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className="flex flex-col items-center p-4 rounded-xl bg-white/80 backdrop-blur-sm
                       shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105
                       border border-gray-100"
          >
            <span className="text-2xl mb-2">{category.icon}</span>
            <span 
              className="text-sm font-medium"
              style={{ color: category.color }}
            >
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
