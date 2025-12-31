import { Filter, Search, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from 'react';
import DishCard from '../components/ui/DishCard';
import Input from '../components/ui/Input';
import { useDishStore } from '../store/dishStore';

const Menu = () => {
  const { dishes, categories, fetchDishes, fetchCategories, isLoading } = useDishStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDishes();
    fetchCategories();
  }, [fetchDishes, fetchCategories]);

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(search.toLowerCase()) || 
                         dish.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dish.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900">
            Notre <span className="text-primary italic">Menu</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Explorez notre sélection de plats préparés avec amour.
          </p>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input 
            placeholder="Rechercher un plat..." 
            className="pl-12 h-14 rounded-2xl shadow-sm text-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-black uppercase tracking-wider text-xs">
              <Filter className="w-4 h-4" />
              <span>Catégories</span>
            </div>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`
                  px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all
                  ${selectedCategory === 'all' 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'}
                `}
              >
                Tous les plats
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all
                    ${selectedCategory === cat.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'}
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block space-y-4 pt-8 border-t border-slate-100">
             <div className="flex items-center space-x-2 text-slate-900 font-black uppercase tracking-wider text-xs">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Info Festival</span>
            </div>
            <div className="bg-primary/5 p-6 rounded-3xl space-y-4">
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 Tous les plats sont disponibles pour emporter ou déguster sur place.
               </p>
               <div className="flex items-center text-primary font-bold text-xs uppercase tracking-widest">
                  <UtensilsCrossed className="w-4 h-4 mr-2" />
                  Qualité Garantis
               </div>
            </div>
          </div>
        </div>

        {/* Dish Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[450px] bg-slate-100 rounded-[40px] animate-pulse" />
              ))}
            </div>
          ) : filteredDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 space-y-4 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
               <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                 <Search className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-2xl font-black text-slate-900">Aucun résultat</h3>
               <p className="text-slate-500 font-medium">Essayez d'ajuster votre recherche ou vos filtres.</p>
               <button 
                onClick={() => { setSearch(''); setSelectedCategory('all'); }}
                className="text-primary font-bold hover:underline"
               >
                 Réinitialiser tout
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
