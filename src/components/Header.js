import React from 'react';

function Header() {
  return (
    <section className="top-area">
      <div className="header-area">
        {/* Start Navigation */}
        <nav 
          className="navbar navbar-default bootsnav navbar-sticky navbar-scrollspy"
          data-minus-value-desktop="70"
          data-minus-value-mobile="55"
          data-speed="1000"
        >
          <div className="container">
            {/* Start Header Navigation */}
            <div className="navbar-header">
              <a className="navbar-brand" href="index.html">
                job<span>Hunt</span>
              </a>
            </div>
            {/* End Header Navigation */}
          </div>
        </nav>
        {/* End Navigation */}
      </div>
      <div className="clearfix"></div>
    </section>
  );
}

export default Header;
