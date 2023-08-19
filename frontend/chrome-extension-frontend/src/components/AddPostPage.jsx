import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function AddPostPage({ setShowAddPostPage, url }) {
    const { setErrorScreen } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [postErrorMessage, setPostErrorMessage] = useState('')
    const [showFootnote1, setShowFootnote1] = useState(false)
    const [showFootnote2, setShowFootnote2] = useState(false)
    const [text, setText] = useState('')
    const [footnote1, setFootnote1] = useState('')
    const [explanation1, setExplanation1] = useState('')
    const [footnote2, setFootnote2] = useState('')
    const [explanation2, setExplanation2] = useState('')


    function postClicked(e) {
        setSubmitLoading(true)
        e.preventDefault();
        async function postAPICall() {
            // Ensure populated fields and text input length
            if (!text) {
                setPostErrorMessage('Body text cannot be empty')
                setSubmitLoading(false)
                return
            }

            if (text.length > 150) {
                setPostErrorMessage('Body text length exceeded')
                setSubmitLoading(false)
                return
            }

            if (showFootnote1) {
                if (!footnote1 || !explanation1) {
                    setPostErrorMessage('Footnote 1 cannot be empty')
                    setSubmitLoading(false)
                    return
                }
                if (explanation1.length > 100) {
                    setPostErrorMessage('Footnote 1 commentary length exceeded')
                    setSubmitLoading(false)
                    return
                }
            }

            if (showFootnote2) {
                if (!footnote2 || !explanation2) {
                    setPostErrorMessage('Footnote 2 cannot be empty')
                    setSubmitLoading(false)
                    return
                }
                if (explanation2.length > 100) {
                    setPostErrorMessage('Footnote 2 commentary length exceeded')
                    setSubmitLoading(false)
                    return
                }
            }


            setPostErrorMessage('')
            try {
                const body = {
                    "text": text,
                    "website": url,
                }
                // Add footnote 1 contents to body if it's included in the post construction
                if (showFootnote1) {
                    body["footnote1"] = footnote1
                    body["explanation1"] = explanation1
                }
                // Add footnote 2 contents to body if it's included in the post construction
                if (showFootnote2) {
                    body["footnote2"] = footnote2
                    body["explanation2"] = explanation2
                }
                const response = await api.post(`posts/`, body);
                // Go back to posts page
                setShowAddPostPage(false)
            } 
            catch (err) {
                console.log(err)
                // console.log(err)
                if (err.message.includes('400')) {
                    // Validation error (text length, invalid url, can only post once)
                    setPostErrorMessage(err.response.data.message)
                } else {
                    // Likely network error message
                    setErrorScreen(err.message)
                }
                setSubmitLoading(false)
                return
            } 
        }
        postAPICall();
    }

    // Change booleans to reflect visibility of footnotes
    function displayFootnotes() {
        if (!showFootnote1 && !showFootnote2) {
            setShowFootnote1(true)
            return
        }
        else if (showFootnote1) {
            setShowFootnote2(true)
        }
    }

    // Depending on whether or not the 2nd footnote is showing, either get rid of all footnotes or bump footnote 2 contents up to footnote 1
    function exitFootnote1() {
        if (showFootnote2) {
            setFootnote1(footnote2)
            setExplanation1(explanation2)
            setShowFootnote2(false)
        } 
        else {
            setFootnote1('')
            setExplanation1('')
            setShowFootnote1(false)
        }
        setFootnote2('')
        setExplanation2('')
    }

    // Clear footnote 2 contents
    function exitFootnote2() {
        setFootnote2('')
        setExplanation2('')
        setShowFootnote2(false)
    }

    return (
        <>
            <header onClick={() => setShowAddPostPage(false)} className="title-holder">
                <button className="back menu">←</button>
            </header>
            <div className="center-container">
                <form onSubmit={(e) => postClicked(e)} className="form-container">
                    <h2>Make a Post</h2>
                    <div className="textarea-container">
                        <textarea 
                            rows="4" 
                            cols="43" 
                            disabled={submitLoading}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Body text" 
                        />
                        <p className={text.length <= 150 ? "char-counter" : "char-counter-error"}>{text.length}/150 characters</p>
                    </div>
                    { showFootnote1 && 
                        <>
                            <div className="footnote-title-container">
                                <button className="menu x" type="button" onClick={exitFootnote1}>x</button>
                                <h4 className="footnote-title">Footnote 1</h4>
                            </div>
                            <input
                                type="text"
                                value={footnote1}
                                disabled={submitLoading}
                                onChange={(e) => setFootnote1(e.target.value)}
                                placeholder="Valid URL"
                            />
                            <div className="textarea-container">
                                <textarea 
                                    rows="3" 
                                    cols="43" 
                                    disabled={submitLoading}
                                    value={explanation1}
                                    onChange={(e) => setExplanation1(e.target.value)}
                                    placeholder="What this source shows"
                                />
                                <p className={explanation1.length <= 100 ? "char-counter" : "char-counter-error"}>{explanation1.length}/100 characters</p>
                            </div>
                        </>
                    }
                    { showFootnote2 && 
                        <>
                            <div className="footnote-title-container">
                                <button className="menu x" type="button" onClick={exitFootnote2}>x</button>
                                <h4 className="footnote-title">Footnote 2</h4>
                            </div>
                            <input
                                type="text"
                                value={footnote2}
                                disabled={submitLoading}
                                onChange={(e) => setFootnote2(e.target.value)}
                                placeholder="Valid URL"
                            />
                            <div className="textarea-container">
                                <textarea 
                                    rows="3" 
                                    cols="43" 
                                    disabled={submitLoading}
                                    value={explanation2}
                                    onChange={(e) => setExplanation2(e.target.value)}
                                    placeholder="What this source shows"
                                />
                                <p className={explanation2.length <= 100 ? "char-counter" : "char-counter-error"}>{explanation2.length}/100 characters</p>
                            </div>
                        </>
                    }
                    <button type="button" disabled={showFootnote1 && showFootnote2} className="menu footnote-button" onClick={displayFootnotes}>Footnote +</button>
                    <p className="input-error-message"> { postErrorMessage }</p>
                    <input type="submit" className="submit-button" disabled={submitLoading} value="Post" />
                </form> 
            </div>
        </>
    )
}
