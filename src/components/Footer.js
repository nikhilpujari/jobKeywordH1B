import React from 'react';

function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer-menu">
          <div className="row">
            <div className="col-sm-3">
              <div className="navbar-header">
                <a className="navbar-brand" href="index.html">
                  job<span>hunt</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="scroll-Top">
        <div className="return-to-top">
          <i
            className="fa fa-angle-up"
            id="scroll-top"
            data-toggle="tooltip"
            data-placement="top"
            title="Back to Top"
            aria-hidden="true"
          ></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
