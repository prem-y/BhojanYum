import React from 'react'
import { googleLogout} from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
const NavBar = ({profile}) => {
    const navigate = useNavigate();
    const logOut = () => {
        googleLogout();
        navigate('/')
    };
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-white text-xl font-bold">BhojanYum</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700">Home</a>
            <a href="/about" className="text-white px-3 py-2 rounded-md hover:bg-gray-700">About</a>
            <a href="/user-profile" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 flex">
                <div className=''><img src={profile.picture} alt="" className='h-10 rounded' /></div>
                <div className='mt-2 ml-3'>{profile.name}</div>
            </a>
            <button onClick={logOut} className='text-white p-3 hover:bg-red-400 rounded'>Log out</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar