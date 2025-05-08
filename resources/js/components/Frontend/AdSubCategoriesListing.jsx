import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from './src/hooks/useTranslation';

const AdSubCategoriesListing = ( subCategoryId ) => {
  const t = useTranslation();
  console.log(subCategoryId);
  
  const getContent = () => {
    switch(subCategoryId) {
      case 8:
        return <div>Item for sale</div>;
      case 10:
        return <div>Volunteer</div>;
      default:
        return <div>Default content</div>;
    }
  };

  return (
    <div className="container">
        {getContent()}
    </div>
  );
};

export default AdSubCategoriesListing;