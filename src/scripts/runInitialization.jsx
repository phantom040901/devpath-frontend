// src/scripts/runInitialization.jsx
// Component to run Firebase initialization from the browser

import { useState } from 'react';
import { initializeAllCollections, displaySystemSettings } from './initializeFirebase';

export default function FirebaseInitializer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleInitialize = async () => {
    setLoading(true);
    setLogs([]);

    // Capture console.log output
    const originalLog = console.log;
    const logMessages = [];

    console.log = (...args) => {
      const message = args.join(' ');
      logMessages.push(message);
      setLogs(prev => [...prev, message]);
      originalLog(...args);
    };

    try {
      const success = await initializeAllCollections();
      setResult(success ? 'success' : 'partial');
    } catch (error) {
      console.error('Error:', error);
      setResult('error');
    } finally {
      console.log = originalLog; // Restore original console.log
      setLoading(false);
    }
  };

  const handleDisplaySettings = async () => {
    setLoading(true);
    setLogs([]);

    const originalLog = console.log;
    const logMessages = [];

    console.log = (...args) => {
      const message = args.join(' ');
      logMessages.push(message);
      setLogs(prev => [...prev, message]);
      originalLog(...args);
    };

    try {
      await displaySystemSettings();
      setResult('displayed');
    } catch (error) {
      console.error('Error:', error);
      setResult('error');
    } finally {
      console.log = originalLog;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔥 Firebase Initializer</h1>
          <p className="text-gray-400">Initialize Firestore collections for DevPath system</p>
        </div>

        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={handleInitialize}
              disabled={loading}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Initializing...' : '🚀 Initialize All Collections'}
            </button>

            <button
              onClick={handleDisplaySettings}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Loading...' : '📋 Display Settings'}
            </button>
          </div>
        </div>

        {result && (
          <div className={`mb-6 p-4 rounded-lg border ${
            result === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
            result === 'displayed' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :
            result === 'partial' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' :
            'bg-red-500/20 border-red-500/40 text-red-300'
          }`}>
            {result === 'success' && '✅ All collections initialized successfully!'}
            {result === 'displayed' && '✅ Settings displayed in console'}
            {result === 'partial' && '⚠️ Some collections failed. Check logs below.'}
            {result === 'error' && '❌ Error occurred. Check console for details.'}
          </div>
        )}

        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Console Output</h2>
          <div className="bg-black/50 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Click a button above to start.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log.includes('✅') && <span className="text-emerald-400">{log}</span>}
                  {log.includes('❌') && <span className="text-red-400">{log}</span>}
                  {log.includes('⚠️') && <span className="text-yellow-400">{log}</span>}
                  {log.includes('🚀') && <span className="text-blue-400">{log}</span>}
                  {log.includes('📋') && <span className="text-cyan-400">{log}</span>}
                  {log.includes('🔍') && <span className="text-purple-400">{log}</span>}
                  {log.includes('═══') && <span className="text-gray-600">{log}</span>}
                  {!log.match(/[✅❌⚠️🚀📋🔍═]/) && <span className="text-gray-300">{log}</span>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-blue-300">ℹ️ Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
            <li>Click "Initialize All Collections" to create the Firestore structure</li>
            <li>Check the console output for success/error messages</li>
            <li>Verify in Firebase Console that collections were created</li>
            <li>Click "Display Settings" to view current configuration</li>
            <li>Update Firestore security rules (see documentation)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
