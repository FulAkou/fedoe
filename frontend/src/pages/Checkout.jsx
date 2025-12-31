import { CheckCircle, CreditCard, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';

const Checkout = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const total = getTotal();
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Veuillez vous connecter pour commander');
      navigate('/auth');
      return;
    }

    const orderData = {
      items: items.map(item => ({ dishId: item.id, quantity: item.quantity })),
      total: total,
      paymentMethod: paymentMethod, // 'CARD' or 'CASH'
      seats: 1 // Default for now
    };

    const result = await createOrder(orderData);
    if (result.success) {
      clearCart();
      toast.success('Commande validée avec succès !');
      navigate('/profile');
    } else {
      toast.error(result.message || 'Échec de la commande');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <Button onClick={() => navigate('/menu')}>Retour au menu</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-8 text-slate-900">Validation de commande</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Order Summary */}
        <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 h-fit">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Résumé
          </h2>
          <div className="space-y-4 max-h-96 overflow-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                   <div className="font-bold text-slate-900">{item.name}</div>
                   <div className="text-sm text-slate-500 font-bold">Qté: {item.quantity}</div>
                </div>
                <div className="font-mono font-black text-slate-900">{(item.price * item.quantity).toLocaleString()} FCFA</div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 mt-6 pt-6 flex justify-between items-center text-2xl font-black">
            <span>Total</span>
            <span className="text-primary">{total.toLocaleString()} FCFA</span>
          </div>
        </div>

        {/* Payment Selection */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
           <h2 className="text-xl font-black mb-6 flex items-center gap-2">
             <CreditCard className="w-5 h-5" />
             Moyen de paiement
           </h2>
           
           <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="space-y-3">
                <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="CARD" 
                      checked={paymentMethod === 'CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary"
                    />
                    <span className="font-bold text-slate-900">Carte Bancaire</span>
                  </div>
                </label>

                <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'CASH' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="CASH" 
                      checked={paymentMethod === 'CASH'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary"
                    />
                    <span className="font-bold text-slate-900">Espèces (au comptoir)</span>
                  </div>
                </label>
              </div>

              <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl text-sm font-medium flex gap-3 items-start leading-relaxed">
                 <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p>En validant votre commande, la cuisine commencera la préparation immédiatement. Le paiement sera finalisé selon votre choix.</p>
              </div>

              <Button 
                type="submit" 
                isLoading={isLoading}
                className="w-full py-4 text-lg rounded-2xl"
              >
                Confirmer la commande ({total.toLocaleString()} FCFA)
              </Button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
