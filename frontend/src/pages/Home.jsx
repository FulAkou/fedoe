import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/layout/Hero';
import DishCard from '../components/ui/DishCard';
import { useDishStore } from '../store/dishStore';

const Home = () => {
  const { dishes, fetchDishes, isLoading } = useDishStore();

  useEffect(() => {
    fetchDishes({ limit: 4 });
  }, [fetchDishes]);

  return (
    <div>
      <Hero />
      
      {/* Featured Dishes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-4 md:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary font-black uppercase tracking-wider text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Nos Incontournables</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Plats les plus <span className="text-primary italic">populaires</span>
            </h2>
          </div>
          
          <Link to="/menu" className="group flex items-center bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-2xl font-black text-slate-600 transition-all">
            Voir tout le menu
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[450px] bg-slate-100 rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dishes.slice(0, 4).map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-slate-900 py-24 overflow-hidden relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Rejoignez la <span className="text-primary italic">communauté</span> des gourmets
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Plus de 12 000 passionnés de cuisine nous font confiance chaque année pour découvrir des saveurs uniques et inoubliables.
              </p>
              <div className="flex justify-center space-x-12">
                 <div className="text-center">
                    <div className="text-4xl font-black text-white">4.9/5</div>
                    <div className="text-sm font-bold text-slate-500 uppercase mt-2">Note Clients</div>
                 </div>
                 <div className="text-center">
                    <div className="text-4xl font-black text-white">100%</div>
                    <div className="text-sm font-bold text-slate-500 uppercase mt-2">Fait Maison</div>
                 </div>
              </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
