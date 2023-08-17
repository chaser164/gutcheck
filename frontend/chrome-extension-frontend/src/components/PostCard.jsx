import { useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";
import { useEffect } from "react";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function PostCard({post, upvotedIDs, downvotedIDs}) {
    const [initialUpvotes, setInitialUpvotes] = useState([])
    const [initialDownvotes, setInitialDownvotes] = useState([])
    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)
    const { setErrorScreen } = useContext(UserContext)

    // After render and after upvotedIDs/posts have definitely been set, set the upvotes/downvotes values / has vs. hasn't voted values accordingly
    useEffect(() => {
        setInitialUpvotes(upvotedIDs.includes(post.id) ? post.upvotes - 1 : post.upvotes)
        setInitialDownvotes(downvotedIDs.includes(post.id) ? post.downvotes - 1 : post.downvotes)
        setUpvoted(upvotedIDs.includes(post.id))
        setDownvoted(downvotedIDs.includes(post.id))
    }, [upvotedIDs, post])

    function upvote() {
        async function upvoteAPICall() {
            // If vote already selected, deselect by abstaining
            if (upvoted) {
                abstain()
                return
            }
            try {
                const response = await api.put(`posts/${post.id}/upvote/`);
                setUpvoted(true)
                setDownvoted(false)
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
        upvoteAPICall()
    }

    function downvote() {
        // If vote already selected, deselect by abstaining
        if (downvoted) {
            abstain()
            return
        }
        async function downvoteAPICall() {
            try {
                const response = await api.put(`posts/${post.id}/downvote/`);
                setDownvoted(true)
                setUpvoted(false)
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
        downvoteAPICall()
    }

    function abstain() {
        async function abstainAPICall() {
            try {
                const response = await api.put(`posts/${post.id}/abstain/`);
                setDownvoted(false)
                setUpvoted(false)
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
        abstainAPICall()
    }

    function numberDisplay(num) {
        if (num === 0) {
            return "0"
        }
        else {
            return String(num)
        }

    }

    return (
        <div className="post-container">
            <p>{post.text}</p>
            <div>
                <div>
                    <p>{ numberDisplay(upvoted ? initialUpvotes + 1 : initialUpvotes) }</p>
                    <button onClick={upvote}>{ upvoted ? "~^~" : "^" }</button>
                </div>
                <div>
                    <button onClick={downvote}>{ downvoted ? "~v~" : "v" }</button>
                    <p>{ numberDisplay(downvoted ? initialDownvotes * -1 - 1 : initialDownvotes * -1) }</p>
                </div>
            </div>
        </div>
    )
}
