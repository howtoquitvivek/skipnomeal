import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Utensils, 
  Apple, 
  User, 
  Settings,
  Salad
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Meals", path: "/meal", icon: Utensils },
  { name: "Food Items", path: "/food", icon: Apple },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen fixed left-0 top-0 p-3 backdrop-blur-sm">
      <div className="glass-card h-full rounded-xl border border-gray-700/50 flex flex-col overflow-hidden">
        <div className="flex items-center space-x-3 p-5 border-b border-gray-700/50">
          <Salad className="w-7 h-7 text-green-400" />
          <h1 className="text-xl font-bold text-white">MacroApp</h1>
        </div>
        
        <ul className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-500/20 text-blue-300" 
                      : "text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="p-4 border-t border-gray-700/50">
          <div className="text-sm text-gray-400">v1.0.0</div>
        </div>
      </div>
    </div>
  );
}