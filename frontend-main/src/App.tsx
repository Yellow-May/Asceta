import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Public pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Admission from "./pages/public/Admission";
import AdmissionApply from "./pages/public/AdmissionApply";
import Academics from "./pages/public/Academics";
import NewsList from "./pages/public/NewsList";
import NewsDetail from "./pages/public/NewsDetail";
import EventsList from "./pages/public/EventsList";
import EventDetail from "./pages/public/EventDetail";
import Contact from "./pages/public/Contact";
import Leadership from "./pages/public/Leadership";

// Student pages
import Login from "./pages/student/Login";
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";

// ACCADD pages
import ACCADDLanding from "./pages/public/ACCADD/Landing";
import ACCADDAuth from "./pages/public/ACCADD/Auth";
import ACCADDPayment from "./pages/public/ACCADD/Payment";
import ACCADDForm from "./pages/public/ACCADD/Form";

// Admission Portal pages
import AdmissionAuth from "./pages/public/Admission/Auth";
import AdmissionPortal from "./pages/public/Admission/Portal";
import AdmissionApplicationForm from "./pages/public/Admission/ApplicationForm";
import AdmissionUploadDocuments from "./pages/public/Admission/UploadDocuments";
import AdmissionPayment from "./pages/public/Admission/Payment";
import AdmissionStatus from "./pages/public/Admission/Status";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/admission/apply" element={<AdmissionApply />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/accadd" element={<ACCADDLanding />} />
            <Route path="/accadd/auth" element={<ACCADDAuth />} />
            <Route path="/accadd/payment" element={<ACCADDPayment />} />
            <Route path="/accadd/form" element={<ACCADDForm />} />
            <Route path="/admission/auth" element={<AdmissionAuth />} />
            <Route path="/admission/portal" element={<AdmissionPortal />} />
            <Route
              path="/admission/application"
              element={<AdmissionApplicationForm />}
            />
            <Route
              path="/admission/documents"
              element={<AdmissionUploadDocuments />}
            />
            <Route path="/admission/payment" element={<AdmissionPayment />} />
            <Route path="/admission/status" element={<AdmissionStatus />} />
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
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
