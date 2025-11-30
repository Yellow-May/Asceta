import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Name</label>
            <p className="text-lg text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <p className="text-lg text-gray-900">{user?.email}</p>
          </div>
          {user?.staffId && (
            <div>
              <label className="block text-sm font-semibold text-gray-700">Staff ID</label>
              <p className="text-lg text-gray-900">{user.staffId}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Role</label>
            <p className="text-lg text-gray-900 capitalize">{user?.role}</p>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-admin-blue text-white px-6 py-2 rounded hover:bg-admin-dark-blue">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;



