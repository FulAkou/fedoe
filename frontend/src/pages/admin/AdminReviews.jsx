import { Check, MessageSquare, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { useReviewStore } from "../../store/reviewStore";

const AdminReviews = () => {
  const {
    reviews,
    isLoading,
    fetchAllReviews,
    updateReviewStatus,
    deleteReview,
  } = useReviewStore();

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const handleStatusChange = async (id, status) => {
    const result = await updateReviewStatus(id, { status });
    if (result.success) toast.success(`Avis ${status.toLowerCase()}`);
    else toast.error("Erreur lors de la mise à jour");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet avis ?")) {
      const result = await deleteReview(id);
      if (result.success) toast.success("Avis supprimé");
      else toast.error("Erreur lors de la suppression");
    }
  };

  if (isLoading && reviews.length === 0) return <Loader size="large" />;

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Gestion des Avis
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">
            Aucun avis à modérer
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border dark:border-slate-700 p-4 rounded-lg flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {review.user?.name}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    sur {review.dish?.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Check
                      key={i}
                      className={`w-3.5 h-3.5 stroke-current ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                  "{review.comment}"
                </p>
                <div className="mt-2 flex gap-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      review.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : review.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {review.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(review.id, "APPROVED")}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Approuver"
                    >
                      <Check className="w-5 h-5 stroke-current" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(review.id, "REJECTED")}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                      title="Rejeter"
                    >
                      <X className="w-5 h-5 stroke-current" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5 stroke-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
