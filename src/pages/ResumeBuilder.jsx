// src/pages/ResumeBuilder.jsx
import { useState, useEffect } from 'react';
import { Download, Eye, Sparkles, Save, Plus, Trash2, FileText, Briefcase, GraduationCap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import DashboardNav from '../components/dashboard/DashboardNav';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    education: [{
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: []
    }],
    experience: [{
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: []
    }],
    projects: [{
      name: '',
      technologies: '',
      link: '',
      description: '',
      highlights: []
    }],
    skills: {
      technical: [],
      soft: []
    },
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      link: ''
    }]
  });

  const [newItem, setNewItem] = useState({
    achievement: '',
    responsibility: '',
    highlight: '',
    techSkill: '',
    softSkill: ''
  });

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'certifications', label: 'Certifications', icon: '📜' }
  ];

  useEffect(() => {
    const loadUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        setUserId(user.uid);
        const db = getFirestore();
        const resumeRef = doc(db, 'resumes', user.uid);
        
        try {
          const resumeDoc = await getDoc(resumeRef);
          if (resumeDoc.exists()) {
            setResumeData(resumeDoc.data());
          } else {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setResumeData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  fullName: userData.fullName || '',
                  email: user.email || ''
                }
              }));
            }
          }
        } catch (error) {
          console.error('Error loading resume:', error);
        }
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const handlePersonalChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addArrayItem = (section, template) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addToList = (section, index, field, value) => {
    if (!value.trim()) return;
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { 
          ...item, 
          [field]: [...(item[field] || []), value] 
        } : item
      )
    }));
    setNewItem(prev => ({ ...prev, [field]: '' }));
  };

  const removeFromList = (section, index, field, itemIndex) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { 
          ...item, 
          [field]: item[field].filter((_, idx) => idx !== itemIndex)
        } : item
      )
    }));
  };

  const addSkill = (type, value) => {
    if (!value.trim()) return;
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], value]
      }
    }));
    setNewItem(prev => ({ ...prev, [type === 'technical' ? 'techSkill' : 'softSkill']: '' }));
  };

  const removeSkill = (type, index) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index)
      }
    }));
  };

  const saveResume = async () => {
    if (!userId) return;
    
    setSaving(true);
    const db = getFirestore();
    const resumeRef = doc(db, 'resumes', userId);
    
    try {
      await setDoc(resumeRef, {
        ...resumeData,
        lastUpdated: new Date().toISOString()
      });
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPos = 20;
    
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(resumeData.personal.fullName || 'Your Name', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const contactInfo = [
      resumeData.personal.email,
      resumeData.personal.phone,
      resumeData.personal.location
    ].filter(Boolean).join(' | ');
    pdf.text(contactInfo, 20, yPos);
    yPos += 15;

    if (resumeData.personal.summary) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROFESSIONAL SUMMARY', 20, yPos);
      yPos += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const summaryLines = pdf.splitTextToSize(resumeData.personal.summary, 170);
      pdf.text(summaryLines, 20, yPos);
      yPos += summaryLines.length * 5 + 10;
    }

    if (resumeData.education[0].school) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EDUCATION', 20, yPos);
      yPos += 7;
      
      resumeData.education.forEach(edu => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(`${edu.degree} in ${edu.field}`, 20, yPos);
        yPos += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.text(edu.school, 20, yPos);
        pdf.text(`${edu.startDate} - ${edu.endDate}`, 150, yPos);
        yPos += 5;
        if (edu.gpa) {
          pdf.text(`GPA: ${edu.gpa}`, 20, yPos);
          yPos += 5;
        }
        yPos += 5;
      });
    }

    if (resumeData.projects[0].name) {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROJECTS', 20, yPos);
      yPos += 7;
      
      resumeData.projects.forEach(project => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(project.name, 20, yPos);
        yPos += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.text(project.technologies, 20, yPos);
        yPos += 5;
        const descLines = pdf.splitTextToSize(project.description, 170);
        pdf.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 5;
      });
    }

    if (resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SKILLS', 20, yPos);
      yPos += 7;
      
      if (resumeData.skills.technical.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Technical:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        const techSkills = pdf.splitTextToSize(resumeData.skills.technical.join(', '), 150);
        pdf.text(techSkills, 45, yPos);
        yPos += techSkills.length * 5 + 2;
      }
      
      if (resumeData.skills.soft.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Soft Skills:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        const softSkills = pdf.splitTextToSize(resumeData.skills.soft.join(', '), 150);
        pdf.text(softSkills, 45, yPos);
      }
    }

    pdf.save(`${resumeData.personal.fullName || 'Resume'}.pdf`);
  };

  const aiEnhanceSummary = async () => {
    alert('AI Enhancement feature coming soon! This will use your DevPath assessment data to generate a personalized summary.');
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-primary-1400 via-primary-1500 to-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-primary-1400 via-primary-1500 to-black min-h-screen text-primary-50">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-700/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex-shrink-0"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <FileText className="text-primary-400" size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  Resume Builder
                </h1>
                <p className="text-gray-400 mt-1 text-xs sm:text-sm lg:text-base">Create your professional resume powered by your DevPath assessments</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all border border-gray-700/40 text-xs sm:text-sm"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={saveResume}
                disabled={saving}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 border border-blue-500/30 text-xs sm:text-sm"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all border border-emerald-500/30 text-xs sm:text-sm"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar Navigation */}
          {!previewMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-gray-900/70 border border-gray-700/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:sticky lg:top-28">
                <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Sections</h3>
                <div className="flex overflow-x-auto lg:flex-col lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0 scrollbar-hide">
                  {sections.map(section => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all whitespace-nowrap lg:w-full ${
                          activeSection === section.id
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-300 border border-transparent'
                        }`}
                      >
                        {typeof IconComponent === 'string' ? (
                          <span className="text-lg sm:text-xl">{IconComponent}</span>
                        ) : (
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        )}
                        <span className="font-medium text-xs sm:text-sm lg:text-base">{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className={previewMode ? 'lg:col-span-12' : 'lg:col-span-9'}>
            {previewMode ? (
              // Resume Preview
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto"
              >
                {/* Header */}
                <div className="border-b-2 border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{resumeData.personal.fullName || 'Your Name'}</h1>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                    {resumeData.personal.email && <span className="break-all">✉️ {resumeData.personal.email}</span>}
                    {resumeData.personal.phone && <span>📱 {resumeData.personal.phone}</span>}
                    {resumeData.personal.location && <span>📍 {resumeData.personal.location}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                    {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} className="text-blue-600 hover:underline break-all">LinkedIn</a>}
                    {resumeData.personal.github && <a href={resumeData.personal.github} className="text-blue-600 hover:underline break-all">GitHub</a>}
                    {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} className="text-blue-600 hover:underline break-all">Portfolio</a>}
                  </div>
                </div>

                {/* Summary */}
                {resumeData.personal.summary && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Professional Summary</h2>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{resumeData.personal.summary}</p>
                  </div>
                )}

                {/* Education */}
                {resumeData.education[0].school && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Education</h2>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="mb-3 sm:mb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{edu.degree} in {edu.field}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">{edu.school}</p>
                          </div>
                          <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        {edu.gpa && <p className="text-gray-600 mt-1 text-xs sm:text-sm">GPA: {edu.gpa}</p>}
                        {edu.achievements.length > 0 && (
                          <ul className="list-disc list-inside mt-2 text-gray-700 text-xs sm:text-sm space-y-1">
                            {edu.achievements.map((achievement, i) => <li key={i}>{achievement}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Experience */}
                {resumeData.experience[0].company && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Experience</h2>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="mb-3 sm:mb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{exp.position}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">{exp.company} • {exp.location}</p>
                          </div>
                          <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="list-disc list-inside mt-2 text-gray-700 text-xs sm:text-sm space-y-1">
                            {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {resumeData.projects[0].name && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Projects</h2>
                    {resumeData.projects.map((project, idx) => (
                      <div key={idx} className="mb-3 sm:mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{project.name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{project.technologies}</p>
                        <p className="text-gray-700 mt-1 text-xs sm:text-sm">{project.description}</p>
                        {project.highlights && project.highlights.length > 0 && (
                          <ul className="list-disc list-inside mt-2 text-gray-700 text-xs sm:text-sm space-y-1">
                            {project.highlights.map((highlight, i) => <li key={i}>{highlight}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Skills</h2>
                    {resumeData.skills.technical.length > 0 && (
                      <div className="mb-2">
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">Technical: </span>
                        <span className="text-gray-700 text-xs sm:text-sm break-words">{resumeData.skills.technical.join(', ')}</span>
                      </div>
                    )}
                    {resumeData.skills.soft.length > 0 && (
                      <div>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">Soft Skills: </span>
                        <span className="text-gray-700 text-xs sm:text-sm break-words">{resumeData.skills.soft.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Certifications */}
                {resumeData.certifications[0].name && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Certifications</h2>
                    {resumeData.certifications.map((cert, idx) => (
                      <div key={idx} className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{cert.name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{cert.issuer} • {cert.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              // Edit Forms
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/70 border border-gray-700/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8"
              >
                {activeSection === 'personal' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Personal Information</h2>
                      <button
                        onClick={aiEnhanceSummary}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all border border-purple-500/30 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>AI Enhance Summary</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={resumeData.personal.fullName}
                        onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                        className="sm:col-span-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={resumeData.personal.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={resumeData.personal.phone}
                        onChange={(e) => handlePersonalChange('phone', e.target.value)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Location (e.g., Davao City, Philippines)"
                        value={resumeData.personal.location}
                        onChange={(e) => handlePersonalChange('location', e.target.value)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn URL"
                        value={resumeData.personal.linkedin}
                        onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="GitHub URL"
                        value={resumeData.personal.github}
                        onChange={(e) => handlePersonalChange('github', e.target.value)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Portfolio URL"
                        value={resumeData.personal.portfolio}
                        onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <textarea
                        placeholder="Professional Summary (Describe your career goals, strengths, and what makes you unique)"
                        value={resumeData.personal.summary}
                        onChange={(e) => handlePersonalChange('summary', e.target.value)}
                        rows={4}
                        className="sm:col-span-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Education</h2>
                      <button
                        onClick={() => addArrayItem('education', {
                          school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', achievements: []
                        })}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30 text-xs sm:text-sm"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Add Education</span>
                      </button>
                    </div>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gray-800/30 border border-gray-700/40 rounded-lg">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <h3 className="font-semibold text-white text-sm sm:text-base">Education {idx + 1}</h3>
                          {resumeData.education.length > 1 && (
                            <button
                              onClick={() => removeArrayItem('education', idx)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <input
                            type="text"
                            placeholder="School Name"
                            value={edu.school}
                            onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Degree (e.g., Bachelor of Science)"
                            value={edu.degree}
                            onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Field of Study (e.g., Computer Science)"
                            value={edu.field}
                            onChange={(e) => updateArrayItem('education', idx, 'field', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="GPA (Optional)"
                            value={edu.gpa}
                            onChange={(e) => updateArrayItem('education', idx, 'gpa', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Start Date (e.g., Aug 2021)"
                            value={edu.startDate}
                            onChange={(e) => updateArrayItem('education', idx, 'startDate', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="End Date (e.g., May 2025)"
                            value={edu.endDate}
                            onChange={(e) => updateArrayItem('education', idx, 'endDate', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Achievements & Honors</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add achievement (e.g., Dean's List, Best Capstone Project)"
                              value={newItem.achievement}
                              onChange={(e) => setNewItem({...newItem, achievement: e.target.value})}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addToList('education', idx, 'achievements', newItem.achievement);
                                }
                              }}
                              className="flex-1 px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                              onClick={() => addToList('education', idx, 'achievements', newItem.achievement)}
                              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30 text-xs sm:text-sm"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-2 space-y-2">
                            {edu.achievements?.map((achievement, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-800/50 px-3 py-2 rounded-lg">
                                <span className="text-gray-300">• {achievement}</span>
                                <button
                                  onClick={() => removeFromList('education', idx, 'achievements', i)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Work Experience</h2>
                      <button
                        onClick={() => addArrayItem('experience', {
                          company: '', position: '', location: '', startDate: '', endDate: '', current: false, responsibilities: []
                        })}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30 text-xs sm:text-sm"
                      >
                        <Plus className="w-4 h-4" /> Add Experience
                      </button>
                    </div>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gray-800/30 border border-gray-700/40 rounded-lg">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <h3 className="font-semibold text-white text-sm sm:text-base">Experience {idx + 1}</h3>
                          {resumeData.experience.length > 1 && (
                            <button
                              onClick={() => removeArrayItem('experience', idx)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Position/Title"
                            value={exp.position}
                            onChange={(e) => updateArrayItem('experience', idx, 'position', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => updateArrayItem('experience', idx, 'location', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`current-${idx}`}
                              checked={exp.current}
                              onChange={(e) => updateArrayItem('experience', idx, 'current', e.target.checked)}
                              className="w-4 h-4 text-primary-600 rounded"
                            />
                            <label htmlFor={`current-${idx}`} className="text-sm text-gray-400">Currently working here</label>
                          </div>
                          {!exp.current && (
                            <input
                              type="text"
                              placeholder="End Date"
                              value={exp.endDate}
                              onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)}
                              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                            />
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Key Responsibilities & Achievements</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add responsibility or achievement"
                              value={newItem.responsibility}
                              onChange={(e) => setNewItem({...newItem, responsibility: e.target.value})}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addToList('experience', idx, 'responsibilities', newItem.responsibility);
                                }
                              }}
                              className="flex-1 px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                              onClick={() => addToList('experience', idx, 'responsibilities', newItem.responsibility)}
                              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30 text-xs sm:text-sm"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-2 space-y-2">
                            {exp.responsibilities?.map((resp, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-800/50 px-3 py-2 rounded-lg">
                                <span className="text-gray-300">• {resp}</span>
                                <button
                                  onClick={() => removeFromList('experience', idx, 'responsibilities', i)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'projects' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Projects</h2>
                      <button
                        onClick={() => addArrayItem('projects', {
                          name: '', technologies: '', link: '', description: '', highlights: []
                        })}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30 text-xs sm:text-sm"
                      >
                        <Plus className="w-4 h-4" /> Add Project
                      </button>
                    </div>
                    {resumeData.projects.map((project, idx) => (
                      <div key={idx} className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gray-800/30 border border-gray-700/40 rounded-lg">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <h3 className="font-semibold text-white text-sm sm:text-base">Project {idx + 1}</h3>
                          {resumeData.projects.length > 1 && (
                            <button
                              onClick={() => removeArrayItem('projects', idx)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Project Name"
                            value={project.name}
                            onChange={(e) => updateArrayItem('projects', idx, 'name', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Technologies Used (e.g., React, Python, Firebase)"
                            value={project.technologies}
                            onChange={(e) => updateArrayItem('projects', idx, 'technologies', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="url"
                            placeholder="Project Link (GitHub, Live Demo, etc.)"
                            value={project.link}
                            onChange={(e) => updateArrayItem('projects', idx, 'link', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <textarea
                            placeholder="Project Description"
                            value={project.description}
                            onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Key Highlights & Features</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add project highlight"
                              value={newItem.highlight}
                              onChange={(e) => setNewItem({...newItem, highlight: e.target.value})}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addToList('projects', idx, 'highlights', newItem.highlight);
                                }
                              }}
                              className="flex-1 px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                              onClick={() => addToList('projects', idx, 'highlights', newItem.highlight)}
                              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30 text-xs sm:text-sm"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-2 space-y-2">
                            {project.highlights?.map((highlight, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-800/50 px-3 py-2 rounded-lg">
                                <span className="text-gray-300">• {highlight}</span>
                                <button
                                  onClick={() => removeFromList('projects', idx, 'highlights', i)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Skills</h2>

                    <div className="mb-6 sm:mb-8">
                      <label className="block text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Technical Skills</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Add technical skill (e.g., Python, React, Machine Learning)"
                          value={newItem.techSkill}
                          onChange={(e) => setNewItem({...newItem, techSkill: e.target.value})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSkill('technical', newItem.techSkill);
                            }
                          }}
                          className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          onClick={() => addSkill('technical', newItem.techSkill)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.technical.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/30">
                            <span>{skill}</span>
                            <button
                              onClick={() => removeSkill('technical', idx)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Soft Skills</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Add soft skill (e.g., Leadership, Communication, Problem Solving)"
                          value={newItem.softSkill}
                          onChange={(e) => setNewItem({...newItem, softSkill: e.target.value})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSkill('soft', newItem.softSkill);
                            }
                          }}
                          className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          onClick={() => addSkill('soft', newItem.softSkill)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.soft.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg border border-emerald-500/30">
                            <span>{skill}</span>
                            <button
                              onClick={() => removeSkill('soft', idx)}
                              className="text-emerald-400 hover:text-emerald-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'certifications' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Certifications</h2>
                      <button
                        onClick={() => addArrayItem('certifications', {
                          name: '', issuer: '', date: '', link: ''
                        })}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500/30 text-xs sm:text-sm"
                      >
                        <Plus className="w-4 h-4" /> Add Certification
                      </button>
                    </div>
                    {resumeData.certifications.map((cert, idx) => (
                      <div key={idx} className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gray-800/30 border border-gray-700/40 rounded-lg">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <h3 className="font-semibold text-white text-sm sm:text-base">Certification {idx + 1}</h3>
                          {resumeData.certifications.length > 1 && (
                            <button
                              onClick={() => removeArrayItem('certifications', idx)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <input
                            type="text"
                            placeholder="Certification Name"
                            value={cert.name}
                            onChange={(e) => updateArrayItem('certifications', idx, 'name', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Issuing Organization"
                            value={cert.issuer}
                            onChange={(e) => updateArrayItem('certifications', idx, 'issuer', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Date Obtained"
                            value={cert.date}
                            onChange={(e) => updateArrayItem('certifications', idx, 'date', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="url"
                            placeholder="Verification Link (Optional)"
                            value={cert.link}
                            onChange={(e) => updateArrayItem('certifications', idx, 'link', e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}