import { ChevronRight, Clock, Package, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

const Dashboard = () => {
  const { user, updateProfile } = useAuthStore();
  const { userOrders, fetchUserOrders, isLoading } = useOrderStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: ''
  });

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        telephone: user.telephone || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success('Profil mis à jour avec succès');
      setIsEditOpen(false);
    } else {
      toast.error(result.message || 'Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900">
            Mon <span className="text-primary italic">Espace</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Gérez votre profil et suivez vos commandes en temps réel.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center space-x-4 pr-12">
           <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
           </div>
           <div>
              <div className="text-xl font-black text-slate-900">{user?.name}</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{user?.email}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Orders Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center">
              <Package className="w-6 h-6 mr-3 text-primary" />
              Dernières Commandes
            </h2>
            <Link to="/menu" className="text-primary font-bold text-sm hover:underline">
               Commander plus
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-slate-100 rounded-[32px] animate-pulse" />
              ))}
            </div>
          ) : userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <ShoppingBag className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-black text-slate-900 uppercase">#{order.id.slice(-6)}</div>
                      <div className="flex items-center text-slate-400 text-sm font-bold">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                     <div className="text-right hidden sm:block">
                        <div className="text-lg font-black text-slate-900">{order.total?.toLocaleString()} FCFA</div>
                        <div className="text-xs font-black text-primary uppercase tracking-widest">{order.status}</div>
                     </div>
                     <ChevronRight className="w-6 h-6 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white py-20 rounded-[40px] border-2 border-dashed border-slate-100 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Package className="w-10 h-10" />
               </div>
               <h3 className="text-xl font-black text-slate-900">Aucune commande</h3>
               <p className="text-slate-500 font-medium">Vous n'avez pas encore passé de commande.</p>
               <Link to="/menu">
                  <Button variant="secondary" className="rounded-xl px-8">Explorer le menu</Button>
               </Link>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-8">
           <h2 className="text-2xl font-black text-slate-900 flex items-center">
              <UserIcon className="w-6 h-6 mr-3 text-primary" />
              Profil & Sécurité
            </h2>
            <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
               
               <div className="space-y-6 relative z-10">
                  <div className="space-y-1">
                     <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Nom</div>
                     <div className="text-lg font-bold">{user?.name}</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Email</div>
                     <div className="text-lg font-bold">{user?.email}</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Téléphone</div>
                     <div className="text-lg font-bold">{user?.telephone || 'Non renseigné'}</div>
                  </div>
               </div>

               <Button 
                onClick={() => setIsEditOpen(true)}
                className="w-full h-14 rounded-2xl font-black relative z-10"
               >
                  Modifier mon profil
               </Button>
            </div>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modifier votre profil">
         <form onSubmit={handleUpdateProfile} className="space-y-6">
            <Input
              label="Nom complet"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              placeholder="06 12 34 56 78"
            />
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1">
                Enregistrer
              </Button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
