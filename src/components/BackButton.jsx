import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ROUTES } from "../utils/constants";

const BackButton = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    const path = location.pathname;

    const createDietMatch = path.match(/^\/admin\/(\d+)\/creatediet$/);
    if (createDietMatch) {
      navigate(`${ROUTES.ADMIN_CLIENTS}/${createDietMatch[1]}`);
      return;
    }

    if (/^\/admin\/clients\/[^/]+$/.test(path)) {
      navigate(ROUTES.ADMIN_CLIENTS);
      return;
    }

    if (path === ROUTES.ADMIN_CLIENTS) {
      return;
    }

    const pathParts = path.split("/").filter(Boolean);
    if (pathParts.length > 2 && pathParts[0] === "admin") {
      pathParts.pop();
      navigate(`/${pathParts.join("/")}`);
      return;
    }

    navigate(ROUTES.ADMIN_CLIENTS);
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
