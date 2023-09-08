import { useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";
import { useEffect } from "react";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function PostCard({post, upvotedIDs, downvotedIDs, setFlaggedPostID}) {
    const footnoteText = post.footnote1 && post.footnote2 ? "2 footnotes" : "1 footnote"
    const [initialUpvotes, setInitialUpvotes] = useState([])
    const [initialDownvotes, setInitialDownvotes] = useState([])
    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)
    const [footnotesVisible, setFootnotesVisible] = useState(false)
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

    function dateDisplay(dateString) {
        const options = {
            year: 'numeric',
            month: 'short', // Use 'short' to display the month abbreviation
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        const postDate = new Date(dateString); // Convert UTC timestamp to user's local time
        return postDate.toLocaleString(undefined, options)
    }

    // Toggle footnote visibility
    function showFootnotes() {
        setFootnotesVisible((prev) => !prev)
    }

    // Display flag view
    function flag() {
        setFlaggedPostID(post.id)
    }

    return (
        <div className="post-container">
            <div className="left-post-container">
                <div className="post-header">
                    <p className="username-title">{ post.username }</p>
                    <p className="date">{dateDisplay(post.datetime)}</p>
                </div>
                <p className="post-text">{post.text}</p>
                { (post.footnote1 || post.footnote2) ?
                <>
                <button onClick={showFootnotes} className="menu footnote-display-button">{footnotesVisible ? "hide" : "show"} { footnoteText }</button>
                    { footnotesVisible && 
                        <>
                        { post.footnote1 && 
                            <>
                                <br />
                                <div className="footnote-text-container">
                                    <a href = {post.footnote1}>{ post.footnote1 }</a>
                                    <p className="footnote-post-text">{ post.explanation1 }</p>
                                </div>
                            </>
                        }
                        { post.footnote2 && 
                            <>
                                <div div className="footnote-spacer" />
                                <div className="footnote-text-container">
                                    <a href = {post.footnote2}>{ post.footnote2 }</a>
                                    <p className="footnote-post-text">{ post.explanation2 }</p>
                                </div>
                            </>
                        }
                        </>
                    }
                </>
                : 
                <p className="no-footnotes">no footnotes</p>
                }

            </div>
            <div>
                <div>

                    { post.flagged  ? 
                    <button disabled={true} className="flag-button-selected" title="You flagged this">⚑</button>
                    :
                    <button className="flag-button" title="Flag this GutCheck" onClick={flag}>⚑</button>
                    }
                </div>
                <div>
                    <p>{ numberDisplay(upvoted ? initialUpvotes + 1 : initialUpvotes) }</p>
                    <button onClick={upvote} className={upvoted ? "voted up" : "up"}>{'>'}</button>
                </div>
                <div>
                    <button onClick={downvote} className={downvoted ? "voted down" : "down"}>{'<'}</button>
                    <p>{ numberDisplay(downvoted ? initialDownvotes * -1 - 1 : initialDownvotes * -1) }</p>
                </div>
            </div>
        </div>
    )
}
