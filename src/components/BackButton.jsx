import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const parentPath = pathParts.join('/');
    navigate(parentPath || '/admin/dashboard'); 
  };

  return (
    <div className="admin-container6">
      <button className="back-button6" onClick={handleGoBack}>
        <ArrowBackIcon className="back-icon6" />
        <span>Back</span>
      </button>
      {children}
    </div>
  );
};

export default BackButton;