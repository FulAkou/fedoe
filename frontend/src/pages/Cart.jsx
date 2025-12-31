import { ArrowRight, CreditCard, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/cart' } } });
      return;
    }
    // Proceed to checkout or final order
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
         <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative bg-white w-32 h-32 rounded-[40px] shadow-xl flex items-center justify-center mx-auto border border-slate-100">
              <ShoppingBag className="w-16 h-16 text-primary" />
            </div>
         </div>
         <div className="space-y-4">
           <h1 className="text-4xl font-black text-slate-900">Votre panier est vide</h1>
           <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
             Il semble que vous n'ayez pas encore ajouté de délicieux plats à votre commande.
           </p>
         </div>
         <Link to="/menu">
            <Button size="lg" className="rounded-2xl px-10 h-16 font-black shadow-2xl shadow-primary/20">
               Découvrir le Menu
               <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-black text-slate-900 mb-12">
        Mon <span className="text-primary italic">Panier</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-6 group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className="text-xl font-black text-slate-900">{item.name}</h3>
                <p className="text-slate-400 font-bold text-sm uppercase">{item.category?.name || 'Délicieux'}</p>
                <div className="text-2xl font-black text-primary transition-all">
                  {item.price?.toLocaleString()} FCFA
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-white rounded-xl transition-all text-slate-500 shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-white rounded-xl transition-all text-slate-500 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            className="text-slate-400 font-bold hover:text-red-500 transition-colors flex items-center pl-4"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Vider le panier
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
          
          <h2 className="text-2xl font-black mb-8 flex items-center relative z-10">
            Récapitulatif
            <div className="ml-3 h-1 flex-1 bg-white/10" />
          </h2>

          <div className="space-y-6 mb-12 relative z-10">
             <div className="flex justify-between font-bold text-slate-400">
                <span>Sous-total</span>
                <span className="text-white">{subtotal.toLocaleString()} FCFA</span>
             </div>
             <div className="flex justify-between font-bold text-slate-400">
                <span>Taxe (5%)</span>
                <span className="font-medium text-white/50 mr-2">(Taxe incluse)</span>
                <span className="text-white">{tax.toLocaleString()} FCFA</span>
             </div>
             <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <span className="text-lg font-bold text-slate-400">Total</span>
                <span className="text-4xl font-black text-primary">{total.toLocaleString()} FCFA</span>
             </div>
          </div>

          <div className="space-y-4 relative z-10">
            <Button 
              onClick={handleCheckout}
              className="w-full h-16 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20"
            >
              Commander maintenant
              <CreditCard className="ml-3 w-6 h-6" />
            </Button>
            <Link to="/menu" className="block text-center text-slate-400 hover:text-white font-bold transition-all py-2">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
