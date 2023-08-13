import { useState, useContext } from "react";
import { api } from "../utilities.jsx";
import UserContext from "../contexts/UserContext.jsx";

export default function SignUpPage() {
    const { setErrorScreen, email, setEmail, password, setPassword } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    
    function signUpClicked(e) {
        setSubmitLoading(true)
        e.preventDefault();
        // Trigger 'check email' page
        async function signUpAPIPost() {
            try {
                const response = await api.post(`users/signup/`, {
                    "email": email,
                    "password": password,
                    });
                // Display message to validate acconunt
                setErrorScreen('Check email to activate account!')
            } 
            catch (err) {
                // console.log(err)
                if (err.message.includes('400')) {
                    // Either email already in use for another account OR invalid email format message
                    setErrorScreen(err.response.data.message)
                } else {
                    // Likely network error message
                    setErrorScreen(err.message)
                }
                return
            } 
        }
        signUpAPIPost();
    }

    return (
        <form onSubmit={(e) => signUpClicked(e)}>
            <h5>Sign Up</h5>
            <input
            type="email"
            value={email}
            disabled={submitLoading}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            value={password}
            disabled={submitLoading}
            onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" disabled={submitLoading} />
        </form> 
    )
    
}
  