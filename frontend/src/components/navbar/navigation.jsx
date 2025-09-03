import { MdInventory2,MdAccessTime  } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaRoute } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";

export const publicRoutes = [
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Login",
    path: "/login",
  },
  {
    name: "Register",
    path: "/register",
  },
];

export const privateRoutes = [
  {
    name: "Packages",
    path: "/packages",
    icon: <MdInventory2 className="w-5 h-5" />, 
  },
  {
    name: "Routes",
    path: "/routes",
    icon: <FaRoute className="w-5 h-5" />, 
  },
  {
    name: "Support",
    path: "/support",
    icon: <BiSupport className="w-5 h-5" />,
  },
  {
    name: "Time Tracking",
    path: "/clock",
    icon: <MdAccessTime className="w-5 h-5" />,
  },
];

export const adminRoutes = [
  {
    name: "Admin Dashboard",
    path: "/admin-dashboard",
    icon: <MdAdminPanelSettings className="w-5 h-5" />,
  },
];

export const ownerRoutes = [
  {
    name: "My Company",
    path: "/owner/my-companies",
    icon: <FaBuilding className="w-5 h-5" />,
  },
];
