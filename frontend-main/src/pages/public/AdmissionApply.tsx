import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdmissionApply = () => {
  const navigate = useNavigate();
  const { portalType, logout } = useAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      // If user is logged into a different portal, logout first
      if (portalType && portalType !== "admission") {
        await logout();
      }
      // Redirect to new admission portal authentication
      navigate("/admission/auth", { replace: true });
    };

    handleRedirect();
  }, [navigate, portalType, logout]);

  return null; // Component will redirect immediately
};

export default AdmissionApply;
