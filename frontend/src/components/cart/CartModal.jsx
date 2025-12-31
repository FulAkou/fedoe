import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';

const CartModal = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart, isCartOpen, closeCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex pl-10 pointer-events-none">
        <div className="w-full bg-white h-full shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="text-primary" />
              Panier
            </h2>
            <button 
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-900">Votre panier est vide</p>
                    <p className="text-slate-500">Ajoutez quelques plats délicieux !</p>
                 </div>
                 <Button onClick={closeCart} variant="outline" className="rounded-xl">
                    Continuer mes achats
                 </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <img 
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900 truncate pr-2">{item.name}</h4>
                            <p className="text-xs text-slate-500 font-medium uppercase">{item.category?.name}</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                       
                       <div className="flex justify-between items-end">
                          <div className="font-black text-primary">{item.price?.toLocaleString()} FCFA</div>
                          <div className="flex items-center bg-slate-50 rounded-lg p-1">
                             <button 
                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
                               className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-slate-500"
                             >
                               <Minus size={12} />
                             </button>
                             <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                             <button 
                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
                               className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-slate-500"
                             >
                               <Plus size={12} />
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Sous-total</span>
                    <span className="font-bold text-slate-900">{subtotal?.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Taxe (5%)</span>
                    <span className="font-bold text-slate-900">{tax?.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-black text-primary">{total?.toLocaleString()} FCFA</span>
                  </div>
               </div>
               
               <Button 
                onClick={handleCheckout}
                className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
               >
                 Commander
                 <ArrowRight className="ml-2 w-5 h-5" />
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
