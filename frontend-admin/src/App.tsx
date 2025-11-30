import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewsList from './pages/news/NewsList';
import NewsForm from './pages/news/NewsForm';
import EventsList from './pages/events/EventsList';
import EventsForm from './pages/events/EventsForm';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="flex-1 bg-gray-100">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/news" element={<NewsList />} />
                        <Route path="/news/new" element={<NewsForm />} />
                        <Route path="/news/:id/edit" element={<NewsForm />} />
                        <Route path="/events" element={<EventsList />} />
                        <Route path="/events/new" element={<EventsForm />} />
                        <Route path="/events/:id/edit" element={<EventsForm />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;



