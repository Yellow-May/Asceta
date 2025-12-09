import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = ({ isAccaddRoute }: { isAccaddRoute: boolean }) => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isAccaddRoute) {
    return (
      <>
        <header className="bg-transparent absolute top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Top Left: ASCETA Logo */}
              <div className="flex items-center">
                <Link to="/">
                  <img
                    src="/images/logo.png"
                    alt="ASCETA Logo"
                    className="h-16 w-16 rounded-full border-4 border-red-500 bg-white p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const fallback = document.createElement("div");
                      fallback.className =
                        "w-16 h-16 bg-white rounded-full border-4 border-red-500 flex items-center justify-center text-asceta-blue font-bold text-xs";
                      fallback.textContent = "ASCETA";
                      (e.target as HTMLImageElement).parentElement?.appendChild(
                        fallback
                      );
                    }}
                  />
                </Link>
              </div>
              {/* Top Right: Apply Now Button */}
              <div className="flex items-center gap-4">
                <Link
                  to={isAuthenticated ? "/accadd/payment" : "/accadd/auth"}
                  className="bg-white/10 text-white px-4 py-2 lg:px-6 lg:py-3 text-xs lg:text-sm transition-all hover:bg-white/20 transition-colors rounded-full"
                >
                  Apply Now &gt;
                </Link>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      {/* Top Blue Bar */}
      <div className="bg-asceta-blue text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex gap-4">
              <Link to="/" className="hover:underlin">
                ASCETA Home
              </Link>
              <Link
                to="/news"
                className="hover:underline hidden md:inline-block"
              >
                ASCETA News
              </Link>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/student/dashboard" className="hover:underline">
                    My Portal
                  </Link>
                  <button onClick={logout} className="hover:underline">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/student/login" className="hover:underline">
                  My Portal
                </Link>
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
                  (e.target as HTMLImageElement).style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className =
                    "w-16 h-16 bg-asceta-blue rounded-full flex items-center justify-center text-white font-bold";
                  fallback.textContent = "ASCETA";
                  (e.target as HTMLImageElement).parentElement?.appendChild(
                    fallback
                  );
                }}
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-asceta-blue">
                  ABIA STATE COLLEGE OF EDUCATION (TECHNICAL) AROCHUKWU
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link to="/about" className="hover:text-asceta-blue">
                About
              </Link>
              <Link to="/admission" className="hover:text-asceta-blue">
                Admission
              </Link>
              <Link to="/academics" className="hover:text-asceta-blue">
                Academics
              </Link>
              <Link to="/leadership" className="hover:text-asceta-blue">
                Leadership
              </Link>
              <Link to="/news" className="hover:text-asceta-blue">
                News
              </Link>
              <Link to="/events" className="hover:text-asceta-blue">
                Events
              </Link>
            </nav>
            <button
              className="md:hidden text-asceta-blue text-2xl focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col gap-4 pt-4">
                <Link
                  to="/about"
                  className="text-asceta-blue hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/admission"
                  className="text-asceta-blue hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admission
                </Link>
                <Link
                  to="/academics"
                  className="text-asceta-blue hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Academics
                </Link>
                <Link
                  to="/leadership"
                  className="text-asceta-blue hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Leadership
                </Link>
                <Link
                  to="/news"
                  className="text-asceta-blue hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  News
                </Link>
                <Link
                  to="/events"
                  className="text-asceta-blue hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Events
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
