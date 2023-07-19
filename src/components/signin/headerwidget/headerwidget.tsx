import AccountIcon from '@material-ui/icons/AccountBox';
import React, { useEffect, useState } from "react";
import { getIdToken, requireLogin } from '../utils/authorization';
import { parseJwt } from '../utils/parse-jwt';

export default function HeaderWidget(): JSX.Element {
    const fetchData = async () => {
        await requireLogin(window.location.origin + '/receivesignin', window.location.href);
    }

    const [loggedIn, set_loggedIn] = useState(false);
    const [loggedInMessage, set_loggedInMessage] = useState("Logged In!");
    let loginButton;

    if (!loggedIn) {
        loginButton = <button type="button" className="button button-primary" style={{
            "background-color": "blue", 
            "border-radius": "0.25rem",
            "color": 'white',
            "padding": '0.55em 1em',
    }} onClick={fetchData}>Sign in</button>
    } else {
        loginButton = <button type="button" className="button button-primary"><AccountIcon />{loggedInMessage}</button>
    }

    useEffect(() => {
        let token = getIdToken()
        if (token != null) {
            set_loggedIn(true)
            console.log("token is\n", token, "\n", parseJwt(token))
            set_loggedInMessage("Signed in as " + parseJwt(token).name + ".")
        }
    }, [getIdToken()]);



    return (<div>
        {loginButton}
    </div>);
}

// mardi 4 juillet 16h15