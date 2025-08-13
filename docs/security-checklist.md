# 🛡️ Checklist Sécurité – Avant Déploiement

## 🔐 Authentification & Sessions
- [ ] Utiliser **cookies HttpOnly + Secure** (pas de stockage du token en `localStorage`)
- [ ] JWT avec **expiration courte** (ex : 15-30 min) + **refresh token**
- [ ] Rotation régulière de la `SECRET_KEY` et stockage en **variable d’environnement** sécurisée
- [ ] Vérifier que toutes les routes sensibles utilisent `Depends(get_current_user)`

## 🧱 Configuration Serveur
- [ ] Activer **HTTPS** (TLS 1.2+)
- [ ] Ajouter **HSTS** (`Strict-Transport-Security` header)
- [ ] Activer **rate limiting** (ex : limiter les tentatives de login)
- [ ] Configurer un **reverse proxy** (Nginx / Caddy) pour filtrer certaines attaques

## 📜 Headers de Sécurité
- [ ] `Content-Security-Policy` stricte (sans `'unsafe-inline'` ni `'unsafe-eval'`)
- [ ] `X-Frame-Options: DENY` (contre le clickjacking)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: no-referrer`
- [ ] `Permissions-Policy` (désactiver les APIs inutiles : caméra, micro, géoloc…)

## 🔍 Tests & Audits
- [ ] Faire un **scan OWASP ZAP** ou équivalent pour trouver les vulnérabilités
- [ ] Tester **l’injection SQL** et **XSS**
- [ ] Désactiver les messages d’erreur détaillés en prod
- [ ] Vérifier que **les dépendances** Python et JS sont à jour (`pip list --outdated` / `npm outdated`)

## 🗄️ Base de Données
- [ ] Chiffrer les mots de passe avec **bcrypt**
- [ ] Restreindre les accès à la DB (IP whitelist, pas d’accès public)
- [ ] Sauvegardes régulières et chiffrées

## 🛠 Maintenance
- [ ] Mettre en place un **logging sécurisé** (sans stocker d’infos sensibles)
- [ ] Surveiller les connexions suspectes
- [ ] Automatiser les mises à jour de sécurité

---

💡 **Astuce** : en dev, on peut assouplir CSP et CORS pour faciliter le travail, mais **en prod on resserre tout au maximum**.
