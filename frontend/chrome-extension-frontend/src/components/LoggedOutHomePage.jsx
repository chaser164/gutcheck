import { useState, useEffect, useContext } from "react";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import UserContext from "../contexts/UserContext";
import SettingsPage from "./SettingsPage";
import gear from "../assets/gear.png";
import { api } from "../utilities";

export default function LoggedOutHomePage() {
    const [showSignUp, setShowSignUp] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [displayEmailButton, setDisplayEmailButton] = useState(false)
    const [resendMessage, setResendMessage] = useState('')
    const [emailSendButtonLoading, setEmailSendButtonLoading] = useState(false)
    const [showSettingsPage, setShowSettingsPage] = useState(false)
    const { errorScreen, setErrorScreen, user, setUser, hasAllUrlsPermission } = useContext(UserContext)

    // Based on error screen, set the visibility of the resend email button / resend message
    // If not a network error or email-related message, try to log out upon error!
    useEffect(() => {
        if ((errorScreen === 'Check email to activate account!' || errorScreen === 'Unvalidated Email')) {
            setDisplayEmailButton(true)
        }
        else {
            setDisplayEmailButton(false)
            setResendMessage('')
            if (errorScreen !== '' && !errorScreen.includes('Network Error')) {
                logout()
            }
        }
    }, [errorScreen]);
    
    async function logout() {
        try {
            const response = await api.post(`users/logout/`);
            console.log('logout successful')
        } 
        catch (err) {
            console.log('logout attempt failed')
            // Revoke access with a network error
            if (err.message === 'Network Error') {
                setErrorScreen('Network Error, failed to log out')
                return
            }
            console.log(err.message)
        } 
    }

    // Revert display to original, get rid of error screen message, don't assign a user, ensure any tokens are deleted
    function reset() {
        setDisplayEmailButton(false)
        setShowSignUp(false)
        setShowLogin(false)
        if (user) {
            logout()
        }
        setUser(null)
        setErrorScreen('')
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
                    setErrorScreen(err.message)
                    return
                }
                setResendMessage(err.message)
            }
            setEmailSendButtonLoading(false)
        }
        resendAPIPost()
    }

    // Allow access to all URLs    
    function allow() {
        chrome.permissions.request({
            origins: ["<all_urls>"]
        });
        setErrorScreen('')
    }

    function openSettings() {
        setShowSettingsPage(true)
    }

    return (
        <>
        {showSettingsPage ? 
            <SettingsPage setShowSettingsPage={setShowSettingsPage} verified={false} />
            :
            <>
                {/* Back button to get back to the initial state of 2 buttons (sign up/login) */}
                {/* Don't allow any back button clicking upon network error */}
                <header className="header-container">
                    {((showSignUp || showLogin || errorScreen) && !errorScreen.includes('Network Error')) && 
                    <div className="header-buttons-container">
                        <button onClick={reset} className="back menu">←</button>
                        { user &&
                            <button onClick={openSettings} className="settings"><img className="cog" src={gear}/></button>
                        }
                    </div>
                    }

                </header>
                { !errorScreen ? 
                <>
                    {/* If either button is clicked, show that page and hide the buttons */}
                    { !(showSignUp || showLogin) && (
                        <>
                            <h1>GutCheck</h1>
                            <div className="spacer">
                                <button onClick={() => setShowSignUp(true)} className="menu">Sign Up</button>
                                <button onClick={() => setShowLogin(true)} className="menu">Login</button>
                            </div>
                            <br />
                            <a href={"https://gutcheck-extension.netlify.app/community"} target="_blank">Community Guidelines</a>
                            <br />
                            <a href={"https://gutcheck-extension.netlify.app/privacy"} target="_blank">Privacy Policy</a>
                        </>
                        )
                    }
                    <>
                        { showSignUp && <SignUpPage /> }
                        { showLogin && <LoginPage /> }
                    </> 
                </> :
                <> 
                    {hasAllUrlsPermission ? 
                        <p>{errorScreen}</p> 
                    :(
                        <p>
                            You still need to
                            <br />
                            <button className="manip-button" onClick={allow}>
                            Allow access to all websites
                            </button>
                        </p>
                    )}
                </>
                }
                { displayEmailButton && 
                    <>
                        <button onClick={resendEmailValidation} disabled={emailSendButtonLoading} className="menu">Resend validation email</button>
                        { resendMessage !== '' && <p>{resendMessage}</p>}
                    </>
                    
                }
            </>
        }
        </>
    )
}
