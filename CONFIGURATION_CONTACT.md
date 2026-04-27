# 📋 Configuration du Formulaire de Contact

## 1. Configuration de l'Email (Web3Forms)

### Étapes :
1. Rends-toi sur **https://web3forms.com** (gratuit, pas d'inscription obligatoire)
2. Copie ta **Access Key** (elle sera fournie lors de la première soumission)
3. Ouvre `src/Portfolio.jsx`
4. Cherche la ligne avec `"access_key": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"`
5. Remplace la clé par ta clé Web3Forms

### Code à modifier (ligne ~650) :
```jsx
formData.append("access_key", "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"); // ← TA CLÉ ICI
```

### Alternative : Utiliser Formspree
Si tu préfères Formspree :
1. Rends-toi sur **https://formspree.io**
2. Crée un formulaire avec ton email
3. Remplace l'endpoint dans `handleSubmit()`

---

## 2. Configuration de WhatsApp

### Étapes :
1. Ouvre `src/Portfolio.jsx`
2. Cherche la ligne avec `const whatsappNumber = "33XXXXXXXXX";`
3. Remplace par ton numéro WhatsApp (format international)

### Format du numéro :
- **France** : `33612345678` (sans le +)
- **Belgique** : `32612345678`
- **Suisse** : `41612345678`
- **Canada** : `14165551234`

### Exemple :
```jsx
const whatsappNumber = "33612345678"; // Ton numéro
```

---

## 3. Tester le formulaire

1. Lance le serveur : `npm run dev`
2. Rends-toi sur **http://localhost:5173**
3. Scroll vers la section **Contact**
4. Clique sur **"Envoyer un message"**
5. Remplis les champs et envoie

### Tester Email :
- Le message arrivera à **alex.dupont@email.com** (remplace aussi cet email dans le code)

### Tester WhatsApp :
- Un lien WhatsApp s'ouvrira avec ton message pré-rempli

---

## 4. Modifier l'email de destination

Cherche dans `src/Portfolio.jsx` la constante `PERSONAL_INFO` et remplace :

```jsx
email: "alex.dupont@email.com",  // ← TON EMAIL ICI
```

---

## ✨ Animations & Styles

Le formulaire inclut :
- ✨ **Animations fluides** (fade-in, slide-up)
- 🎨 **Validation visuelle** (glow au focus)
- 💬 **Deux canaux** (Email + WhatsApp)
- 📱 **Design responsive**
- ✅ **Message de confirmation**

---

## 🚀 Déploiement

Avant de déployer :
1. ✅ Remplace la clé Web3Forms
2. ✅ Remplace le numéro WhatsApp
3. ✅ Remplace l'email de destination
4. ✅ Teste le formulaire locally
5. ✅ Déploie sur Vercel, Netlify, etc.

---

**Besoin d'aide ?** Consulte la documentation :
- [Web3Forms Docs](https://web3forms.com/docs)
- [WhatsApp API](https://www.whatsapp.com/business/api)
