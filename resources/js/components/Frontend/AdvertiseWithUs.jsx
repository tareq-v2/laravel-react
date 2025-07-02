import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Design/AdvertiseWithUs.css';

const AdvertiseWithUs = () => {
  const classifiedAdRates = [
    { category: 'Jobs Offered', price: '$10' },
    { category: 'Jobs Wanted', price: '$10' },
    { category: 'Apt/House For Rent', price: '$10' },
    { category: 'Housing Wanted', price: 'Free' },
    // ... Add all other categories from Page 1
  ];

  const bannerRates = [
    { spot: 1, description: 'Top Leaderboard', display: 'All Pages', size: '700x87', price: '$10' },
    // ... Add all other banner spots from Page 3
  ];

  return (
    <div className="container advertise-container">
      {/* Hero Section */}
      <section className="hero-section text-center py-2">
        <h1 className="display-4 mb-4">Advertise With Us</h1>
        <p className="lead">
          Armenian Advertiser is the leading resource for business and classified ads.
        </p>
      </section>

      {/* Classified Ads Section */}
      <section className="classified-ads py-4">
        <h2 className="section-heading mb-4">Classified Ad Rates</h2>
        <p className="text-muted mb-4">Classified ads are active online for 30 days</p>

        <div className="row">
          <div className="col-md-6">
            <ul className="rate-list">
              {classifiedAdRates.slice(0, 15).map((item, index) => (
                <li key={index} className="d-flex justify-content-between py-2">
                  <span>{item.category}</span>
                  <span className="text-primary">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <ul className="rate-list">
              {classifiedAdRates.slice(15).map((item, index) => (
                <li key={index} className="d-flex justify-content-between py-2">
                  <span>{item.category}</span>
                  <span className="text-primary">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="premium-options bg-light p-4 my-4">
          <h5 className="mb-3">Premium Featured Options:</h5>
          <ul className="list-unstyled">
            <li>- Feature ad on the first page for 24 hours - $10</li>
            <li>- Promote ad on our social media platforms - $10</li>
            <li>*All posts receive free 15-day bump up</li>
          </ul>
        </div>

        <div className="text-center my-5">
          <button size="lg" className="btn btn-primary px-5">
            Post Your Ad
          </button>
        </div>
      </section>

      {/* Business Directory Section */}
      <section className="business-directory py-4 bg-light">
        <h2 className="section-heading mb-4">Business Directory Rates</h2>

        <div className="featured-listing mb-5 p-4">
          <h5 className="text-primary">Featured Directory Listing Option:</h5>
          <ul>
            <li>$195 annual subscription</li>
            <li>Includes main category plus 1 additional sub-category</li>
            <li>$75 annual for each additional sub-category</li>
            {/* ... other features */}
          </ul>
        </div>

        <div className="premium-listing mb-5 p-4">
          <h5 className="text-primary">Premium Directory Listing Options:</h5>
          <ul>
            <li>$75 annual to feature business at the top</li>
            <li>$125 annual to feature business at the top</li>
            {/* ... other features */}
          </ul>
        </div>

        <div className="text-center my-5">
          <button size="lg" className="btn btn-primary px-5">
            Add Your Business
          </button>
        </div>
      </section>

      {/* Banner Advertising Section */}
      <section className="banner-ads py-4">
        <h2 className="section-heading mb-4">Graphic Banner & Video Rates</h2>

        <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover mb-5">
                <thead className="table-dark">
                <tr>
                    <th scope="col" className="p-3">SPOT#</th>
                    <th scope="col" className="p-3">DESCRIPTION</th>
                    <th scope="col" className="p-3">DISPLAY PAGE</th>
                    <th scope="col" className="p-3">PIXEL SIZE</th>
                    <th scope="col" className="p-3">MONTHLY</th>
                </tr>
                </thead>
                <tbody>
                {bannerRates.map((rate, index) => (
                    <tr key={index}>
                    <td className="p-3 font-weight-bold">{rate.spot}</td>
                    <td className="p-3">{rate.description}</td>
                    <td className="p-3">{rate.display}</td>
                    <td className="p-3"><code>{rate.size}</code></td>
                    <td className="p-3 text-primary font-weight-bold">{rate.price}</td>
                    </tr>
                ))}
                </tbody>
                <caption className="text-muted small px-3">All rates in USD</caption>
            </table>
            </div>

        <div className="text-center my-5">
          <button size="lg" className="btn btn-primary px-5">
            <Link to="/create/banner">Add Your Banner</Link>
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdvertiseWithUs;
