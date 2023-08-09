import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the logInError to something non-empty 
export default function LoggedOutHomePage() {
    const [info, setInfo] = useState("")
    // Deal with non-login-related errors:
    const [errorMessage, setErrorMessage] = useState("")
    const [hasLoaded, setHasLoaded] = useState(false)
    const { setUser, setLoginError, checkEmailMessages } = useContext(UserContext)

    useEffect(() => {
        async function getData() {
            try {
                const response = await api.get(`users/me/`);
                console.log(response)
                setInfo(response.data.email)
                setHasLoaded(true)
            } 
            catch (err) {
                if (err.response.data.detail == checkEmailMessages['subsequent']) {
                    setLoginError(checkEmailMessages['subsequent'])
                } else {
                    // In case there is some weird error that isn't email related
                    setLoginError('Unknown Login Error')
                }
            }
        }
        getData()
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
                    <button onClick={logout}>Logout</button>
                    {errorMessage !== '' && <p>{errorMessage}</p>}
                </>
            }
        </>
    )
}
