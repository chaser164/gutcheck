import { useState } from "react";
import { api } from "../utilities.jsx";
import { useParams } from "react-router-dom";

export default function PasswordResetPage() {
    const { token } = useParams();
    const [submitLoading, setSubmitLoading] = useState(false)
    const [resetMessage, setResetMessage] = useState(null)
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [warningMessage, setWarningMessage] = useState('')
    
    function resetClicked(e) {
        e.preventDefault();
        setWarningMessage('')
        // Guards
        // Password matching
        if(password !== password2) {
            setWarningMessage('Passwords must match')
            return
        }
        // Password length limit
        if(password.length < 8) {
            setWarningMessage('Password must be at least 8 characters')
            return
        }
        setSubmitLoading(true)
        // Trigger 'check email' page
        async function resetAPIPost() {
            try {
                const response = await api.put(`users/reset-password/${token}/`, {
                    "password": password,
                    });
                // Display message to validate acconunt
                setResetMessage(response.data.message)
            } 
            catch (err) {
                // Likely network error message
                setResetMessage(err.message)
            }
            return
        }
        resetAPIPost();
    }

    return (
        !resetMessage ? 
            <form className="form-container" onSubmit={(e) => resetClicked(e)}>
                <h3>Reset Password</h3>
                <input
                placeholder="Password"
                type="password"
                value={password}
                disabled={submitLoading}
                onChange={(e) => setPassword(e.target.value)}
                />
                <input
                 placeholder="Confirm Password"
                type="password"
                value={password2}
                disabled={submitLoading}
                onChange={(e) => setPassword2(e.target.value)}
                />
                <input className="submit-button" type="submit" />
                <p className="warning-text">{warningMessage}</p>
            </form> 
            : 
            <h3>{resetMessage}</h3>    
    )
    
}
  