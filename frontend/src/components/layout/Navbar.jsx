import { LogOut, Menu, ShoppingCart, User, X } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount, toggleCart } = useCartStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const cartCount = getItemCount();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent italic">
              FOODFEST
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/menu" className="text-slate-600 hover:text-primary font-medium transition-colors">Menu</Link>
            <Link to="/about" className="text-slate-600 hover:text-primary font-medium transition-colors">À propos</Link>
            
            
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
              <button 
                onClick={toggleCart} 
                className="relative p-2 text-slate-600 hover:text-primary transition-colors focus:outline-none"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <User className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
                  </Link>
                  <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                  Connexion
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
             <button onClick={toggleCart} className="relative p-2 text-slate-600">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/menu" className="block px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50">Menu</Link>
            <Link to="/about" className="block px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50">À propos</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50">Mon Profil</Link>
                <button onClick={logout} className="w-full text-left px-4 py-3 text-red-500 font-medium rounded-xl hover:bg-red-50">Déconnexion</button>
              </>
            ) : (
              <Link to="/auth" className="block px-4 py-3 bg-primary text-white text-center font-bold rounded-xl transition-all">Connexion</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
