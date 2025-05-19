export default function Profile() {
  const user = {
    name: "Vivek",
    email: "vivek@example.com",
    age: 22,
    gender: "Male",
    height: 175, // in cm
    weight: 68,  // in kg
    goal: "Maintain Weight",
    activityLevel: "Moderate",
  };

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
          <label className="text-gray-600">Age</label>
          <p className="font-medium">{user.age}</p>
        </div>
        <div>
          <label className="text-gray-600">Gender</label>
          <p className="font-medium">{user.gender}</p>
        </div>
        <div>
          <label className="text-gray-600">Height</label>
          <p className="font-medium">{user.height} cm</p>
        </div>
        <div>
          <label className="text-gray-600">Weight</label>
          <p className="font-medium">{user.weight} kg</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">🎯 Goals & Preferences</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600">Fitness Goal</label>
          <p className="font-medium">{user.goal}</p>
        </div>
        <div>
          <label className="text-gray-600">Activity Level</label>
          <p className="font-medium">{user.activityLevel}</p>
        </div>
      </div>

      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
