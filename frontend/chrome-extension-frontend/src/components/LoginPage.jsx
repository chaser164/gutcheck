import { useState, useContext } from "react";
import { api } from "../utilities.jsx";
import UserContext from "../contexts/UserContext.jsx";

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(false)
    const { setUser, loginError, setLoginError } = useContext(UserContext)
    
    function loginClicked(e) {
        e.preventDefault();
        // Trigger 'check email' page
        async function loginAPIPost() {
            try {
              const response = await api.post(`users/login/`, {
                "email": email,
                "password": password,
                });
                setUser(response.data.user)
            } 
            catch (err) {
                console.log(err)
                if (err.message.includes('404')) {
                    // No matching user credentials message
                    setLoginError('No matching user credentials')
                } else {
                    // Network error message
                    setLoginError('Network error')
                }
                return
            } 
        }
        loginAPIPost();
    }

    return (
        <>
            <form onSubmit={(e) => loginClicked(e)}>
                <h5>Log in</h5>
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
        
        </>
    )
    
}
  