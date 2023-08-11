import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the logInError to something non-empty 
export default function LoggedOutHomePage() {
    const [info, setInfo] = useState("")
    // Deal with non-login-related errors:
    const [errorMessage, setErrorMessage] = useState("")
    const [hasLoaded, setHasLoaded] = useState(false)
    const [url, setUrl] = useState('')
    const { setUser, setLoginError } = useContext(UserContext)

    useEffect(() => {
        async function checkStatus() {
            try {
                // Accessing an endpoint requiring a validated email
                const response = await api.get(`users/me/`);
                console.log(response)
                setInfo(response.data.email)
                setHasLoaded(true)
            } 
            catch (err) {
                // If a response came back, show the response (common errors here are no token given, unvalidated email)
                console.log(err)
                if (err.response) {
                    setLoginError(err.response.data.detail)
                } else {
                    //Otherwise show the request message (likely a newtork error)
                    setLoginError(err.message)
                }
            }
        }
        checkStatus()

        // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        //     let url = tabs[0].url;
        //     setUrl(url)
        // });

    }, []);

    function logout () {
        async function logoutAPIPost() {
            try {
              const response = await api.post(`users/logout/`);
            console.log(response)
            setUser(null)
            } 
            catch (err) {
                setErrorMessage(err.message)
                return
            } 
        }
        logoutAPIPost();
    }

    return (
        <>
            { hasLoaded &&
                <>
                    <p>logged in as: </p>
                    <p>{info}</p>
                    <p>current url: {url}</p>
                    <button onClick={logout}>Logout</button>
                    {errorMessage !== '' && <p>{errorMessage}</p>}
                </>
            }
        </>
    )
}
