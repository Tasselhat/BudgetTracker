import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Logout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const logout = async () => {
    setAuth({});
    navigate(from, { state: { from: location }, replace: true });
  };

  logout();
};

export default Logout;
