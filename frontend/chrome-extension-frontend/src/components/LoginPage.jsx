import { useState, useContext } from "react";
import { api } from "../utilities.jsx";
import UserContext from "../contexts/UserContext.jsx";
import { useSyncExternalStore } from "react";

export default function SignUpPage() {
    const { email, setEmail, password, setPassword, setErrorScreen, setUser } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [emailMessage, setEmailMessage] = useState('')
    const [showPasswordReset, setShowPasswordReset] = useState(false)
    const [loginErrorMessage, setLoginErrorMessage] = useState('')
    
    function loginClicked(e) {
        setSubmitLoading(true)
        setLoginErrorMessage('')
        e.preventDefault()
        if (!(email && password)) {
            setLoginErrorMessage('Fields cannot be empty')
            setSubmitLoading(false)
            return
        }
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
                    setLoginErrorMessage('No matching user credentials')
                    setSubmitLoading(false)
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
        if (!email) {
            setEmailMessage('Field cannot be empty')
            setSubmitLoading(false)
            return
        }
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
        <div className="center-container">
            <form onSubmit={(e) => showPasswordReset ? resetPassword(e) : loginClicked(e)} className="form-container">
                <h2>{showPasswordReset ? 'Reset password:' : 'Log In'}</h2>
                <input
                type="email"
                value={email}
                disabled={submitLoading}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                />
                { !showPasswordReset &&
                    <input
                    type="password"
                    value={password}
                    disabled={submitLoading}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                }
                { !showPasswordReset && <p>{ loginErrorMessage }</p> }
                <input className="submit-button" type="submit" disabled={submitLoading} value={ showPasswordReset ? "Send Email" : "Log In" } />
                { !showPasswordReset && <button onClick={switchView} className="menu forgot">Forgot Password</button> }
                { showPasswordReset && emailMessage && <p>{ emailMessage }</p> }
            </form>
        </div>
    )
    
}
  