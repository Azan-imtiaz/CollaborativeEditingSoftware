import React, { useEffect, useState } from 'react';
import logo2 from "../images/logo2.png";
import { RiSearchLine } from "react-icons/ri";
import Avatar from 'react-avatar';
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  const getUser = () => {

    fetch(api_base_url + "/users/getUser", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          setData(data.user);
        }
      });
  };

  const logout = () => {
    fetch(api_base_url + "/users/logout", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          navigate("/login");
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="navbar flex items-center px-[100px] h-[90px] justify-between bg-[#f0ecee]">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src={logo2} alt="Logo" className="h-[50px]" />
          <h2 className="text-xl font-medium text-gray-700">AzanDocs</h2>
        </div>
  
        {/* Right Section */}
        <div className="right flex items-center justify-end gap-4">
          <div className="inputBox flex items-center border border-gray-300 rounded-lg px-3 h-[40px]">
            <i className="text-gray-500 text-lg"><RiSearchLine /></i>
            <input
              type="text"
              placeholder="Search Here... !"
              className="outline-none ml-2 w-full bg-transparent text-gray-700 text-sm"
            />
          </div>
  
          <button
            onClick={logout}
            className="p-2 min-w-[100px] bg-red-500 text-white rounded-lg transition-all hover:bg-red-600"
          >
            Logout
          </button>
  
          <Avatar
            name={data ? data.name : ""}
            className="cursor-pointer"
            size="40"
            round="50%"
          />
        </div>
      </div>
    </>
  );
  
};

export default Navbar;
