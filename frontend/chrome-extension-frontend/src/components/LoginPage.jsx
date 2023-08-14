import { useState, useContext } from "react";
import { api } from "../utilities.jsx";
import UserContext from "../contexts/UserContext.jsx";

export default function SignUpPage() {
    const { email, setEmail, password, setPassword, setErrorScreen, setUser } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    // const [label, setLabel] = useState('Send Reset Email')
    const [emailMessage, setEmailMessage] = useState('')
    const [showPasswordReset, setShowPasswordReset] = useState(false)
    
    function loginClicked(e) {
        setSubmitLoading(true)
        e.preventDefault()
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
                // console.log(err)
                if (err.message.includes('404')) {
                    // No matching user credentials message
                    setErrorScreen('No matching user credentials')
                } else {
                    // Likely a Network error message
                    setErrorScreen(err.message)
                }
                return
            } 
        }
        loginAPIPost();
    }

    function resetPassword(e) {
        setSubmitLoading(true)
        e.preventDefault()
        setEmailMessage('')
        async function resetEmailAPIPost() {
            try {
                const response = await api.post(`users/reset-email/`, {
                    "email": email,
                    });
                setEmailMessage(response.data.message)
            } 
            catch (err) {
                if (err.message.includes('404')) {
                    setEmailMessage('Unregistered Email')
                } 
                else {
                    // Likely network error
                    if (err.message.includes('Network Error')) {
                        setErrorScreen(err.message)
                    } 
                    else {
                        setEmailMessage(err.message)
                    }
                }
            }
            setSubmitLoading(false)
            // setLabel("Resend Reset Email")
        }
        resetEmailAPIPost()
    }

    function switchView() {
        setShowPasswordReset(prev => !prev)
    }

    return (
        <>
            <>
                <form onSubmit={(e) => showPasswordReset ? resetPassword(e) : loginClicked(e)}>
                    <h5>{showPasswordReset ? 'Enter email to reset password:' : 'Log in'}</h5>
                    <input
                    type="email"
                    value={email}
                    disabled={submitLoading}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    { !showPasswordReset &&
                        <input
                        type="password"
                        value={password}
                        disabled={submitLoading}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    }
                    <input type="submit" disabled={submitLoading}  />
                </form>
                { !showPasswordReset && <button onClick={switchView}>Forgot Password?</button> }
                { showPasswordReset && emailMessage && <p>{emailMessage}</p> }
            </>
        </>
    )
    
}
  