// Temporary page to upload Coding Challenge
// Navigate to /upload-coding-challenge to use this

import { useState } from 'react';
import { uploadCodingChallenge } from '../utils/uploadCodingChallenge';

export default function UploadCodingChallenge() {
  const [status, setStatus] = useState('ready');
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setStatus('uploading');
    setMessage('Uploading to Firestore...');

    try {
      const result = await uploadCodingChallenge();
      setStatus('success');
      setMessage(`✅ Success! Uploaded ${result.data.questions.length} questions. You can now go to Technical Assessments and try the Coding Challenge!`);
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Upload Coding Challenge</h1>
      <p>Click the button below to upload the Coding Challenge assessment to Firestore.</p>

      <button
        onClick={handleUpload}
        disabled={status === 'uploading'}
        style={{
          background: status === 'uploading' ? '#ccc' : '#4285f4',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '4px',
          cursor: status === 'uploading' ? 'not-allowed' : 'pointer',
          marginTop: '20px'
        }}
      >
        {status === 'uploading' ? 'Uploading...' : 'Upload to Firestore'}
      </button>

      {message && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '4px',
            background: status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#d1ecf1',
            color: status === 'success' ? '#155724' : status === 'error' ? '#721c24' : '#0c5460',
            border: `1px solid ${status === 'success' ? '#c3e6cb' : status === 'error' ? '#f5c6cb' : '#bee5eb'}`
          }}
        >
          {message}
        </div>
      )}

      {status === 'success' && (
        <div style={{ marginTop: '20px' }}>
          <h3>Next Steps:</h3>
          <ol>
            <li>Go to <a href="/technical-assessments">Technical Assessments</a></li>
            <li>Click on "Coding Challenge"</li>
            <li>Take the assessment!</li>
          </ol>
        </div>
      )}
    </div>
  );
}
