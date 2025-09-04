import React from 'react';
import TopbarLoginSignup from '../login_signup/TopbarLoginSignup';
import LoginForm from '../login_signup/LoginForm';

export default function Login() {

    return (
        <div className='page'>

            <TopbarLoginSignup />

            <div className='container'>

                <LoginForm />

            </div>

        </div>
    )
}