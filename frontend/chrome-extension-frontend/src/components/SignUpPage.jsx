import { useState, useContext } from "react";
import { api } from "../utilities.jsx";
import UserContext from "../contexts/UserContext.jsx";

export default function SignUpPage() {
    const { setErrorScreen, setUser } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [signUpErrorMessage, setSignUpErrorMessage] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    
    // Ensure password is at least 8 characters
    function lenCheck(password) {
        if (password.length < 8) {
            return false
        }
        return true
    }

    function signUpClicked(e) {
        setSubmitLoading(true)
        e.preventDefault();
        // Trigger 'check email' page
        async function signUpAPIPost() {

            // Ensure populated fields
            if (!username) {
                setSignUpErrorMessage('Username cannot be empty')
                setSubmitLoading(false)
                return
            }
            if (!email) {
                setSignUpErrorMessage('Email cannot be empty')
                setSubmitLoading(false)
                return
            }
            if (!password) {
                setSignUpErrorMessage('Password cannot be empty')
                setSubmitLoading(false)
                return
            }
            if (!password2) {
                setSignUpErrorMessage('Password confirmation cannot be empty')
                setSubmitLoading(false)
                return
            }
            // Ensure valid username
            const usernamePattern = /^[a-zA-Z0-9._]+$/;
            if (!usernamePattern.test(username)) {
                setSignUpErrorMessage('Username contains invalid characters')
                setSubmitLoading(false)
                return
            }
            // Ensure username length limit not exceeded
            if (username.length > 30) {
                setSignUpErrorMessage('Username cannot exceed 30 characters')
                setSubmitLoading(false)
                return
            }
            // Ensure password length
            if (!lenCheck(password)) {
                setSignUpErrorMessage('Password must be at least 8 characters long')
                setSubmitLoading(false)
                return
            }
            // Ensure matching passwords
            if (password !== password2) {
                setSignUpErrorMessage('Passwords must match')
                setSubmitLoading(false)
                return
            }

            setSignUpErrorMessage('')
            try {
                const response = await api.post(`users/signup/`, {
                    "username": username,
                    "email": email,
                    "password": password,
                });
                // Display message to validate acconunt
                setUser(response.data.user)
                setErrorScreen('Check email to activate account!')
            } 
            catch (err) {
                // console.log(err)
                if (err.message.includes('400')) {
                    // Either email already in use for another account OR invalid email format message
                    setSignUpErrorMessage(err.response.data.message)
                } else {
                    // Likely network error message
                    setErrorScreen(err.message)
                }
                setSubmitLoading(false)
                return
            } 
        }
        signUpAPIPost();
    }

    return (
        <div className="center-container">
            <form onSubmit={(e) => signUpClicked(e)} className="form-container">
                <h2>Sign Up</h2>
                <input
                type="text"
                value={username}
                disabled={submitLoading}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type="email"
                value={email}
                disabled={submitLoading}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                type="password"
                value={password}
                disabled={submitLoading}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                />
                            <input
                type="password"
                value={password2}
                disabled={submitLoading}
                placeholder="Confirm Password"
                onChange={(e) => setPassword2(e.target.value)}
                />
                <p className="input-error-message">{ signUpErrorMessage }</p>
                <input className="submit-button" type="submit" disabled={submitLoading} value="Sign Up" />
            </form> 
        </div>
    )
    
}
  