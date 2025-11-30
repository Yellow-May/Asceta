import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      {/* Top Green Bar */}
      <div className="bg-asceta-green text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex gap-4">
              <Link to="/" className="hover:underline">ASCETA Home</Link>
              <Link to="/news" className="hover:underline">ASCETA News</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
            </div>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/student/dashboard" className="hover:underline">My Portal</Link>
                  <button onClick={logout} className="hover:underline">Logout</button>
                </>
              ) : (
                <Link to="/student/login" className="hover:underline">My Portal</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-asceta-green rounded-full flex items-center justify-center text-white font-bold">
                ASCETA
              </div>
              <div>
                <h1 className="text-xl font-bold text-asceta-green">
                  ABIA STATE COLLEGE OF EDUCATION (TECHNICAL) AROCHUKWU
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link to="/about" className="hover:text-asceta-green">About</Link>
              <Link to="/admission" className="hover:text-asceta-green">Admission</Link>
              <Link to="/academics" className="hover:text-asceta-green">Academics</Link>
              <Link to="/leadership" className="hover:text-asceta-green">Leadership</Link>
              <Link to="/news" className="hover:text-asceta-green">News</Link>
              <Link to="/events" className="hover:text-asceta-green">Events</Link>
            </nav>
            <button className="md:hidden">☰</button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

