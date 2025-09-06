import React from "react";
const Header = () => {
  return (
    <>
      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-2 shadow-md flex justify-between items-center px-5">
        <a href="/">
          <img src="/logo.png" className="h-9" />
        </a>
      </div>
    </>
  );
};

export default Header;
