import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function LoggedOutHomePage({post, upvotedIDs, downvotedIDs}) {

    const initialUpvotes = upvotedIDs.includes(post.id) ? post.upvotes - 1 : post.upvotes
    const initialDownvotes = downvotedIDs.includes(post.id) ? post.downvotes - 1 : post.downvotes
    const [upvoted, setUpvoted] = useState(upvotedIDs.includes(post.id))
    const [downvoted, setDownvoted] = useState(downvotedIDs.includes(post.id))
    const { setErrorScreen } = useContext(UserContext)

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
        <>
            <p>{post.text}</p>
            <div>
                <div>
                    <button onClick={upvote}>{ upvoted ? "~^~" : "^" }</button>
                    <p>{ numberDisplay(upvoted ? initialUpvotes + 1 : initialUpvotes) }</p>
                </div>
                <div>
                    <button onClick={downvote}>{ downvoted ? "~v~" : "v" }</button>
                    <p>{ numberDisplay(downvoted ? initialDownvotes + 1 : initialDownvotes) }</p>
                </div>
            </div>
        </>
    )
}
