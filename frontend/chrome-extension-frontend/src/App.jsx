import './App.css'
import { api } from './utilities'
import { useState, useEffect } from 'react'
import LoggedOutHomePage from './components/LoggedOutHomePage'
import LoggedInHomePage from './components/LoggedInHomePage'
import UserContext from './contexts/UserContext.jsx'


function App() {
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const checkEmailMessages = {'initial': 'Check email to activate account!', 'subsequent': 'Unvalidated Email'}
  
  // On initial render, test to see if there is currently a logged-in user. If so, set user state to this user
  useEffect(() => {
    async function checkActiveUser() {
      try {
          const response = await api.get(`users/me/`);
          setUser(response.data.email)
      } 
      catch (err) {
        console.log(err)
        console.log('no active user logged in')
      }
  }
  checkActiveUser()
  }, []);

  // Whenever the frontend prompts user to verify email, check for verification and automatically login
  useEffect(() => {
    async function loginAPIPost() {
      try {
        const response = await api.post(`users/login/`, {
          "email": email,
          "password": password,
          });
          setUser(response.data.user)
      } 
      catch (err) {
          console.log(err)
          if (err.message.includes('404')) {
              // No matching user credentials message
              setLoginError('No matching user credentials')
          } else {
              // Network error message
              setLoginError('Network error')
          }
          return
      } 
    }
    async function isValidated() {
      try {
          const response = await api.get(`users/me/`);
          return true
      } 
      catch (err) {
        return false
      }
    }
  }, [loginError]);

  // something that, when the loginError has to do with checking email, send a login to get a token cookie and periodically request users/me endpoint to see if user is validated

  return (
    <UserContext.Provider 
      value = {{ 
        setUser, 
        loginError, 
        setLoginError, 
        checkEmailMessages, 
        email,
        setEmail,
        password,
        setPassword
    }}>
      <h2>GutCheck</h2>
      { (user && loginError == '') ? <LoggedInHomePage /> : <LoggedOutHomePage /> }
    </UserContext.Provider>
)
}

export default App


