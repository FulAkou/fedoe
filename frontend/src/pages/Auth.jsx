import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail, PhoneCall, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { loginSchema, registerSchema } from "../validations/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      name: "",
      email: "",
      telephone: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    let result;
    if (isLogin) {
      result = await login(data.email, data.password);
    } else {
      result = await register(data);
    }

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Toggle Header */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-6 font-bold transition-all ${
              isLogin
                ? "text-primary border-b-2 border-primary"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-6 font-bold transition-all ${
              !isLogin
                ? "text-primary border-b-2 border-primary"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Inscription
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900">
              {isLogin ? "Bon retour !" : "Rejoignez-nous"}
            </h2>
            <p className="text-slate-500 font-medium px-4">
              {isLogin
                ? "Connectez-vous pour accéder à vos commandes et favoris."
                : "Créez un compte pour profiter du meilleur de FoodFest."}
            </p>
          </div>

          {authError && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-10 text-slate-900 w-5 h-5" />
                  <Input
                    label="Nom complet"
                    placeholder="Aminata Touré"
                    className="pl-12 text-slate-900"
                    error={errors.name?.message}
                    {...registerField("name")}
                  />
                </div>
                <div className="relative">
                  <PhoneCall className="absolute left-4 top-10 text-slate-400 w-5 h-5" />
                  <Input
                    label="Téléphone"
                    placeholder="06 12 34 56 78"
                    className="pl-12 text-slate-900"
                    maxLength={10}
                    error={errors.telephone?.message}
                    {...registerField("telephone")}
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-10 text-slate-400 w-5 h-5" />
              <Input
                label="Email"
                type="email"
                placeholder="jean@exemple.com"
                className="pl-12 text-slate-900"
                error={errors.email?.message}
                {...registerField("email")}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-10 text-slate-400 w-5 h-5" />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                className="pl-12 text-slate-900"
                error={errors.password?.message}
                {...registerField("password")}
              />
            </div>

            {/* Password confirmation removed */}

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-4 h-14 text-lg"
            >
              {isLogin ? "Se connecter" : "S'inscrire"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
