import React from 'react'
import { GoogleLogout } from '@react-oauth/google';
const clientId = "775372399424-vujb76qg26ttmh6i0u4l00fhdojen2e6.apps.googleusercontent.com";
const Logout = () => {
    const onSuccess = ()=>{
        console.log("Logout successful!");
    }
  return (
    <>
        <div id="signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText={"Logout"}
                onLogoutSuccess={onSuccess}
            />
        </div>
    </>
  )
}

export default Logout