import { api } from "../utilities.jsx";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EmailActivationPage() {
    const { token } = useParams();
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function tryActivateEmail() {
            try {
                const response = await api.put(`users/validation/${token}/`);
                setMessage(response.data.message)
            } 
            catch (err) {
                console.log(err)
                console.log(err.message)
                setMessage(err.message)
            } 
        }
        tryActivateEmail()
    }, []);

    return (
        <>
        <h3>{message}</h3>
        </>
    );
}
