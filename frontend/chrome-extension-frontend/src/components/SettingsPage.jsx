import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function SettingsPage({ setShowSettingsPage, verified }) {
    const { setErrorScreen, setHasAlerts, hasAlerts, setUser } = useContext(UserContext)
    const [dangerZone, setDangerZone] = useState(false)
    const [deletionLoading, setDeletionLoading] = useState(false)


    function changeAlertConfig(val) {
        setHasAlerts(val)
        async function alertAPIUpdate() {
            try {
                const response = await api.put(`users/set-alerts/`, {
                "alerts": val,
                });
            } 
            catch (err) {
                // Revert hasAlerts value upon error
                setHasAlerts(!val)
                // Likely a Network error message
                setErrorScreen(err.message)
            }
        } 
        alertAPIUpdate(val);
    }

    function deleteAccount() {
        setDeletionLoading(true)
        async function deleteAPIPost() {
            try {
                const response = await api.delete(`users/self-delete/`);
                setUser(null)
                setHasAlerts(false)
                // Use the error screen to communicate deletion and hard reset
                setErrorScreen('deleted')
                setShowSettingsPage(false)
            } 
            catch (err) {
                setDeletionLoading(false)
                if (err.message === 'Network Error') {
                    setErrorScreen('Network Error, failed to log out')
                    return
                }
                // Revoke access with any error
                setErrorScreen(err.message)
            } 
            setDeletionLoading(false)
        }
        deleteAPIPost();
    }

    return (
        <>
            <header className="title-holder">
                <button onClick={() => setShowSettingsPage(false)} className="back menu" disabled={deletionLoading}>←</button>
            </header>
            <h2>Settings</h2>
            {verified &&
                <div className="checkbox-display">
                    <input type="checkbox" 
                        defaultChecked={hasAlerts}
                        onChange={(e) => changeAlertConfig(e.target.checked)} 
                    />
                    <p>Receive alerts whenever a website has associated posts</p>
                </div>
            }
            <div className="dangerzone-container">
                { !dangerZone ? 
                    <button className="menu" onClick={() => setDangerZone(true)}>Delete account</button>
                    :
                    <>
                        <button className="menu" onClick={() => setDangerZone(false)} disabled={deletionLoading}>cancel</button>
                        <button className="menu acc-delete" onClick={deleteAccount} disabled={deletionLoading}>confirm permanent deletion</button>
                    </>
                }
            </div>
        </>
    )
}
