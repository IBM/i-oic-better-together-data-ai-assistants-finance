import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import "./Navbar.css"
import logo from "../assets/images/logo.png";

export default function Navbar() {
  const { logoutAuth, screen } = useAuth();

  return (
    <div>
      <nav className="flex flex-col items-center mb-6">
        <NavLink to="/" className="text-center">
          <img alt="bank logo" className="h-40 mx-auto" src={logo} />
        </NavLink>
        <NavLink to="/" className="font-bold">
          Welcome to Oceanic Bank
        </NavLink>
      </nav>
      <nav className="flex justify-between items-center w-full">
        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-sky-100 hover:bg-sky-200 h-9 rounded-md px-3" to="/create">
          Request Personal Loan
        </NavLink>

        <input
          type="button"
          value="Logout"
          onClick={logoutAuth}
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-sky-100 hover:bg-sky-200 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer"
        />
      </nav>
    </div>
  );
}
