import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { useTranslation } from './src/hooks/useTranslation';

const AdSubCategoriesListing = (subCategoryId) => {
  // const { subCategoryId } = useParams(); // Get parameter from URL
  const t = useTranslation();
  console.log(subCategoryId['subCategoryId']);
  const getContent = () => {
    switch(parseInt(subCategoryId['subCategoryId'])) { // Use numerical comparisons
      case 6:
        return <div>Business for sale</div>;
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