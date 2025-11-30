import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>
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
          {user?.studentId && (
            <div>
              <label className="block text-sm font-semibold text-gray-700">Student ID</label>
              <p className="text-lg text-gray-900">{user.studentId}</p>
            </div>
          )}
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
          <button className="bg-asceta-green text-white px-6 py-2 rounded-lg hover:bg-asceta-dark-green">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

