import { api } from './utilities'
import { useState, useEffect } from 'react'
import LoggedOutHomePage from './components/LoggedOutHomePage'
import LoggedInHomePage from './components/LoggedInHomePage'
import UserContext from './contexts/UserContext.jsx'
import Loader from './components/Loader.jsx'


function App() {
  const [user, setUser] = useState(null)
  const [errorScreen, setErrorScreen] = useState('')
  const [hasCheckedUser, setHasCheckedUser] = useState(false)
  const [hasAllUrlsPermission, setHasAllUrlsPermission] = useState(false)
  const [hasAlerts, setHasAlerts] = useState(true)
  
  // Keep track of alert settings in storage
  useEffect(() => {
    chrome.storage.sync.set({ hasAlerts });
}, [hasAlerts])

  // On initial render, test to see if there is currently a logged-in user. If so, set user state to this user
  useEffect(() => {
    async function checkActiveUser() {
      try {
          const response = await api.get(`users/status/`)
          setHasAlerts(response.data['receives_alerts'])
          setUser(response.data.user)
      } 
      catch (err) {
        // Revoke access with a network error
          if (err.message === 'Network Error') {
              setErrorScreen(err.message)
          }
      }
      setHasCheckedUser(true)
  }
  // Check permissions
  chrome.permissions.contains({ origins: ["<all_urls>"] }, result => {
    setHasAllUrlsPermission(result)
    if(result) {
      checkActiveUser()
    } else {
      // Set to 'Network Error' to prevent automatic logout
      setErrorScreen('Network Error')
      setHasCheckedUser(true)
    }
  });
  }, []);
  
  return (
    <UserContext.Provider 
      value = {{ 
        user,
        setUser, 
        errorScreen, 
        setErrorScreen,
        hasAllUrlsPermission,
        hasAlerts,
        setHasAlerts
    }}>
      {hasCheckedUser ?
        <>
          { (user && errorScreen == '') ? 
          <LoggedInHomePage /> 
          : 
          <LoggedOutHomePage /> 
          }  
        </>
        :
        <div className='loader-container'>
          <Loader />
        </div>
      }
    </UserContext.Provider>
)
}

export default App