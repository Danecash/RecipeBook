// frontend/src/components/SectionHeader.jsx
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import styles from './SectionHeader.module.css';

const SectionHeader = ({ title, subtitle, showArrow = true }) => {
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.content}>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        <h2 className={styles.title}>{title}</h2>
      </div>
      {showArrow && (
        <div className={styles.arrow}>
          <FaArrowRight className={styles.arrowIcon} />
        </div>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  showArrow: PropTypes.bool,
};

export default SectionHeader;