import React, { Children, useState } from "react";
import { Link } from "react-router-dom";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import avatarImg from "../assets/avatar.png";
import { useSelector } from "react-redux";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItems = useSelector (state => state.cart.cartItems);

  const currentUser = false;
  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* left side */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <HiBars3CenterLeft className="size-6" />
          </Link>

          {/* search input */}
          <div className="relative flex-1 max-w-xs">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search here"
              className="bg-[#EAEAEA] w-full py-1 pl-10 pr-4 rounded-md focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* right side */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          <div>
            {
              <div>
                {currentUser ? (
                  <>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                      <img
                        src={avatarImg}
                        alt=""
                        className={`size-7 rounded-full ${
                          currentUser ? "ring-2 ring-blue-500" : ""
                        }`}
                      />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                        <ul className="py-2">
                          {navigation.map((item) => (
                            <li key={item.name} onClick={()=> setIsDropdownOpen(false)}>
                              <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">{item.name}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login">
                    {" "}
                    <HiOutlineUser className="size-6" />
                  </Link>
                )}
              </div>
            }
          </div>

          <button className="hidden sm:block">
            <HiOutlineHeart className="size-6" />
          </button>

          <Link
            to="/cart"
            className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-md"
          >
            <HiOutlineShoppingCart className="" />
            {
              cartItems.length > 0 ? <span className="text-sm font semibold sm:ml-1">{cartItems.length}</span> : <span className="text-sm font semibold sm:ml-1">0</span>
            }
            
            {/* <span className="text-sm font semibold sm:ml-1">0</span> */}

          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;