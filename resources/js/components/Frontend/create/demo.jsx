import React, { useState, useEffect } from 'react';
// ... (keep all existing imports)
import { FaImage } from 'react-icons/fa'; // Add this import for the banner icon

const Home = () => {
  // ... (keep all existing state and functions)

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${!isSidebarExpanded ? 'collapsed' : ''}`}>
        {/* ... (keep existing brand and toggle button) */}

        <nav className="nav-menu">
          {/* ... (keep existing Dashboard Link) */}

          {/* New Banners Section - Added before Ads Section */}
          <div className="nav-parent">
            <div
              className="nav-item"
              onClick={() => toggleMenu('banners')}
              data-tooltip="Banners"
            >
              <FaImage className="nav-icon" />
              {isSidebarExpanded && (
                <>
                  <span className='menu-title'>Banners</span>
                  <span className="chevron">
                    {expandedMenu === 'banners' ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </>
              )}
            </div>

            {expandedMenu === 'banners' && isSidebarExpanded && (
              <div className="nav-children open">
                <Link to="/home/banners/history" className="nav-item child">
                  <FaList className="nav-icon" />
                  <span className="menu-title">Banner History</span>
                </Link>
                <Link to="/home/banners/categories" className="nav-item child">
                  <FaList className="nav-icon" />
                  <span className="menu-title">Categories</span>
                </Link>
                <Link to="/create/banner" className="nav-item child">
                  <FaPlus className="nav-icon" />
                  <span className="menu-title">Create Banner</span>
                </Link>
                <Link to="/home/banners/rates" className="nav-item child">
                  <FaList className="nav-icon" />
                  <span className="menu-title">Rates</span>
                </Link>
              </div>
            )}
          </div>

          {/* ... (keep existing Ads Section and other menu items) */}
        </nav>

        {/* ... (keep existing logout button) */}
      </aside>

      {/* ... (keep existing main content) */}
    </div>
  );
};

export default Home;
