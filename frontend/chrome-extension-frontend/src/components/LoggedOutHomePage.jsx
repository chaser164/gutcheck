import { useState, useContext } from "react";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import UserContext from "../contexts/UserContext";

export default function LoggedOutHomePage() {
    const [showSignUp, setShowSignUp] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const { loginError, setLoginError, setUser } = useContext(UserContext)

    function reset() {
        setShowSignUp(false)
        setShowLogin(false)
        setLoginError('')
        setUser(null)
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
