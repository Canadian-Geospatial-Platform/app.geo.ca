import './dispatch/dispatchsignin.scss'
import React, { useEffect } from "react";
import { requireLogin, getToken } from './utils/authorization';

export default function TestPage(): JSX.Element {
  useEffect(() => {
    const fetchData = async () => {
      await requireLogin(getToken(), window.location.origin + '/receivesignin', window.location.href);
    }
    fetchData()
  }, [requireLogin]);


  return <h1 className="sign-in">Please wait while you are being redirected to the sign-in page.</h1>;
}
