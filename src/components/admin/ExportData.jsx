// src/components/admin/ExportData.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileSpreadsheet, X, Loader2 } from "lucide-react";

export default function ExportData({ data, filename = "export" }) {
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const exportToJSON = () => {
    setExporting(true);
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      setExporting(false);
      setShowModal(false);
    }, 500);
  };

  const exportToCSV = () => {
    setExporting(true);
    setTimeout(() => {
      if (!Array.isArray(data) || data.length === 0) {
        alert("No data available to export");
        setExporting(false);
        return;
      }

      // Get all unique keys from all objects
      const allKeys = [...new Set(data.flatMap(item => Object.keys(item)))];
      
      // Create CSV header
      const headers = allKeys.join(",");
      
      // Create CSV rows
      const rows = data.map(item => {
        return allKeys.map(key => {
          const value = item[key];
          // Handle values that might contain commas or quotes
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(",");
      });

      const csvContent = [headers, ...rows].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setExporting(false);
      setShowModal(false);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all"
      >
        <Download size={18} />
        Export Data
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !exporting && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Export Data</h3>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={exporting}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                Choose your preferred export format
              </p>

              <div className="space-y-3">
                <button
                  onClick={exportToCSV}
                  disabled={exporting}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-primary-500/50 transition-all disabled:opacity-50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-all">
                      <FileSpreadsheet className="text-emerald-400" size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold">CSV File</div>
                      <div className="text-xs text-gray-400">Compatible with Excel & Sheets</div>
                    </div>
                  </div>
                  {exporting && <Loader2 className="animate-spin text-primary-400" size={20} />}
                </button>

                <button
                  onClick={exportToJSON}
                  disabled={exporting}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-primary-500/50 transition-all disabled:opacity-50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-all">
                      <FileText className="text-blue-400" size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold">JSON File</div>
                      <div className="text-xs text-gray-400">For developers & data analysis</div>
                    </div>
                  </div>
                  {exporting && <Loader2 className="animate-spin text-primary-400" size={20} />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}