import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/profile/EditProfileModal";

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goal?: string;
  activityLevel?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        setUser(data.user);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setShowEditModal(false);
  };

  if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-3xl font-semibold mb-6 border-b pb-2">👤 Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-gray-600">Name</label>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <label className="text-gray-600">Email</label>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <label className="text-gray-600">Phone</label>
          <p className="font-medium">{user.phone || "Not set"}</p>
        </div>
        <div>
          <label className="text-gray-600">Age</label>
          <p className="font-medium">{user.age || "Not set"}</p>
        </div>
        <div>
          <label className="text-gray-600">Height (cm)</label>
          <p className="font-medium">{user.height || "Not set"} cm</p>
        </div>
        <div>
          <label className="text-gray-600">Weight (kg)</label>
          <p className="font-medium">{user.weight || "Not set"} kg</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
}
