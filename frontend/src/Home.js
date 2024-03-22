import React from 'react'
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
const Home = () => {
    const location = useLocation(); 
    const  profile = location.state || {};
    
  return (
    <>
        {profile.name? (
            <div>
            <NavBar profile= {profile}/>
        </div>
        ): (
            <div className='text-red-600 text-4xl'>You have not Logged In!</div>
        )

        }
        
        
    </>
  )
}

export default Home