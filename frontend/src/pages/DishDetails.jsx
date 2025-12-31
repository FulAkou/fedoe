import { Heart, MessageSquare, ShoppingCart, Star, User } from "lucide-react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/ui/Loader";
import StarRating from "../components/ui/StarRating";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useDishStore } from "../store/dishStore";
import { useReviewStore } from "../store/reviewStore";

const DishDetails = () => {
  const { id } = useParams();
  const {
    selectedDish,
    isLoading: dishLoading,
    fetchDishById,
  } = useDishStore();
  const {
    reviews,
    isLoading: reviewsLoading,
    fetchReviewsByDish,
    addReview,
  } = useReviewStore();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");

  useEffect(() => {
    if (id) {
      fetchDishById(id);
      fetchReviewsByDish(id);
    }
  }, [id, fetchDishById, fetchReviewsByDish]);

  const handleAddToCart = () => {
    if (selectedDish) {
      addItem(selectedDish);
      toast.success(`Added ${selectedDish.name} to cart`);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");

    const result = await addReview(id, { rating, comment });
    if (result.success) {
      toast.success("Review submitted successfully");
      setComment("");
      setRating(5);
    } else {
      toast.error(result.message);
    }
  };

  if (dishLoading || !selectedDish)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="large" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Section */}
        <div className="relative h-[400px] lg:h-[600px] rounded-[40px] overflow-hidden shadow-2xl">
          <img
            src={
              selectedDish.imageUrl ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
            }
            alt={selectedDish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-lg font-black text-slate-900">4.5</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              {selectedDish.name}
            </h1>
            <div className="flex items-center gap-4 text-lg font-medium text-slate-500">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                {selectedDish.category?.name || "Général"}
              </span>
              <span>
                par{" "}
                <span className="text-slate-900 font-bold">
                  {selectedDish.user?.name || "Notre Chef"}
                </span>
              </span>
            </div>
          </div>

          <div className="text-5xl font-black text-primary">
            {selectedDish.price?.toLocaleString()} FCFA
          </div>

          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            {selectedDish.description ||
              "Une expérience gustative unique préparée avec les meilleurs ingrédients de saison pour éveiller vos papilles."}
          </p>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-lg font-black py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-slate-900/20"
            >
              <ShoppingCart className="w-6 h-6 stroke-current" />
              Ajouter au Panier
            </button>
            <button className="p-5 border-2 border-slate-100 rounded-2xl hover:bg-red-50 hover:border-red-100 hover:text-red-500 text-slate-400 transition-all">
              <Heart className="w-7 h-7 stroke-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-slate-900">
            Avis Clients ({reviews.length})
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-black text-slate-900">4.5</span>
            <div className="flex flex-col">
              <StarRating rating={4.5} readonly size={16} />
              <span className="text-sm font-medium text-slate-400">
                Note moyenne
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-8 rounded-[32px] sticky top-24">
              {user ? (
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Laissez votre avis
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Votre expérience compte pour nous.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Note
                    </label>
                    <div className="bg-white p-4 rounded-2xl flex justify-center shadow-sm">
                      <StarRating
                        rating={rating}
                        onRate={setRating}
                        size={32}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Commentaire
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-4 rounded-2xl border-none shadow-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 min-h-[120px] resize-none font-medium"
                      placeholder="Qu'avez-vous pensé de ce plat ?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                  >
                    Publier l'avis
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-6 py-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <User className="w-8 h-8 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Connectez-vous
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Pour partager votre expérience et donner votre avis sur ce
                      plat.
                    </p>
                  </div>
                  <Link to="/auth">
                    <button className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl border-2 border-slate-100 hover:border-slate-900 transition-all">
                      Se connecter
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-8">
            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-slate-50 rounded-3xl animate-pulse"
                  />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20">
                        {review.user?.name?.charAt(0) || "A"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-lg">
                          {review.user?.name || "Anonyme"}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {new Date(review.createdAt).toLocaleDateString(
                            "fr-FR",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      <StarRating rating={review.rating} readonly size={16} />
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-[64px] font-medium">
                    "{review.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Aucun avis pour le moment
                </h3>
                <p className="text-slate-500">
                  Soyez le premier à donner votre avis !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetails;
