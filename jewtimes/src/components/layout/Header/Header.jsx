import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <img src="../src/assets/icons/logo.png" alt="זמנים לוגו" className="logo-icon" />
            <Link to="/" className="logo-text">
              זמנים
            </Link>
          </div>
          
          <nav className="nav-menu">
            <Link to="/" className="nav-link">ראשי</Link>
            <Link to="/times" className="nav-link">זמני תפילה</Link>
            <Link to="/calendar" className="nav-link">לוח שנה</Link>
            <Link to="/about" className="nav-link">אודות</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;