import './receivesignin.scss'
import React, { useEffect } from "react";
export default function ReceiveSignIn(): JSX.Element {
       useEffect(() => {
    // window.location.href = "https://auth-dev.geo.ca/oauth2/authorize?client_id=7b4mbo0osnfb6cer4f980kob0t&response_type=code&scope=openid&redirect_uri=http://localhost:8080/receivesignin";
  }, []);
  
    return <h1 className="receivesignin">Receiving sign in.</h1>;
}
