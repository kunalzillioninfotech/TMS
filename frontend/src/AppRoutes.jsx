import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const [userType, setUserType] = useState("employee");
    const [isOpen, setIsOpen] = useState(true);
  
    useEffect(() => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserType(decoded.role || "employee");
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    }, []);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", visibleTo: ["employee", "super_admin"] },
    { label: "Tasks", path: "/tasks", visibleTo: ["employee", "super_admin"] },
    { label: "Manage Users", path: "/manage-users", visibleTo: ["super_admin"] },
    { label: "Reports", path: "/reports", visibleTo: ["super_admin"] },
    { label: "Profile", path: "/profile", visibleTo: ["employee", "super_admin"] },
  ];

  return (
    <nav className="flex-1 px-4 py-6">
      {menuItems.map(
        (item) =>
          item.visibleTo.includes(userType) && (
            <Link key={item.label} to={item.path}>
              <div
                className={`p-2 my-1 rounded cursor-pointer ${
                  location.pathname === item.path ? "bg-gray-300 font-bold" : "hover:bg-gray-200"
                }`}
              >
                {item.label}
              </div>
            </Link>
          )
      )}
    </nav>
  );
};