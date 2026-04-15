import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar onLogout={logout} />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 pt-16 md:pt-0">
        <Topbar onLogout={logout}/>

        <div className="p-4 md:p-6 overflow-auto pt-20 md:pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;