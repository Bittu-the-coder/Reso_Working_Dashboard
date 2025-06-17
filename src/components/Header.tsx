import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="bg-white/10 backdrop-blur-lg shadow text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">MMMUT RESO Dashboard</h1>
        {!isHomePage && (
          <Link
            to="/"
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors border border-white/20"
          >
            Back to Home
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
