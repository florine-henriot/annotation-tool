import React from 'react';
import TopbarLoginSignup from '../components/login_signup/TopbarLoginSignup';
import SignupForm from '../components/login_signup/SignupForm';

/**
 * Signup
 * 
 * Composant de page dédié à l'inscription d'un utilisateur.
 * Affiche:
 * - une barre supérieure spécifique aux pages login et sugnip via TopbarLoginSignup
 * - le formulaire d'isncription via SignupForm
 * 
 * Ce composant sert de conteneur pour organiser les éléments de la page et 
 * appliquer la mise en page (CSS des classes page et container).
 * 
 * @returns {JSX.Element} La page d'inscription complète avec topbar et formulaire.
 */

export default function Signup() {

    return (
        <div className='page'>

            <TopbarLoginSignup />

            <div className='container-no-side-bar'>

                <SignupForm />

            </div>

        </div>
    )
}