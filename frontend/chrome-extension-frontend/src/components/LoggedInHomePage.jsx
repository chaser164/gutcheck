import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";
import PostCard from './PostCard.jsx'
import AddPostPage from "./AddPostPage";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function LoggedOutHomePage() {
    const [hasLoaded, setHasLoaded] = useState(false)
    const [url, setUrl] = useState('')
    const [posts, setPosts] = useState([])
    const [hasPosted, setHasPosted] = useState(false)
    const [upvotedIDs, setUpvotedIDs] = useState([])
    const [downvotedIDs, setDownvotedIDs] = useState([])
    const [showAddPostPage, setShowAddPostPage] = useState(false)
    const { setUser, setErrorScreen } = useContext(UserContext)

    useEffect(() => {

        // Get the current URL (code only works in a chrome extension)
        // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        //     let url = tabs[0].url;
        //     setUrl(url)
        // });
        setUrl('https://chat.openai.com/')

        async function getPosts() {
            try {
                // Get the website's posts
                const response = await api.post(`posts/bywebsite/`, {
                    "website": url,
                });
                console.log(response)
                setPosts(response.data.posts)
                setHasPosted(response.data.user_posted)
                // Call the other API requests, set hasLoaded to true to activate account
                // (put these in here b/c in case of failed call (likely due to inactive account) won't ever load the activated page even for a split second)
                getUpvoted()
                getDownvoted()
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

    }, [showAddPostPage, url]);

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
            { showAddPostPage ?
                <AddPostPage setShowAddPostPage={setShowAddPostPage} url={url} />
                :
                <>
                    { hasLoaded &&
                        <>
                            <header className="header-container">
                                <button onClick={logout} className="logout menu">Logout</button>
                                <div>
                                    <h2>{posts.length} {posts.length == 1 ? "Report" : "Reports"} for</h2>
                                    <p>{url}</p>
                                </div>
                            </header>
                            <br />
                            <div className="posts-container">
                                <button onClick={() => setShowAddPostPage(true)} disabled={hasPosted} title={hasPosted ? "You can only post once per website" : null} className="menu">Contribute +</button>
                                {posts.length > 0 ?
                                posts.map((post, i) => (
                                    <div key={i}><PostCard post={post} upvotedIDs={upvotedIDs} downvotedIDs={downvotedIDs} /></div>
                                ))
                                :
                                <p>No reports yet. Be the first!</p>
                                }
                            </div>
                        </>
                    }
                </>
            }
        </>
    )
}
