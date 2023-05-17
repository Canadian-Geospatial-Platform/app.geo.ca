import './dispatchsignin.scss'
import React, { useEffect } from "react";
import { requireLogin } from '../utils/authorization';

function getToken() {
  try {
    const storedToken = sessionStorage.getItem('token')
    if (storedToken) {
      const token = JSON.parse(storedToken);
      return token;
    }
    return null
  } catch (error) {
    return null;
  }
}

export default function DispatchSignIn(): JSX.Element {
  useEffect(() => {
    console.log("init");
    // window.location.href = "https://auth-dev.geo.ca/oauth2/authorize?client_id=7b4mbo0osnfb6cer4f980kob0t&response_type=code&scope=openid&redirect_uri=http://localhost:8080/receivesignin";
    const fetchData = async () => {
      console.log("init2" + window.location.href);

      await requireLogin(getToken(), window.location.origin + '/receivesignin', window.location.href);
    }
    fetchData()
  }, [requireLogin]);


  return <h1 className="sign-in">Please wait while you are being redirected to the sign-in page.</h1>;
}
