import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
const Cart = ({ c }) => {
  const location = useLocation();
  const item = location.state || {};
  const [hide, setHide] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [address, setAddress] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verified, setverified] = useState(false);
  const handleChange1 = (event) => {
    setPhoneNumber(event.target.value);
  };
  const handleChange2 = (event) => {
    setOtp(event.target.value);
  };
  const handleChange3 = (event) => {
    setAddress(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    if (!verified) {
      setErrorMessage("Please verify OTP before placing the order.");
      return;
    }
    if (!address.trim()) {
      setErrorMessage("Please enter your address.");
      return;
    }
    const orderData = {
      image: item[1].image,
      name: item[1].name,
      description: item[1].description,
      price: item[1].price,
      category: item[1].category,
      username: item[0].name, 
      email: item[0].email, 
      phone: phoneNumber,
      address: address,
      status: "pending",
    };

    try {
   
      const response = await fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order placed successfully:", data.message);
        alert("Ok");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage("Failed to place order. Please try again.");
    }
  };

  const handleClick1 = async () => {
    if (phoneNumber > 0) {
      try {
        const response = await fetch("http://localhost:4000/sendotp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber }),
        });

        const data = await response.json();

        if (response.ok) {
          setOtpSent(true);
          alert(`OTP sent successfully: ${data.msg}`);
        } else {
          setErrorMessage(data.msg);
        }
        setHide(false);
      } catch (error) {
        setErrorMessage("Failed to send OTP");
        console.error("Error sending OTP:", error);
      }
    }
  };

  const handleClick2 = async () => {
    try {
      const response = await fetch("http://localhost:4000/verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          otp: otp,
        }),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setVerificationResult(data.msg);
        setverified(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.msg);
      }
    } catch (error) {
      setErrorMessage("Failed to verify OTP");
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <>
      <NavBar profile={item[0]} />
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mx-96 mt-32 border">
          <img
            src={item[1].image}
            alt="User"
            className="rounded h-32 w-32 object-cover shadow-lg m-4"
          />
          <div>
            <div className="text-xl font-bold">{item[1].name}</div>
            <div>Price: ₹{item[1].price}</div>
            <div>Delivery: ₹45</div>
            <div>GST: ₹{Math.round(item[1].price * 0.18)}</div>
            <hr />
            <div>
              Total: ₹
              {Math.round(
                parseInt(item[1].price) + parseInt(item[1].price) * 0.18 + 45
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col mx-96 mt-4">
          <label>Enter Address</label>
          <textarea
            onChange={handleChange3}
            required
            name="Address"
            id=""
            cols="30"
            rows="3"
            className="w-full p-3 text-base border border-gray-300 rounded resize-y focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="flex flex-col mx-96 mt-4">
          <label>Phone number</label>
          <div className="flex">
            <input
              type="text"
              className={`p-3 text-base border border-gray-300 rounded resize-y focus:outline-none focus:border-blue-500 ${
                hide === false ? "cursor-not-allowed opacity-50" : ""
              }`}
              onChange={handleChange1}
              disabled={!hide}
              value={phoneNumber}
              placeholder="+91"
              required
            />
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline ${
                hide === false ? "hidden" : ""
              }`}
              onClick={() => handleClick1()}
            >
              Verify
            </button>
          </div>
          <div
            className={`${hide === true ? "hidden" : ""} ${
              verified === true ? "hidden" : ""
            } flex flex-col mt-4`}
          >
            <label>Enter the OTP</label>
            <div className="">
              <input
                type="text"
                onChange={handleChange2}
                value={otp}
                className="p-3 text-base border border-gray-300 rounded resize-y focus:outline-none focus:border-blue-500"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 mx-2 rounded focus:outline-none focus:shadow-outline"
                onClick={handleClick2}
              >
                Verify
              </button>
              <div
                className={`${
                  verified === false ? "mt-2 text-red-400" : "hidden"
                }`}
              >
                {errorMessage}
              </div>
            </div>
          </div>
          <div
            className={`${
              verified === true ? "mt-2 text-green-400" : "hidden"
            }`}
          >
            {verificationResult}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Place Order ₹
            {Math.round(
              parseInt(item[1].price) + parseInt(item[1].price) * 0.18 + 45
            )}{" "}
          </button>
        </div>
      </form>
    </>
  );
};

export default Cart;
