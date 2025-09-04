import React from 'react';
import TopbarLoginSignup from '../login_signup/TopbarLoginSignup';
import InputField from '../common/InputField';
import ButtonSubmit from '../common/ButtonSubmit';

export default function Login() {

    const [email, setEmail] = React.useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
    }

    return (
        <div className='page'>

            <TopbarLoginSignup />

            <div className='container'>
                <InputField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required={true}
                />

                <ButtonSubmit
                text="CONNEXION"
                onClick={handleLogin}
                disabled={false} />
            </div>

        </div>
    )
}