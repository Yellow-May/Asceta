import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Admission from './pages/public/Admission';
import Academics from './pages/public/Academics';
import NewsList from './pages/public/NewsList';
import NewsDetail from './pages/public/NewsDetail';
import EventsList from './pages/public/EventsList';
import EventDetail from './pages/public/EventDetail';
import Contact from './pages/public/Contact';
import Leadership from './pages/public/Leadership';

// Student pages
import Login from './pages/student/Login';
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/admission" element={<Admission />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/student/login" element={<Login />} />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

