# 🔗 API Backend

L'application frontend communique avec l'API backend pour récupérer et modifier les tâches. Assurez-vous que le backend fonctionne avant de lancer le frontend.

# 2️⃣ Install dependencies
```bash
npm install
```

# 3️⃣ Launch the app
```bash
npm run dev
```

L'API sera accessible sur http://localhost:3000.

# 🚀 API Endpoints 

| Méthode    |Endpoint | Description |
| -------- | ------- | ------- |
| GET  | /tasks    | Récupérer toutes les tâches |
| POST | /tasks     | Ajouter une nouvelle tâche |
| PUT    | /tasks/:id   | Modifier une tâche existante |
| DELETE   | /tasks/:id    | Supprimer une tâche |

# 🛠 Technologies utilisées

<li>Node.js + Express (serveur web)</li>
<li>Supabase (base de données et RPC)</li>
<li>Zod (validation des données)</li>
<li>CORS (pour les requêtes cross-origin)</li>