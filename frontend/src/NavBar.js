import React from "react";
import { googleLogout } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const NavBar = ({ profile }) => {
  const navigate = useNavigate();
  const logOut = () => {
    googleLogout();
    navigate("/");
  };
  const handleClick = () => {
    navigate("/profile", { state: profile });
  };
  return (
    <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button  className="mt-3"
            onClick={() => {
              navigate("/", { state: profile });
            }}
            >
              <img src="./assets/BhojanYum_logo.jpg" alt="" width="200px" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                navigate("/", { state: profile });
              }}
              className="px-3 py-2 hover:border-b-4 hover:border-black"
            >
              Home
            </button>
            <Link
              to="/about"
              className="px-3 py-2 hover:border-b-4 hover:border-black"
            >
              About
            </Link>

            {profile.name ? (
              <>
                <button
                  onClick={() => handleClick()}
                  className="px-3 py-2 rounded-md hover:bg-gray-700 flex"
                >
                  <div className="">
                    <img
                      src={profile.picture}
                      alt=""
                      className="h-10 rounded"
                    />
                  </div>
                  <div className="mt-2 ml-3">{profile.name}</div>
                </button>
                <button
                  onClick={logOut}
                  className="p-3 hover:bg-red-400 rounded"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="p-2 border rounded-full border-solid border-black hover:bg-green-400 hover:border-none"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
