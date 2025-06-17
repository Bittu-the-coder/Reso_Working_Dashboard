import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/20 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} MMMUT RESO. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
