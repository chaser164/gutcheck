import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";
import PostCard from './PostCard.jsx'
import AddPostPage from "./AddPostPage";
import SettingsPage from "./SettingsPage.jsx";
import FlagPage from "./FlagPage";
import gear from "../assets/gear.png";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function LoggedInHomePage() {
    const [hasLoaded, setHasLoaded] = useState(false)
    const [url, setUrl] = useState('')
    const [posts, setPosts] = useState([])
    const [hasPosted, setHasPosted] = useState(false)
    const [upvotedIDs, setUpvotedIDs] = useState([])
    const [downvotedIDs, setDownvotedIDs] = useState([])
    const [showAddPostPage, setShowAddPostPage] = useState(false)
    const [showSettingsPage, setShowSettingsPage] = useState(false)
    const [flaggedPostID, setFlaggedPostID] = useState(null)
    const [deletedCount, setDeletedCount] = useState(0)
    const [postidToEdit, setPostidToEdit] = useState(null)
    const [logoutClicked, setLogoutClicked] = useState(false)
    const { setUser, setErrorScreen, setHasAlerts } = useContext(UserContext)

    // When returning to main page, reset edit status
    useEffect(() => {
        if(!showAddPostPage) {
            setPostidToEdit(null)
        }
    }, [showAddPostPage])

    useEffect(() => {

        // Get the current URL (code only works in a chrome extension)
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let url = tabs[0].url;
            setUrl(url)
        });
        // For development:
        // setUrl('https://chat.openai.com/')

        async function getPosts() {
            try {
                // Get the website's posts
                const response = await api.post(`posts/bywebsite/`, {
                    "website": url,
                });
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

    }, [showAddPostPage, flaggedPostID, url, deletedCount]);


    useEffect(() => {
        // Guard against reset
        if(!postidToEdit) {
            return;
        }
        setShowAddPostPage(true)
    }, [postidToEdit]);

    function findEditPost() {
        const emptyPost = {"text": "", "footnote1": "", "explanation1": "", "footnote2": "", "explanation2": ""}
        if (!postidToEdit) {
            return emptyPost
        }
        const postToEdit = posts.find(post => post.id === postidToEdit);

        // Return either found post or empty post
        if (postToEdit) {
            return postToEdit
        } else {
           return emptyPost
        }
    }

    function logout () {
        setLogoutClicked(true)
        async function logoutAPIPost() {
            try {
                const response = await api.post(`users/logout/`);
                setUser(null)
                setHasAlerts(false)
            } 
            catch (err) {
                setLogoutClicked(false)
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

    function openSettings() {
        setShowSettingsPage(true)
    }

    return (
        <>
            { showSettingsPage ? 
            <SettingsPage setShowSettingsPage={setShowSettingsPage} verified={true} />
            :
            <>
                { showAddPostPage ?
                    <AddPostPage setShowAddPostPage={setShowAddPostPage} url={url} content={findEditPost()} setPostidToEdit={setPostidToEdit}  />
                    :
                    <>
                    { flaggedPostID ?
                        <FlagPage setFlaggedPostID={setFlaggedPostID} post_id={flaggedPostID} />
                        :
                        <>
                            { hasLoaded &&
                                <>
                                    <header className="header-container">
                                        <div className="header-buttons-container">
                                            <button onClick={logout} className="logout menu" disabled={logoutClicked}>log out</button>
                                            <button onClick={openSettings} className="settings" disabled={logoutClicked}><img className="cog" src={gear}/></button>
                                        </div>
                                        <div>
                                            <h2>{posts.length} {posts.length == 1 ? "GutCheck" : "GutChecks"} for</h2>
                                            <p className="url-container">{url}</p>
                                        </div>
                                    </header>
                                    <br />
                                    <div className="posts-container">
                                        <button onClick={() => setShowAddPostPage(true)} disabled={hasPosted || logoutClicked} title={hasPosted ? "You can only post once per website" : null} className="menu">Contribute +</button>
                                        {posts.length > 0 ?
                                        posts.map((post, i) => (
                                            <div key={i}><PostCard post={post} upvotedIDs={upvotedIDs} downvotedIDs={downvotedIDs} setFlaggedPostID={setFlaggedPostID} setDeletedCount={setDeletedCount} setPostidToEdit={setPostidToEdit} logoutClicked={logoutClicked} /></div>
                                        ))
                                        :
                                        <p>No one has posted here yet. Be the first!</p>
                                        }
                                    </div>
                                </>
                            }
                        </>
                    }
                    </>
                }
            </>
            }
        </>
    )
}