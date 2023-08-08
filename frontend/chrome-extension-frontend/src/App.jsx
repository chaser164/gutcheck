import './App.css'
import { useState } from 'react'
import LoggedOutHomePage from './components/LoggedOutHomePage'
import LoggedInHomePage from './components/LoggedInHomePage'
import UserContext from './contexts/UserContext.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')

  return (
    <UserContext.Provider value = {{ setUser, loginError, setLoginError }}>
      <h2>GutCheck</h2>
      { (user && loginError == '') ? <LoggedInHomePage /> : <LoggedOutHomePage /> }
    </UserContext.Provider>
)
}

export default App


