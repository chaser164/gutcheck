import { useState, useContext } from "react";
import { api } from "../utilities.jsx";
import UserContext from "../contexts/UserContext.jsx";

export default function SignUpPage() {
    const { setErrorScreen, email, setEmail, password, setPassword, setUser } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [signUpErrorMessage, setSignUpErrorMessage] = useState('')
    const [password2, setPassword2] = useState('')
    
    function signUpClicked(e) {
        setSubmitLoading(true)
        e.preventDefault();
        // Trigger 'check email' page
        async function signUpAPIPost() {
            // Ensure populated fields
            if (!(email && password)) {
                setSignUpErrorMessage('Fields cannot be empty')
                setSubmitLoading(false)
                return
            }
            // Ensure matching passwords
            if (password !== password2) {
                setSignUpErrorMessage('Passwords must match')
                setSubmitLoading(false)
                return
            }
            setSignUpErrorMessage('')
            try {
                const response = await api.post(`users/signup/`, {
                    "email": email,
                    "password": password,
                });
                // Display message to validate acconunt
                setUser(response.data.user)
                setErrorScreen('Check email to activate account!')
            } 
            catch (err) {
                // console.log(err)
                if (err.message.includes('400')) {
                    // Either email already in use for another account OR invalid email format message
                    setSignUpErrorMessage(err.response.data.message)
                } else {
                    // Likely network error message
                    setErrorScreen(err.message)
                }
                setSubmitLoading(false)
                return
            } 
        }
        signUpAPIPost();
    }

    return (
        <>
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
                        <input
            type="password"
            value={password2}
            disabled={submitLoading}
            onChange={(e) => setPassword2(e.target.value)}
            />
            <input type="submit" disabled={submitLoading} />
        </form> 
        <p>{ signUpErrorMessage }</p>
        </>
    )
    
}
  