import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  publicRoutes,
  privateRoutes,
  adminRoutes,
  ownerRoutes,
} from "./navigation";
import { Container } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { twMerge } from "tailwind-merge";
import { BiLogOut, BiUserCircle } from "react-icons/bi";

function Navbar() {
  const location = useLocation();
  const { isAuth, signout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-200 border-b border-gray-300 shadow-md">
      <Container className="flex justify-between py-3">
        <Link to="/welcome">
          <h1 className="font-bold text-2xl text-blue-600">FAST-ROUTE</h1>
        </Link>

        <ul className="flex items-center justify-center md:gap-x-1">
          {isAuth ? (
            <>
              {privateRoutes.map(({ path, name, icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={twMerge(
                      "text-gray-800 flex items-center px-3 py-1 gap-x-1 rounded-md hover:bg-blue-100 hover:text-blue-600",
                      location.pathname === path &&
                      "bg-blue-100 text-blue-600 font-semibold"
                    )}
                  >
                    {icon}
                    <span className="hidden sm:block">{name}</span>
                  </Link>
                </li>
              ))}

              {(user?.role === "admin" || user?.role === "owner") &&
                ownerRoutes.map(({ path, name, icon }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={twMerge(
                        "text-green-700 flex items-center px-3 py-1 gap-x-1 rounded-md hover:bg-green-100",
                        location.pathname === path &&
                        "bg-green-100 text-green-800 font-semibold"
                      )}
                    >
                      {icon}
                      <span className="hidden sm:block">{name}</span>
                    </Link>
                  </li>
                ))}

              {user?.role === "admin" &&
                adminRoutes.map(({ path, name, icon }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={twMerge(
                        "text-yellow-700 flex items-center px-3 py-1 gap-x-1 rounded-md hover:bg-yellow-100",
                        location.pathname === path &&
                        "bg-yellow-100 text-yellow-800 font-semibold"
                      )}
                    >
                      {icon}
                      <span className="hidden sm:block">{name}</span>
                    </Link>
                  </li>
                ))}

              <li ref={dropdownRef} className="relative">
                <div
                  className="flex items-center gap-x-2 cursor-pointer text-gray-800 px-3 py-1 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <BiUserCircle className="w-6 h-6 text-gray-700" />
                  <span className="font-medium">{user.name}</span>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BiUserCircle className="inline-block w-5 h-5 mr-2" />
                      Perfil
                    </Link>
                    <button
                      onClick={() => {
                        signout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    >
                      <BiLogOut className="inline-block w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </li>

            </>
          ) : (
            publicRoutes.map(({ path, name }) => (
              <li
                className={twMerge(
                  "text-gray-800 flex items-center px-3 py-1 rounded-md hover:bg-blue-100 hover:text-blue-600",
                  location.pathname === path &&
                  "bg-blue-100 text-blue-600 font-semibold"
                )}
                key={path}
              >
                <Link to={path}>{name}</Link>
              </li>
            ))
          )}
        </ul>
      </Container>
    </nav>
  );
}

export default Navbar;
