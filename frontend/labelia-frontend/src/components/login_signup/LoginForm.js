import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import InputField from '../common/InputField';
import ButtonSubmit from '../common/ButtonSubmit';
import ButtonRedirect from '../common/ButtonRedirection';
import PasswordInput from './PasswordInput';
import "../../App.css";
import "./Form.css";

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/auth/login', {
                email,
                password
            },
        { withCredentials: true});

            if (response.status === 200 && response.data.success) {
                // Login réussi, token en cookie est set

                // Test accès protégé
                const protectedRes = await axiosClient.get('/auth/protected');
                console.log("Accès protégé OK:", protectedRes.data);
                
                navigate('/dashboard'); // Redirige si la connexion réussit
            } else {
                setMessage(response.data.message || 'Erreur inconnue.');
            }

        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.detail) {
                setMessage(error.response.data.detail);
            } else {
                setMessage('Erreur lors de la connexion.');
            }
        }
    };


    return (
        <div className='card login-signup-card'>

            <img src="./avatar/login_avatar.png" alt="Avatar" className='avatar' />
            <h2 className='title'>CONNEXION</h2>

            <form onSubmit={handleLogin}>

                <InputField
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse mail"
                    required={true}
                />

                <PasswordInput
                    password={password}
                    setPassword={setPassword}
                    placeholder="Mot de passe"
                />

                <ButtonSubmit
                    text="SE CONNECTER"
                    onClick={handleLogin}
                    disabled={false}
                />

                {/* Message d'information ou d'erreur */}
                {message && <p className='login-message'>{message}</p>}

                <span className='message'>Pas encore inscrit ?</span>

                <ButtonRedirect
                    className=""
                    text="INSCRIVEZ-VOUS"
                    to="/signup"
                    disabled={false}
                />

            </form>

        </div>
    )

}