import { useState } from "react";
import { api } from "../utilities.jsx";
import { useParams } from "react-router-dom";

export default function PasswordResetPage() {
    const { token } = useParams();
    const [submitLoading, setSubmitLoading] = useState(false)
    const [resetMessage, setResetMessage] = useState(null)
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    
    function resetClicked(e) {
        setSubmitLoading(true)
        e.preventDefault();
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
            <form onSubmit={(e) => resetClicked(e)}>
                <h3>Reset Password</h3>
                <label>new password:</label>
                <input
                type="password"
                value={password}
                disabled={submitLoading}
                onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <label>confirm new password:</label>
                <input
                type="password"
                value={password2}
                disabled={submitLoading}
                onChange={(e) => setPassword2(e.target.value)}
                />
                <input type="submit" disabled={submitLoading || password !== password2 || password.length  == 0} />
                { password !== password2 && <p>passwords must match!</p>}
            </form> 
            : 
            <h3>{resetMessage}</h3>    
    )
    
}
  