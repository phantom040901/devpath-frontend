// src/utils/learningResourcesExport.js

/**
 * Export learning resources data to CSV
 */
export const exportLearningResourcesToCSV = (resources, fileName = null) => {
  if (!resources || resources.length === 0) {
    alert('No resources available to export');
    return;
  }

  const header = [
    'Title',
    'Type',
    'Category',
    'Description',
    'URL/Link',
    'Difficulty Level',
    'Duration',
    'Tags',
    'Date Added',
    'Status'
  ];

  const rows = resources.map(resource => [
    resource.title || '',
    resource.type || '',
    resource.category || '',
    resource.description || '',
    resource.url || resource.link || '',
    resource.difficulty || resource.level || '',
    resource.duration || '',
    Array.isArray(resource.tags) ? resource.tags.join('; ') : (resource.tags || ''),
    resource.createdAt ? formatDate(resource.createdAt) : '',
    resource.status || 'Active'
  ]);

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const defaultFileName = `learning_resources_${new Date().toISOString().split('T')[0]}.csv`;
  const finalFileName = fileName || defaultFileName;

  downloadCSV(csvContent, finalFileName);
};

function formatDate(timestamp) {
  if (!timestamp) return '';

  let date;
  
  if (timestamp && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } 
  else if (timestamp instanceof Date) {
    date = timestamp;
  } 
  else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function downloadCSV(content, fileName) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}