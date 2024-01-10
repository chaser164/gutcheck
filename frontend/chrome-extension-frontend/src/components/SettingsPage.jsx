import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function SettingsPage({ setShowSettingPage }) {
    const { setErrorScreen } = useContext(UserContext)
    const [receiveAlerts, setReceiveAlerts] = useState(true);

    return (
        <>
            <header onClick={() => setShowSettingPage(false)} className="title-holder">
                <button className="back menu">←</button>
            </header>
            <h2>Settings</h2>
            <div className="checkbox-display">
                <input type="checkbox" 
                    defaultChecked={receiveAlerts}
                    onChange={(e) => setReceiveAlerts(e.target.value)} 
                />
                <p>Receive alerts whenever a website has associated posts</p>
            </div>
            <button className="menu">delete account</button>
        </>
    )
}
