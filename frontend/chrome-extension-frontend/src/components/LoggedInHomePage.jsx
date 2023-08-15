import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";
import PostCard from './PostCard.jsx'

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function LoggedOutHomePage() {
    const [hasLoaded, setHasLoaded] = useState(false)
    const [url, setUrl] = useState('')
    const [posts, setPosts] = useState([])
    const [upvotedIDs, setUpvotedIDs] = useState([])
    const [downvotedIDs, setDownvotedIDs] = useState([])
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
                setPosts(response.data)
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

        async function getUpvoted() {
            try {
                // Get the user's upvoted posts
                const response = await api.get(`posts/byvote/up/`);
                setUpvotedIDs(response.data)
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

        async function getDownvoted() {
            try {
                // Get the user's upvoted posts
                const response = await api.get(`posts/byvote/down/`);
                setDownvotedIDs(response.data)
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
        getUpvoted()
        getDownvoted()
        setHasLoaded(true)

    }, []);

    function logout () {
        async function logoutAPIPost() {
            try {
                const response = await api.post(`users/logout/`);
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
                        <div key={i}><PostCard post={post} upvotedIDs={upvotedIDs} downvotedIDs={downvotedIDs} /></div>
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
