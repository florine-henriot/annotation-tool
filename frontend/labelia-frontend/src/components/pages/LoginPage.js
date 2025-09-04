import React from 'react';
import TopbarLoginSignup from '../login_signup/TopbarLoginSignup';
import InputField from '../common/InputField';

export default function Login() {

    const [email, setEmail] = React.useState('');

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
            </div>

        </div>
    )
}