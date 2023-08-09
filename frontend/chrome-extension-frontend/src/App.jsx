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
  const [hasCheckedUser, setHasCheckedUser] = useState(false)
  const checkEmailMessages = {'initial': 'Check email to activate account!', 'subsequent': 'Unvalidated Email'}
  
  // On initial render, test to see if there is currently a logged-in user. If so, set user state to this user
  useEffect(() => {
    async function checkActiveUser() {
      try {
          const response = await api.get(`users/me/`)
          setUser(response.data.email)
      } 
      catch (err) {
        console.log('no activated user logged in')
      }
      setHasCheckedUser(true)
  }
  checkActiveUser()
  }, []);

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
      {hasCheckedUser &&
        <>
          <h2>GutCheck</h2>
          { (user && loginError == '') ? <LoggedInHomePage /> : <LoggedOutHomePage /> }  
        </>
      }
    </UserContext.Provider>
)
}

export default App


