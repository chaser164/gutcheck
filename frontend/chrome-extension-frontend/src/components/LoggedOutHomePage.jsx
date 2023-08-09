import { useState, useContext } from "react";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import UserContext from "../contexts/UserContext";
import { api } from "../utilities";

export default function LoggedOutHomePage() {
    const [showSignUp, setShowSignUp] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const { loginError, setLoginError, setUser } = useContext(UserContext)

    // Revert display to original, get rid of loginErrors, don't assign a user, ensure any tokens are deleted
    function reset() {
        // Log out if possible for added layer of protection
        async function logout() {
            try {
                const response = await api.post(`users/logout/`);
                console.log('logout successful')
            } 
            catch (err) {
                console.log(err)
                console.log('logout error')
            } 
        }

        setShowSignUp(false)
        setShowLogin(false)
        setLoginError('')
        setUser(null)
        logout()
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
            {/* Back button to get back to the initial state of 2 buttons (sign up/login) */}
            {(showSignUp || showLogin || (loginError !== '')) && <button onClick={reset}>back</button>}
        </>
    )
}
