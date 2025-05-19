import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Dark theme background with gradient */}
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <AuthProvider>
        <App />
        
        {/* Styled Toaster with glass effect */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'glass-card',
            style: {
              background: 'rgba(39, 39, 42, 0.8)',
              backdropFilter: 'blur(10px)',
              color: '#f3f4f6',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
            },
            success: {
              iconTheme: {
                primary: '#4ade80', // green-400
                secondary: '#1e1e1e'
              }
            },
            error: {
              iconTheme: {
                primary: '#f87171', // red-400
                secondary: '#1e1e1e'
              }
            },
            duration: 4000
          }}
        />
      </AuthProvider>
      
      {/* Optional animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </div>
  </React.StrictMode>
);