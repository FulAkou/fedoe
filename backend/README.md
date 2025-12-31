# Backend API

Backend REST API pour l'application de gestion de restaurant, construit avec Node.js, Express, Prisma et Zod.

## 🚀 Installation

1. Installer les dépendances :

```bash
npm install
```

2. Configurer les variables d'environnement :

```bash
cp .env.example .env
```

Éditer le fichier `.env` et configurer :

- `DATABASE_URL` : URL de connexion à votre base de données PostgreSQL
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `PORT` : Port du serveur (par défaut 3000)
- `FRONTEND_URL` or `FRONTEND_URLS` : URL du frontend pour CORS. Pour plusieurs origines, utilisez `FRONTEND_URLS` séparées par des virgules (ex. `http://localhost:5173,https://plats-miroir-secret.vercel.app`).
- `STRIPE_SECRET_KEY` : Clé secrète Stripe (commence par `sk_...`)
- `STRIPE_WEBHOOK_SECRET` : (optionnel) Secret du webhook Stripe
- `STRIPE_CURRENCY` : Devise utilisée pour les paiements (par défaut `eur`)

3. Configurer Prisma :

```bash
# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# (Optionnel) Remplir la base de données avec des données de test
npm run prisma:seed
```

4. Démarrer le serveur :

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

## 📁 Structure du projet

```
backend/
├── prisma/
│   ├── schema.prisma      # Schéma de base de données Prisma
│   └── seed.js            # Script de seed pour les données de test
├── src/
│   ├── controllers/       # Contrôleurs (logique métier)
│   ├── middleware/        # Middlewares (auth, validation, errors)
│   ├── routes/            # Routes API
│   ├── validations/       # Schémas de validation Zod
│   └── lib/               # Utilitaires (Prisma, JWT, bcrypt)
├── server.js              # Point d'entrée du serveur
└── package.json
```

## 🔌 API Endpoints

### Authentification

- `POST /api/auth/signup` - Inscription
- `POST /api/auth/signin` - Connexion
- `GET /api/auth/me` - Obtenir l'utilisateur connecté
- `POST /api/auth/reset-password` - Réinitialiser le mot de passe

### Utilisateurs

- `GET /api/users` - Liste des utilisateurs (Admin)
- `GET /api/users/:id` - Détails d'un utilisateur
- `POST /api/users` - Créer un utilisateur (Admin)
- `PUT /api/users/:id` - Modifier un utilisateur (Admin)
- `DELETE /api/users/:id` - Supprimer un utilisateur (Admin)
- `GET /api/users/profile` - Profil de l'utilisateur connecté
- `PUT /api/users/profile` - Modifier son profil
- `GET /api/users/leaderboard` - Classement des utilisateurs

### Plats

- `GET /api/dishes` - Liste des plats (avec filtres)
- `GET /api/dishes/:id` - Détails d'un plat
- `POST /api/dishes` - Créer un plat (Admin/Chef)
- `PUT /api/dishes/:id` - Modifier un plat (Admin/Chef)
- `DELETE /api/dishes/:id` - Supprimer un plat (Admin)

### Avis

- `GET /api/reviews` - Liste des avis (avec filtres)
- `GET /api/reviews/:id` - Détails d'un avis
- `POST /api/reviews` - Créer un avis (Authentifié)
- `PUT /api/reviews/:id` - Modifier un avis
- `DELETE /api/reviews/:id` - Supprimer un avis
- `POST /api/reviews/:reviewId/replies` - Répondre à un avis (Chef/Admin)

### Commandes

- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `GET /api/orders/secret-code/:secretCode` - Commande par code secret
- `POST /api/orders` - Créer une commande (Authentifié)
- `PUT /api/orders/:id` - Modifier le statut d'une commande (Admin/Staff)
- `DELETE /api/orders/:id` - Supprimer une commande (Admin)

### Paiements (Stripe)

- `POST /api/payments/intent` - Créer un PaymentIntent Stripe à partir du panier (authentifié)

### Badges

- `GET /api/badges` - Liste des badges
- `GET /api/badges/:id` - Détails d'un badge
- `GET /api/badges/user/:userId` - Badges d'un utilisateur

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

Pour accéder aux routes protégées, inclure le token dans les headers :

```
Authorization: Bearer <token>
```

## 📝 Rôles

- `USER` : Utilisateur standard
- `CHEF` : Chef cuisinier
- `STAFF` : Personnel
- `ADMIN` : Administrateur
- `SUPER_ADMIN` : Super administrateur

## 🗄️ Base de données

Le schéma Prisma définit les modèles suivants :

- User (utilisateurs)
- Badge (badges)
- UserBadge (relation utilisateur-badge)
- Dish (plats)
- Review (avis)
- ReviewReply (réponses aux avis)
- Order (commandes)
- OrderItem (articles de commande)

## 🛠️ Scripts disponibles

- `npm run dev` : Démarrer en mode développement
- `npm start` : Démarrer en mode production
- `npm run prisma:generate` : Générer le client Prisma
- `npm run prisma:migrate` : Exécuter les migrations
- `npm run prisma:studio` : Ouvrir Prisma Studio
- `npm run prisma:seed` : Remplir la base de données

## 📦 Technologies utilisées

- **Express** : Framework web Node.js
- **Prisma** : ORM pour la base de données
- **Zod** : Validation de schémas
- **JWT** : Authentification par tokens
- **bcryptjs** : Hachage de mots de passe
- **CORS** : Gestion des CORS
- **Stripe** : Paiements en ligne

## 🔧 Configuration

Assurez-vous que votre base de données PostgreSQL est configurée et accessible avant de démarrer le serveur.

Pour le développement, vous pouvez utiliser une base de données locale ou une instance Docker :

```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=restaurant_db -p 5432:5432 -d postgres
```
