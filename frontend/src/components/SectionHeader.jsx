// frontend/src/components/SectionHeader.jsx
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './SectionHeader.css';

const SectionHeader = ({ title, link, linkText = 'more>>' }) => {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {link && (
        <Link to={link} className="section-link">
          {linkText} <FaArrowRight className="link-arrow" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;