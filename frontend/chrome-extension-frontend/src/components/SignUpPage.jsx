import { useState, useContext } from "react";
import { api } from "../utilities.jsx";
import UserContext from "../contexts/UserContext.jsx";

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [wasClicked, setWasClicked] = useState(false)
    const { setUser, setLoginError } = useContext(UserContext)
    
    function signUpClicked(e) {
        e.preventDefault();
        // Trigger 'check email' page
        async function signUpAPIPost() {
            try {
                const response = await api.post(`users/signup/`, {
                    "email": email,
                    "password": password,
                    });
                setWasClicked(true) // To display message to check email
                setUser(email)
            } 
            catch (err) {
                if (err.message.includes('400')) {
                    // Email already in use for another account message
                    setLoginError('Email already in use')
                } else {
                    // Network error message
                    setLoginError('Network error')
                }
                return
            } 
        }
        signUpAPIPost();
    }

    return (
        <>
            { !wasClicked ? 
                <form onSubmit={(e) => signUpClicked(e)}>
                    <h5>Sign Up</h5>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <input type="submit" />
                </form> 
                :
                <p>Check email!</p>
            }
        </>
    )
    
}
  