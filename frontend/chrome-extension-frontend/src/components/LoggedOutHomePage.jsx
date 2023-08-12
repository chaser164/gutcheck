import { useState, useEffect, useContext } from "react";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import UserContext from "../contexts/UserContext";
import { api } from "../utilities";

export default function LoggedOutHomePage() {
    const [showSignUp, setShowSignUp] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [displayEmailButton, setDisplayEmailButton] = useState(false)
    const [resendMessage, setResendMessage] = useState('')
    const [emailSendButtonLoading, setEmailSendButtonLoading] = useState(false)
    const { loginError, setLoginError, setUser } = useContext(UserContext)

    // Based on log in error, set the visibility of the resend email button / resend message
    useEffect(() => {
    if ((loginError == 'Check email to activate account!' || loginError == 'Unvalidated Email')) {
        setDisplayEmailButton(true)
    }
    else {
        setDisplayEmailButton(false)
        setResendMessage('')
    }
}, [loginError]);
    

    // Revert display to original, get rid of loginErrors, don't assign a user, ensure any tokens are deleted
    function reset() {
        // Log out if possible for added layer of protection
        async function logout() {
            try {
                const response = await api.post(`users/logout/`);
                console.log('logout successful')
                setLoginError('')
            } 
            catch (err) {
                // Revoke access with a network error
                if (err.message === 'Network Error') {
                    setLoginError(err.message)
                    return
                }
                setLoginError('')
                console.log('no credentials to delete')
            } 
        }

        setDisplayEmailButton(false)
        setShowSignUp(false)
        setShowLogin(false)
        setUser(null)
        logout()
    }
    
    function resendEmailValidation() {
        setEmailSendButtonLoading(true)
        setResendMessage('')
        async function resendAPIPost() {
            try {
                const response = await api.post(`users/resend/`);
                setResendMessage(response.data.message)
            } 
            catch (err) {
                // Revoke access with a network error
                if (err.message === 'Network Error') {
                    setLoginError(err.message)
                    return
                }
                setResendMessage(err.message)
            }
            setEmailSendButtonLoading(false)
        }
        resendAPIPost()
    }
    return (
        <>
            { loginError == '' ? 
            <>
                {/* If either button is clicked, show that page and hide the buttons */}
                { !(showSignUp || showLogin) && (
                        <>
                            <button onClick={() => setShowSignUp(true)}>Sign Up</button>
                            <button onClick={() => setShowLogin(true)}>Login</button>
                        </>
                    )
                }
                <>
                    { showSignUp && <SignUpPage /> }
                    { showLogin && <LoginPage /> }
                </> 
            </> : 
            <p>{loginError}</p>
            }
            { displayEmailButton && 
                <>
                    <button onClick={resendEmailValidation} disabled={emailSendButtonLoading}>resend validation email</button>
                    { resendMessage !== '' && <p>{resendMessage}</p>}
                </>
                
            }
            {/* Back button to get back to the initial state of 2 buttons (sign up/login) */}
            {(showSignUp || showLogin || (loginError !== '')) && <button onClick={reset}>back</button>}
        </>
    )
}
