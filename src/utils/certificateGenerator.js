// src/utils/certificateGenerator.js
import jsPDF from 'jspdf';

export function generateReadinessCertificate(userData, careerData, improvementData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(15, 23, 42); // Dark background
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Border
  doc.setDrawColor(16, 185, 129); // Emerald color
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Decorative corner elements
  doc.setFillColor(16, 185, 129);
  doc.rect(10, 10, 40, 3, 'F');
  doc.rect(10, 10, 3, 40, 'F');
  doc.rect(pageWidth - 50, 10, 40, 3, 'F');
  doc.rect(pageWidth - 13, 10, 3, 40, 'F');

  // Title
  doc.setFontSize(40);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CAREER READINESS', pageWidth / 2, 40, { align: 'center' });
  
  doc.setFontSize(28);
  doc.setTextColor(16, 185, 129);
  doc.text('CERTIFICATE', pageWidth / 2, 55, { align: 'center' });

  // Divider line
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.line(60, 65, pageWidth - 60, 65);

  // Certificate text
  doc.setFontSize(14);
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  doc.text('This certifies that', pageWidth / 2, 80, { align: 'center' });

  // Student name
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(userData.name || 'Student Name', pageWidth / 2, 95, { align: 'center' });

  // Description
  doc.setFontSize(12);
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  const description = `has successfully completed the personalized learning path and demonstrated readiness for the role of`;
  doc.text(description, pageWidth / 2, 110, { align: 'center', maxWidth: pageWidth - 80 });

  // Career role
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text(careerData.jobRole, pageWidth / 2, 125, { align: 'center' });

  // Achievement metrics
  doc.setFontSize(11);
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');

  const metricsY = 145;
  const metricsData = [
    `Academic Performance: ${improvementData.academicAvg}%`,
    `Technical Skills: ${improvementData.technicalAvg}%`,
    `Overall Readiness: ${improvementData.overallReadiness}%`,
    `Skills Improved: ${improvementData.skillsImproved}`,
  ];

  metricsData.forEach((metric, index) => {
    const xPos = index < 2 ? pageWidth / 2 - 60 : pageWidth / 2 + 20;
    const yPos = metricsY + (index % 2) * 8;
    doc.text(metric, xPos, yPos);
  });

  // Date and signature section
  doc.setDrawColor(100, 100, 100);
  doc.line(40, pageHeight - 40, 100, pageHeight - 40);
  doc.line(pageWidth - 100, pageHeight - 40, pageWidth - 40, pageHeight - 40);

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Date of Achievement', 70, pageHeight - 32, { align: 'center' });
  doc.text('DevPath Career System', pageWidth - 70, pageHeight - 32, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.text(new Date().toLocaleDateString(), 70, pageHeight - 26, { align: 'center' });
  doc.text('Verified Platform', pageWidth - 70, pageHeight - 26, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('DevPath: Smart Career Guidance Tool for IT Students', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text(`Certificate ID: ${generateCertificateId()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
}

function generateCertificateId() {
  return 'DP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

export function downloadCertificate(userData, careerData, improvementData) {
  const doc = generateReadinessCertificate(userData, careerData, improvementData);
  const fileName = `DevPath_Certificate_${userData.name?.replace(/\s+/g, '_') || 'Student'}_${careerData.jobRole.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}