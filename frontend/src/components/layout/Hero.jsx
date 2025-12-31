import { ArrowRight, Star, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-32">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-1" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-3xl -z-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-bold text-sm animate-bounce">
              <Star className="w-4 h-4 fill-primary" />
              <span>Le meilleur festival culinaire de l'année</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-tight">
              Savourez chaque{" "}
              <span className="text-primary italic">instant</span> de délice
            </h1>

            <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto lg:mx-0">
              Découvrez une sélection unique de plats artisanaux préparés par
              nos chefs étoilés spécialement pour le FoodFest.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/menu">
                <Button
                  size="lg"
                  className="h-16 px-10 rounded-2xl shadow-2xl shadow-primary/20 group"
                >
                  Explorer le Menu
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-16 px-10 rounded-2xl"
                >
                  En savoir plus
                </Button>
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-slate-900">50+</div>
                <div className="text-sm font-bold text-slate-400">Plats</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-slate-900">12k+</div>
                <div className="text-sm font-bold text-slate-400">Visiteurs</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-slate-900">15+</div>
                <div className="text-sm font-bold text-slate-400">Chefs</div>
              </div>
            </div> */}
          </div>

          {/* Hero Image */}
          <div className="mt-16 lg:mt-0 relative">
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl rotate-2">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop"
                alt="Delicious Food"
                className="w-full object-cover aspect-square sm:aspect-video lg:aspect-square"
              />
            </div>

            {/* Floating UI Elements */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-3xl shadow-xl flex items-center space-x-4 animate-in fade-in slide-in-from-left duration-1000">
              <div className="bg-green-100 p-2 rounded-2xl">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">
                  Ingrédients Frais
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Qualité Premium
                </div>
              </div>
            </div>

            {/* <div className="absolute top-10 -right-6 bg-white p-4 rounded-3xl shadow-xl flex items-center space-x-4 animate-in fade-in slide-in-from-right duration-1000">
              <div className="bg-blue-100 p-2 rounded-2xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">
                  12k+ Heureux
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Cette semaine
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
