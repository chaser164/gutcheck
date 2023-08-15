import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function LoggedOutHomePage() {
    const [hasLoaded, setHasLoaded] = useState(false)
    const [url, setUrl] = useState('')
    const [posts, setPosts] = useState([])
    const { setUser, setErrorScreen } = useContext(UserContext)

    useEffect(() => {

        // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        //     let url = tabs[0].url;
        //     setUrl(url)
        // });

        async function getPosts() {
            try {
                // Get the website's posts
                const response = await api.post(`posts/bywebsite/`, {
                    "website": "https://chat.openai.com/",
                });
                console.log(response)
                setPosts(response.data.posts)
                setHasLoaded(true)
            } 
            catch (err) {
                // If a response came back, show the response (common errors here are no token given, unvalidated email)
                if (err.response) {
                    setErrorScreen(err.response.data.detail)
                } else {
                    //Otherwise show the request message (likely a network error)
                    setErrorScreen(err.message)
                }
            }
        }

        getPosts()

    }, []);

    function logout () {
        async function logoutAPIPost() {
            try {
                const response = await api.post(`users/logout/`);
                console.log(response)
                setUser(null)
            } 
            catch (err) {
                if (err.message === 'Network Error') {
                    setErrorScreen('Network Error, failed to log out')
                    return
                }
                // Revoke access with any error
                setErrorScreen(err.message)
            } 
        }
        logoutAPIPost();
    }

    return (
        <>
            { hasLoaded &&
                <>
                    <h2>Posts</h2>
                    {posts.length > 0 ?
                    posts.map((post, i) => (
                        <div key={i}><p>{post.text}</p></div>
                    ))
                    :
                    <p>No posts yet!</p>
                    }
                    <p>current url: {url}</p>
                    <button onClick={logout}>Logout</button>
                </>
            }
        </>
    )
}
