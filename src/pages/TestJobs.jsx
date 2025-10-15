import { useState } from 'react';
import { fetchJobs, searchJobs } from '../utils/jobService';
import { testAdzunaConnection, testCountryCodes } from '../utils/testAdzunaAPI';

export default function TestJobs() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testType, setTestType] = useState('frontend');

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    console.clear();
    
    try {
      await testAdzunaConnection();
      console.log('\n');
      await testCountryCodes();
      setError('Check console for diagnostic results (F12)');
    } catch (err) {
      console.error('Diagnostic failed:', err);
      setError('Diagnostic failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const runTest = async (type) => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      let data;
      
      switch(type) {
        case 'frontend':
          console.log('Testing Frontend Developer jobs...');
          data = await fetchJobs({
            userCareer: 'Frontend Developer',
            location: 'remote',
            jobType: 'all',
            page: 1,
          });
          break;
          
        case 'internship':
          console.log('Testing Internship jobs...');
          data = await fetchJobs({
            userCareer: 'Software Engineer',
            location: 'remote',
            jobType: 'internship',
            page: 1,
          });
          break;
          
        case 'dataAnalyst':
          console.log('Testing Data Analyst jobs...');
          data = await fetchJobs({
            userCareer: 'Data Analyst',
            location: 'remote',
            jobType: 'all',
            page: 1,
          });
          break;
          
        case 'search':
          console.log('Testing custom search...');
          data = await searchJobs('react developer', 'singapore');
          break;
          
        case 'philippines':
          console.log('Testing Philippines-specific jobs...');
          data = await searchJobs('software developer philippines remote', 'singapore');
          break;
          
        case 'manila':
          console.log('Testing Manila jobs...');
          data = await searchJobs('developer manila', 'singapore');
          break;
          
        case 'entryLevel':
          console.log('Testing Entry Level jobs...');
          data = await fetchJobs({
            userCareer: 'Software Developer',
            location: 'remote',
            jobType: 'entry-level',
            page: 1,
          });
          break;
          
        default:
          data = await fetchJobs({
            userCareer: 'Software Developer',
            location: 'remote',
          });
      }
      
      console.log('✅ Test Results:', data);
      setResults(data);
      
    } catch (err) {
      console.error('❌ Test Failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        background: 'white', 
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1a202c',
            marginBottom: '0.5rem'
          }}>
            🧪 Job Service Test Page
          </h1>
          <p style={{ color: '#718096' }}>
            Test Adzuna API integration and job fetching functionality
          </p>
        </div>

        {/* Test Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={runDiagnostics}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#f56565',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1,
            }}
          >
            🔍 Run Diagnostics
          </button>
          
          <button
            onClick={() => runTest('frontend')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1,
            }}
          >
            Test Frontend Jobs
          </button>
          
          <button
            onClick={() => runTest('internship')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1,
            }}
          >
            🎓 Test Internships
          </button>
          
          <button
            onClick={() => runTest('philippines')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#38b2ac',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1,
            }}
          >
            🇵🇭 Philippines Jobs
          </button>
          
          <button
            onClick={() => runTest('manila')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#805ad5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1,
            }}
          >
            📍 Manila Jobs
          </button>
          
          <button
            onClick={() => runTest('entryLevel')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#ed8936',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1,
            }}
          >
            👶 Entry Level
          </button>
          
          <button
            onClick={() => runTest('dataAnalyst')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#d69e2e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1,
            }}
          >
            📊 Test Data Analyst
          </button>
          
          <button
            onClick={() => runTest('search')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#9f7aea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1,
            }}
          >
            🔎 Custom Search
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#4a5568'
          }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
              Fetching jobs from Adzuna API...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            background: '#fed7d7',
            border: '1px solid #fc8181',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#c53030', fontWeight: '600' }}>
              ❌ Error: {error}
            </p>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div>
            {/* Summary */}
            <div style={{ 
              background: '#f7fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#2d3748'
              }}>
                📊 Results Summary
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem'
              }}>
                <div>
                  <p style={{ color: '#718096', fontSize: '0.875rem' }}>Total Count</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {results.totalCount || 0}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#718096', fontSize: '0.875rem' }}>Jobs Returned</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#48bb78' }}>
                    {results.jobs.length}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#718096', fontSize: '0.875rem' }}>From Cache</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ed8936' }}>
                    {results.fromCache ? 'Yes ✓' : 'No ✗'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#2d3748'
            }}>
              💼 Job Listings (Top {Math.min(10, results.jobs.length)})
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gap: '1rem'
            }}>
              {results.jobs.slice(0, 10).map((job, index) => (
                <div 
                  key={job.id || index}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    background: 'white',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '0.75rem'
                  }}>
                    <h4 style={{ 
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#2d3748',
                      margin: 0
                    }}>
                      {job.title}
                    </h4>
                    <span style={{
                      background: job.matchScore >= 70 ? '#48bb78' : '#ed8936',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      marginLeft: '1rem'
                    }}>
                      {job.matchScore}% Match
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <p style={{ 
                      color: '#4a5568',
                      fontSize: '0.95rem',
                      margin: 0
                    }}>
                      🏢 {job.company}
                    </p>
                    <p style={{ 
                      color: '#718096',
                      fontSize: '0.875rem',
                      margin: '0.25rem 0'
                    }}>
                      📍 {job.location}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginTop: '0.75rem'
                  }}>
                    <span style={{
                      background: job.jobType === 'internship' ? '#bee3f8' : '#e2e8f0',
                      color: job.jobType === 'internship' ? '#2c5282' : '#4a5568',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {job.jobType}
                    </span>
                    
                    {job.salary?.min && (
                      <span style={{
                        background: '#c6f6d5',
                        color: '#22543d',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        ₱{job.salary.min.toLocaleString()} - ₱{job.salary.max.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {job.applyUrl && (
                    <a 
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        color: '#667eea',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                    >
                      View Details →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}