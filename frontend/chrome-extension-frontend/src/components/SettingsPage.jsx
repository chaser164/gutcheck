import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function SettingsPage({ setShowSettingPage }) {
    const { setErrorScreen, setHasAlerts, hasAlerts } = useContext(UserContext)
    const [dangerZone, setDangerZone] = useState(false)


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
        console.log("delete!!")
    }

    return (
        <>
            <header onClick={() => setShowSettingPage(false)} className="title-holder">
                <button className="back menu">←</button>
            </header>
            <h2>Settings</h2>
            <div className="checkbox-display">
                <input type="checkbox" 
                    defaultChecked={hasAlerts}
                    onChange={(e) => changeAlertConfig(e.target.checked)} 
                />
                <p>Receive alerts whenever a website has associated posts</p>
            </div>
            <div className="dangerzone-container">
                { !dangerZone ? 
                    <button className="menu" onClick={() => setDangerZone(true)}>Delete account</button>
                    :
                    <>
                        <button className="menu" onClick={() => setDangerZone(false)}>cancel</button>
                        <button className="menu acc-delete" onClick={deleteAccount}>confirm permanent deletion</button>
                    </>
                }
            </div>
        </>
    )
}
