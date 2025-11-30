import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      {/* Top Blue Bar */}
      <div className="bg-asceta-blue text-white py-2">
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
              <img
                src="/images/logo.png"
                alt="ASCETA Logo"
                className="h-16 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-16 h-16 bg-asceta-blue rounded-full flex items-center justify-center text-white font-bold';
                  fallback.textContent = 'ASCETA';
                  (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-asceta-blue">
                  ABIA STATE COLLEGE OF EDUCATION (TECHNICAL) AROCHUKWU
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link to="/about" className="hover:text-asceta-blue">About</Link>
              <Link to="/admission" className="hover:text-asceta-blue">Admission</Link>
              <Link to="/academics" className="hover:text-asceta-blue">Academics</Link>
              <Link to="/leadership" className="hover:text-asceta-blue">Leadership</Link>
              <Link to="/news" className="hover:text-asceta-blue">News</Link>
              <Link to="/events" className="hover:text-asceta-blue">Events</Link>
            </nav>
            <button className="md:hidden">☰</button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

