// frontend/src/components/Footer.jsx
import { FaUtensils, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <div className="footer-logo">
            <FaUtensils className="footer-logo-icon" />
            <span className="footer-logo-text">RecipeBook</span>
          </div>
          <p>Discover and share your favorite recipes with our community of food enthusiasts.</p>
        </div>
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/all-recipes">All Recipes</a></li>
            <li><a href="/popular">Popular Recipes</a></li>
            <li><a href="/find-by-ingredients">Find by Ingredients</a></li>
            <li><a href="/add-recipe">Add Recipe</a></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p><FaEnvelope /> hello@recipebook.com</p>
          <p><FaPhone /> +1 (555) 123-4567</p>
          <p><FaMapMarkerAlt /> 123 Culinary Street, Foodville</p>
          
          <div className="footer-social">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} RecipeBook. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;