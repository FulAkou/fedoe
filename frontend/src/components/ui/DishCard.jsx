import { Clock, Plus, Star } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';

import { Link } from 'react-router-dom';

const DishCard = ({ dish }) => {
  const { addItem } = useCartStore();

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
      {/* Image Container */}
      <Link to={`/dish/${dish.id}`} className="block relative h-64 overflow-hidden cursor-pointer">
        <img 
          src={dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop'} 
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-slate-700">{dish.rating || '4.5'}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Link to={`/dish/${dish.id}`} className="block">
              <h3 className="text-[18px] font-black text-slate-900 group-hover:text-primary transition-colors">
                {dish.name}
              </h3>   
            </Link>
            <span className="text-[15px] font-black text-primary">
              {dish.price?.toLocaleString()}FCFA
            </span>
            
          </div>
          <p className="text-slate-500 text-sm line-clamp-2 font-medium">
            {dish.description || 'Une délicieuse expérience culinaire préparée avec des ingrédients frais.'}
          </p>
        </div>

        <div className="flex items-center space-x-4 text-slate-400 text-sm font-bold">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>20-30 min</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          <span>{dish.category?.name || 'Général'}</span>
        </div>

        <Button 
          onClick={() => addItem(dish)}
          className="w-full rounded-2xl h-12 shadow-lg hover:shadow-primary/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

export default DishCard;
