import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import { useDishStore } from "../../store/dishStore";

const AdminDishes = () => {
  const {
    dishes,
    isLoading,
    error,
    fetchDishes,
    deleteDish,
    createDish,
    updateDish,
  } = useDishStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const handleOpenModal = (dish = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        name: dish.name,
        description: dish.description,
        price: dish.price.toString(),
        imageUrl: dish.imageUrl,
      });
    } else {
      setEditingDish(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Convert price to number
    const dishData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    let result;
    if (editingDish) {
      result = await updateDish(editingDish.id, dishData);
    } else {
      result = await createDish(dishData);
    }

    if (result.success) {
      toast.success(editingDish ? "Plat mis à jour" : "Plat créé");
      setIsModalOpen(false);
    } else {
      toast.error(result.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce plat ?")) {
      const result = await deleteDish(id);
      if (result.success) {
        toast.success("Plat supprimé avec succès");
      } else {
        toast.error(result.message || "Erreur lors de la suppression");
      }
    }
  };

  if (isLoading && dishes.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="large" />
      </div>
    );

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-gray-100 uppercase tracking-tight">
            Gestion du Menu
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Ajoutez, modifiez ou supprimez les plats du festival.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-current" />
          Ajouter un Plat
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex flex-col gap-4 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden rounded-xl">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-primary font-black shadow-sm">
                {dish.price?.toLocaleString()} FCFA
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-black text-slate-900 dark:text-gray-100 text-lg">
                {dish.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                {dish.description}
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-700">
              <button
                onClick={() => handleOpenModal(dish)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors font-bold text-sm"
              >
                <Pencil className="w-4 h-4 stroke-current" /> Modifier
              </button>
              <button
                onClick={() => handleDelete(dish.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors font-bold text-sm"
              >
                <Trash2 className="w-4 h-4 stroke-current" /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDish ? "Modifier le Plat" : "Nouveau Plat"}
      >
        <form onSubmit={handleSave} className="space-y-6 py-2">
          <Input
            label="Nom du plat"
            placeholder="Ex: Burger Signature"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-slate-100 font-medium"
              rows="4"
              placeholder="Décrivez les ingrédients et les saveurs..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix (FCFA)"
              type="number"
              placeholder="10000"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
            <Input
              label="Image URL"
              placeholder="https://images.unsplash..."
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              required
            />
          </div>
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-xl h-12"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl h-12 font-black"
              isLoading={isLoading}
            >
              {editingDish ? "Mettre à jour" : "Créer le plat"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDishes;
