import React from 'react';
import InputField from '../common/InputField';
import ButtonSubmit from '../common/ButtonSubmit';
import ButtonRedirect from '../common/ButtonRedirection';
import "../../App.css";
import "./Form.css";

export default function LoginForm() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
    }

    return (
        <div className='card login-signup-card'>

            <img src="./avatar/login_avatar.png" alt="Avatar" className='avatar' />
            <h2 className='title'>CONNEXION</h2>

            <InputField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse mail"
                required={true}
            />

            <InputField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required={true}
            />

            <ButtonSubmit
                text="CONNEXION"
                onClick={handleLogin}
                disabled={false}
            />

            <span className='message'>Pas encore inscrit ?</span>

            <ButtonRedirect
                text="S'INSCRIRE"
                to="/signup"
                disabled={false}
            />

        </div>
    )

}