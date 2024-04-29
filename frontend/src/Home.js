import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Card = ({ user, food }) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    if(!user.name){
      navigate('/signin');
    }
    else{
      navigate('/cart', {state: [user,food]})
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        className="w-full h-64 object-cover object-center"
        src={food.image}
        alt="card"
      />
      <div className="p-4">
        <h1 className="text-gray-900 font-bold text-xl mb-2">{food.name}</h1>
        <p className="text-gray-700 text-base mx-0.5">Price: ₹{food.price}</p>
      </div>
      <button className=" border w-full border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 font-bold py-2 rounded"
      onClick={()=>handleClick(food._id)}
      >
        +Add
      </button>
    </div>
  );
};

const Home = ({ p }) => {
  const location = useLocation();
  const profile = location.state || {};
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/foods/${category}`
        );
        setFoods(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [category]);

  const handleSearch = () => {};

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setFilteredFoods([]); // Reset filtered foods when category changes
  };

  useEffect(() => {
    // Filter foods based on selected category
    const filterFoodsByCategory = () => {
      if (category) {
        const filtered = foods.filter((food) => food.category === category);
        setFilteredFoods(filtered);
      } else {
        setFilteredFoods(foods); // If no category selected, display all foods
      }
    };

    filterFoodsByCategory();
  }, [category, foods]);

  return (
    <>
      <NavBar profile={profile} />

      {/* search field */}
      <div className="flex justify-between">
        <div className="container mx-28 p-4">
          <input
            id="search"
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
            onChange={handleSearch}
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline">
            Search
          </button>
        </div>
        <div className="flex space-x-4 container p-2 ">
          <button
            className={`px-4 py-2 bg-blue-200 text-white rounded-lg ${
              category === "" ? "bg-blue-600" : "bg-blue-200"
            } hover:bg-blue-600`}
            onClick={() => handleCategoryChange("")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 bg-blue-200 text-white rounded-lg ${
              category === "Veg" ? "bg-blue-600" : "bg-blue-200"
            } hover:bg-blue-600`}
            onClick={() => handleCategoryChange("Veg")}
          >
            Veg
          </button>
          <button
            className={`px-4 py-2 bg-blue-200 text-white rounded-lg ${
              category === "Non-veg" ? "bg-blue-600" : "bg-blue-200"
            } hover:bg-blue-600`}
            onClick={() => handleCategoryChange("Non-veg")}
          >
            Non-veg
          </button>
          <button
            className={`px-4 py-2 bg-blue-200 text-white rounded-lg ${
              category === "Dessert" ? "bg-blue-600" : "bg-blue-200"
            } hover:bg-blue-600`}
            onClick={() => handleCategoryChange("Dessert")}
          >
            Dessert
          </button>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Render each food item as a Card */}
          {foods.map((food) => (
            <>
              <Card
                user = {profile}
                food={food}
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
