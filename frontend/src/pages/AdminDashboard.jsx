import {
  Clock,
  LayoutDashboard,
  MessageSquare,
  ShoppingBag,
  Users as UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AdminDishes from "./admin/AdminDishes";
import AdminOrders from "./admin/AdminOrders";
import AdminReviews from "./admin/AdminReviews";
import AdminUsers from "./admin/AdminUsers";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ShoppingBag className="w-6 h-6 stroke-current" />
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">45</div>
              <div className="text-sm font-medium text-slate-500">
                Commandes actives
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <UsersIcon className="w-6 h-6 stroke-current" />
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Clients
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">128</div>
              <div className="text-sm font-medium text-slate-500">
                Inscrits ce mois
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                  <Clock className="w-6 h-6 stroke-current" />
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Revenus
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                12.5k FCFA
              </div>
              <div className="text-sm font-medium text-slate-500">
                +15% vs mois dernier
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <MessageSquare className="w-6 h-6 stroke-current" />
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Avis
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">4.8</div>
              <div className="text-sm font-medium text-slate-500">
                Note moyenne
              </div>
            </div>
          </div>
        );
      case "users":
        return <AdminUsers />;
      case "orders":
        return <AdminOrders />;
      case "dishes":
        return <AdminDishes />;
      case "reviews":
        return <AdminReviews />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900">
            Admin <span className="text-primary italic">Panel</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Gestion globale du festival culinaire.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="bg-white p-4 rounded-[32px] shadow-sm border border-slate-100 space-y-2">
            {[
              {
                id: "dashboard",
                label: "Tableau de bord",
                icon: LayoutDashboard,
              },
              { id: "users", label: "Utilisateurs", icon: UsersIcon },
              { id: "orders", label: "Commandes", icon: Clock },
              { id: "dishes", label: "Plats", icon: ShoppingBag },
              { id: "reviews", label: "Avis", icon: MessageSquare },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-5 h-5 stroke-current" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
