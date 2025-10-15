// src/utils/careerRoadmapExport.js

/**
 * Export career roadmap data to CSV
 */
export const exportCareerRoadmapToCSV = (roadmapData, roadmapName = 'Career Roadmap') => {
  if (!roadmapData || !roadmapData.phaseDetails || roadmapData.phaseDetails.length === 0) {
    alert('No roadmap data available to export');
    return;
  }

  const header = [
    'Phase Number',
    'Phase Title',
    'Duration',
    'Resource Count',
    'Topics'
  ];

  const rows = [];
  roadmapData.phaseDetails.forEach((phase) => {
    rows.push([
      phase.number,
      phase.title || `Phase ${phase.number}`,
      phase.duration || 'N/A',
      phase.resources || 0,
      phase.topics ? phase.topics.join('; ') : 'N/A'
    ]);
  });

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const sanitizedName = roadmapName.toLowerCase().replace(/\s+/g, '_');
  const fileName = `${sanitizedName}_roadmap_${new Date().toISOString().split('T')[0]}.csv`;

  downloadCSV(csvContent, fileName);
};

/**
 * Export detailed roadmap report
 */
export const exportDetailedRoadmap = (roadmapData, roadmapName = 'Career Roadmap') => {
  if (!roadmapData) {
    alert('No roadmap data available to export');
    return;
  }

  const sections = [
    '=== CAREER ROADMAP DETAILED REPORT ===',
    `Career Path: ${roadmapName}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    `Description: ${roadmapData.description || 'N/A'}`,
    `Total Duration: ${roadmapData.duration || 'N/A'}`,
    `Total Phases: ${roadmapData.phases || 0}`,
    `Total Resources: ${roadmapData.totalResources || 0}`,
    ''
  ];

  if (roadmapData.phaseDetails && roadmapData.phaseDetails.length > 0) {
    sections.push('=== LEARNING PHASES ===');
    roadmapData.phaseDetails.forEach((phase) => {
      sections.push('');
      sections.push(`Phase ${phase.number}: ${phase.title || 'Untitled Phase'}`);
      sections.push(`Duration: ${phase.duration || 'N/A'}`);
      
      if (phase.topics && phase.topics.length > 0) {
        sections.push(`Topics: ${phase.topics.join(', ')}`);
      }
    });
  }

  const content = sections.join('\n');
  const sanitizedName = roadmapName.toLowerCase().replace(/\s+/g, '_');
  const fileName = `${sanitizedName}_detailed_roadmap_${new Date().toISOString().split('T')[0]}.txt`;
  
  downloadText(content, fileName);
};

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

function downloadText(content, fileName) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
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