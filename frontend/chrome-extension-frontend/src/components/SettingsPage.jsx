import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function SettingsPage() {
    const { setErrorScreen } = useContext(UserContext)

    return (
        <>
            settings
        </>
    )
}
