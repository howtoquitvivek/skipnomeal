import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Meals from "./pages/Meals";
import Layout from "./components/layout/Layout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AddMeal from "./pages/AddMeal";
import AddFood from "./pages/AddFood";
import Foods from "./pages/Foods";

const App = () => {
  return (
    <Router>
      {/* Main container with dark theme */}
      <div className="min-h-screen bg-deep-space">
        {/* Animated background elements (optional) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Router content with glass panel effect */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route 
                path="/register" 
                element={
                  <div className="glass-card max-w-md mx-auto mt-10 p-8 rounded-2xl">
                    <Register />
                  </div>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <div className="glass-card max-w-md mx-auto mt-10 p-8 rounded-2xl">
                    <Login />
                  </div>
                } 
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="glass-card rounded-2xl p-6">
                      <Dashboard />
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/meal"
                element={
                  <ProtectedRoute>
                    <div className="glass-card rounded-2xl p-6">
                      <Meals />
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-meal"
                element={
                  <ProtectedRoute>
                    <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto">
                      <AddMeal />
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/food"
                element={
                  <ProtectedRoute>
                    <div className="glass-card rounded-2xl p-6">
                      <Foods />
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-food"
                element={
                  <ProtectedRoute>
                    <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
                      <AddFood />
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto">
                      <Profile />
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto">
                      <Settings />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;