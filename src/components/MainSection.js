import React, { useState, useRef } from 'react';

function MainSection() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [keywords, setKeywords] = useState({ technical_skills: [], soft_skills: [], important_phrases: [] });
  const [h1b1Info, setH1b1Info] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [showH1B1, setShowH1B1] = useState(false);

  const sectionRef = useRef(null);

  const placeholderH1B1Info = [
    {
      initialApproval: 'NA',
      initialDenial: 'NA',
      continuingApproval: 'NA',
      continuingDenial: 'NA',
    },
  ];

  const handleSearch = async () => {
    setLoading(true);
    setShowKeywords(false);
    setShowH1B1(false);
    setKeywords({ technical_skills: [], soft_skills: [], important_phrases: [] });
    setH1b1Info([]);

    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      // Fetch keywords
      const keywordResponse = await fetch('http://18.223.159.118:5001/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company, role }),
      });

      if (!keywordResponse.ok) {
        throw new Error('Failed to fetch keywords.');
      }

      const keywordData = await keywordResponse.json();
      setKeywords(keywordData);
      setShowKeywords(true);

      // Fetch H1B1 information
      const h1b1Response = await fetch('http://18.223.159.118:5001/h1b1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company }),
      });

      if (!h1b1Response.ok) {
        throw new Error('Failed to fetch H1B1 information.');
      }

      const h1b1Data = await h1b1Response.json();

      if (h1b1Data.length === 0) {
        alert('H1B1 information is not available.');
      } else {
        setH1b1Info(h1b1Data);
        setShowH1B1(true);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('H1B1 information is not available.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="home" className="welcome-hero">
        <div className="container">
          <div className="welcome-hero-txt">
            <h2>We are with you in your job search journey</h2>
            <p>Find H1B1 history and key role requirements for your desired company</p>
          </div>
          <div className="welcome-hero-serch-box">
            <div className="welcome-hero-form">
              <div className="single-welcome-hero-form">
                <h3>Company</h3>
                <input
                  type="text"
                  placeholder="Ex: Google, Microsoft"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="single-welcome-hero-form">
                <h3>Role</h3>
                <input
                  type="text"
                  placeholder="Ex: Software Engineer, Data Analyst"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>
            <div className="welcome-hero-serch">
              <button className="welcome-hero-btn" onClick={handleSearch}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div ref={sectionRef}>
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Fetching information...</p>
          </div>
        )}

        {showKeywords && (
          <section id="keywords" className="keywords-section">
            <div className="container">
              <div className="section-header">
                <h2>Key Role Requirements</h2>
                <p>Important skills and phrases for the role at {company}</p>
              </div>
              <div className="keywords-content">
                <div className="keywords-row">
                  <div className="keywords-col">
                    <h3>Technical Skills</h3>
                    <ul>
                      {keywords.technical_skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="keywords-col">
                    <h3>Soft Skills</h3>
                    <ul>
                      {keywords.soft_skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="keywords-col">
                    <h3>Important Phrases</h3>
                    <ul>
                      {keywords.important_phrases.map((phrase, index) => (
                        <li key={index}>{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      {showH1B1 && (
        <section id="statistics" className="statistics">
          <div className="container">
            <div className="section-header">
              <h2>{company}'s H1B1 History</h2>
            </div>
            <div className="statistics-counter">
              <div className="row">
                <div className="col-md-3 col-sm-6">
                  <div className="single-ststistics-box">
                    <div className="statistics-content">
                      <div className="counter">{h1b1Info.initialApproval}</div>
                    </div>
                    <h3>Initial Approval</h3>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="single-ststistics-box">
                    <div className="statistics-content">
                      <div className="counter">{h1b1Info.initialDenial}</div>
                    </div>
                    <h3>Initial Denial</h3>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="single-ststistics-box">
                    <div className="statistics-content">
                      <div className="counter">{h1b1Info.continuingApproval}</div>
                    </div>
                    <h3>Continuing Approval</h3>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="single-ststistics-box">
                    <div className="statistics-content">
                      <div className="counter">{h1b1Info.continuingDenial}</div>
                    </div>
                    <h3>Continuing Denial</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-header">
              <p>This is the H1B data for the year 2024 for all subsidiaries of {company}, sourced from uscis.gov.</p>
            </div>
          </div>
        </section>
      )}

      </div>
    </>
  );
}

export default MainSection;
