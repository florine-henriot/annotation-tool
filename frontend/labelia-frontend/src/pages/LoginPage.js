import React from 'react';
import TopbarLoginSignup from '../components/login_signup/TopbarLoginSignup';
import LoginForm from '../components/login_signup/LoginForm';

/**
 * Login
 * 
 * Composant de page dédié à la connexion d'un utilisateur.
 * Affiche:
 * - une barre supérieure spécifique aux pages login et connexion via TopbarLoginSignup
 * - le formulaire de connexion via LoginForm
 * 
 * Ce composant sert de conteneur pour organiser les éléments de la page et appliquer 
 * la mise en page (CSS des classes page et container)
 * 
 * @returns {JSX.Element} La page de connexion complète avec topbar et formulaire.
 */

export default function Login() {

    return (
        <div className='page'>

            <TopbarLoginSignup />

            <div className='container-no-side-bar'>

                <LoginForm />

            </div>

        </div>
    )
}