import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdmissionApply = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [examType, setExamType] = useState('');
  const [jambRegNo, setJambRegNo] = useState('');
  const [waecRegNo, setWaecRegNo] = useState('');
  const [waecExamDate, setWaecExamDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate exam-specific fields
      if (examType === 'jamb' && !jambRegNo.trim()) {
        setError('JAMB Registration Number is required');
        setLoading(false);
        return;
      }

      if (examType === 'waec' && (!waecRegNo.trim() || !waecExamDate)) {
        setError('WAEC Registration Number and Exam Date are required');
        setLoading(false);
        return;
      }

      const payload: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        examType,
      };

      if (examType === 'jamb') {
        payload.jambRegNo = jambRegNo.trim();
      } else if (examType === 'waec') {
        payload.waecRegNo = waecRegNo.trim();
        payload.waecExamDate = waecExamDate;
      }

      const response = await api.post('/admission/apply', payload);

      if (response.data.token) {
        // Store token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      setSuccess('Application submitted successfully! Redirecting...');

      // Redirect to student dashboard or a success page
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Admission application error:', err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message?.includes('Failed to fetch') || err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend server is running at http://localhost:5000');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Apply for Admission
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            NCE Program Application Portal
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                placeholder="Create a password (min. 6 characters)"
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="examType"
                className="block text-sm font-medium text-gray-700"
              >
                Examination Type
              </label>
              <select
                id="examType"
                name="examType"
                required
                value={examType}
                onChange={(e) => {
                  setExamType(e.target.value);
                  // Reset exam-specific fields when changing type
                  setJambRegNo('');
                  setWaecRegNo('');
                  setWaecExamDate('');
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
              >
                <option value="">Select examination type</option>
                <option value="jamb">JAMB</option>
                <option value="waec">WAEC</option>
              </select>
            </div>

            {examType === 'jamb' && (
              <div>
                <label
                  htmlFor="jambRegNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  JAMB Registration Number
                </label>
                <input
                  id="jambRegNo"
                  name="jambRegNo"
                  type="text"
                  required
                  value={jambRegNo}
                  onChange={(e) => setJambRegNo(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                  placeholder="Enter your JAMB registration number"
                />
              </div>
            )}

            {examType === 'waec' && (
              <>
                <div>
                  <label
                    htmlFor="waecRegNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    WAEC Registration Number
                  </label>
                  <input
                    id="waecRegNo"
                    name="waecRegNo"
                    type="text"
                    required
                    value={waecRegNo}
                    onChange={(e) => setWaecRegNo(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    placeholder="Enter your WAEC registration number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="waecExamDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    WAEC Exam Date
                  </label>
                  <input
                    id="waecExamDate"
                    name="waecExamDate"
                    type="date"
                    required
                    value={waecExamDate}
                    onChange={(e) => setWaecExamDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-asceta-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-asceta-blue ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processing...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <a
            href="/admission"
            className="text-sm text-asceta-blue hover:underline"
          >
            ← Back to Admission Information
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdmissionApply;
