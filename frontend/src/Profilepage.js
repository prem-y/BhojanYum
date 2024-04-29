import React from "react";
import { useLocation } from "react-router-dom";
const Profilepage = ({ userProfile }) => {
  const location = useLocation();
  const profile = location.state || {};
  return (
    <>
      <div className="flex items-center mx-96 my-56 border">
        <img
          src={profile.picture}
          alt="User"
          className="rounded h-32 w-32 object-cover shadow-lg m-4"
        />
        <div>
          <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
          <p className="mt-2 text-gray-600">{profile.email}</p>
          <p className="mt-2 text-gray-600"></p>
        </div>
      </div>
    </>
  );
};

export default Profilepage;
