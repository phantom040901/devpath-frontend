// src/pages/admin/ResourcesManagement.jsx - MOBILE OPTIMIZED
import { useState, useMemo } from "react";
import { learningResources } from "../../data/sections/learningResources";
import AdminNav from "../../components/admin/AdminNav";
import { 
  BookOpen, 
  Code, 
  Search, 
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  BookMarked,
  Zap,
  Globe,
  Clock,
  Target,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Trophy,
  Wrench,
  Layers,
  MapPin,
  X,
  Menu
} from "lucide-react";

// Import all roadmaps
import softwareDevelopment from "../../data/roadmaps/softwareDevelopment";
import dataAnalytics from "../../data/roadmaps/dataAnalytics";
import itManagementRoadmap from "../../data/roadmaps/itManagementRoadmap";
import networkingSecurity from "../../data/roadmaps/networkingSecurity";
import qaTestingRoadmap from "../../data/roadmaps/qaTestingRoadmap";
import specializedITRoadmap from "../../data/roadmaps/specializedITRoadmap";
import technicalSupportRoadmap from "../../data/roadmaps/technicalSupportRoadmap";

export default function ResourcesManagement() {
  const [activeTab, setActiveTab] = useState("learning");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedRoadmap, setSelectedRoadmap] = useState("software");
  const [expandedPhases, setExpandedPhases] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  
  // CRUD states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [urlValidation, setUrlValidation] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  const roadmaps = {
    software: softwareDevelopment,
    data: dataAnalytics,
    it_management: itManagementRoadmap,
    networking: networkingSecurity,
    qa: qaTestingRoadmap,
    specialized: specializedITRoadmap,
    support: technicalSupportRoadmap
  };

  const roadmapStats = useMemo(() => {
    const currentRoadmap = roadmaps[selectedRoadmap];
    if (!currentRoadmap) return { phases: 0, resources: 0, certifications: 0, projects: 0 };

    const sections = currentRoadmap.phases || currentRoadmap.modules || [];
    const phases = sections.length;
    let totalResources = 0;
    let totalCertifications = 0;
    let totalProjects = 0;

    sections.forEach(section => {
      const resources = section.resources || section.learningResources || [];
      totalResources += resources.length;
      totalCertifications += section.certifications?.length || 0;
      totalProjects += section.projects?.length || 0;
    });

    return {
      phases,
      resources: totalResources,
      certifications: totalCertifications,
      projects: totalProjects,
      totalDuration: currentRoadmap.totalDuration || currentRoadmap.estimatedDuration || "N/A"
    };
  }, [selectedRoadmap]);

  const togglePhase = (phaseIndex) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseIndex]: !prev[phaseIndex]
    }));
  };

  const allResources = useMemo(() => {
    const resources = [];
    Object.entries(learningResources).forEach(([topic, data]) => {
      if (topic === 'threshold') return;
      ['beginner', 'intermediate', 'advanced'].forEach(level => {
        if (data[level]) {
          data[level].forEach(resource => {
            resources.push({ ...resource, topic, level, threshold: data.threshold });
          });
        }
      });
    });
    return resources;
  }, []);

  const topics = useMemo(() => [...new Set(allResources.map(r => r.topic))].sort(), [allResources]);
  const platforms = useMemo(() => [...new Set(allResources.map(r => r.platform))].sort(), [allResources]);
  const types = useMemo(() => [...new Set(allResources.map(r => r.type))].sort(), [allResources]);

  const filteredResources = useMemo(() => {
    return allResources.filter(resource => {
      const matchesSearch = 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.platform.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = selectedTopic === "all" || resource.topic === selectedTopic;
      const matchesLevel = selectedLevel === "all" || resource.level === selectedLevel;
      const matchesType = selectedType === "all" || resource.type === selectedType;
      const matchesPlatform = selectedPlatform === "all" || resource.platform === selectedPlatform;
      return matchesSearch && matchesTopic && matchesLevel && matchesType && matchesPlatform;
    });
  }, [allResources, searchQuery, selectedTopic, selectedLevel, selectedType, selectedPlatform]);

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResources.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResources, currentPage]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const stats = useMemo(() => {
    const topicCount = topics.length;
    const totalResources = allResources.length;
    const platformCount = platforms.length;
    const byType = types.reduce((acc, type) => {
      acc[type] = allResources.filter(r => r.type === type).length;
      return acc;
    }, {});
    const byLevel = {
      beginner: allResources.filter(r => r.level === 'beginner').length,
      intermediate: allResources.filter(r => r.level === 'intermediate').length,
      advanced: allResources.filter(r => r.level === 'advanced').length
    };
    return { topicCount, totalResources, platformCount, byType, byLevel };
  }, [allResources, topics, platforms, types]);

  const handleExportLearningResources = () => {
    const headers = ['Topic', 'Level', 'Title', 'Platform', 'Type', 'Duration', 'URL', 'Description'];
    const rows = filteredResources.map(r => [
      r.topic, r.level, r.title, r.platform, r.type, r.duration, r.url, r.description
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `learning_resources_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportRoadmap = () => {
    const currentRoadmap = roadmaps[selectedRoadmap];
    if (!currentRoadmap) {
      alert('No roadmap data available to export');
      return;
    }

    const sections = currentRoadmap.phases || currentRoadmap.modules || [];
    const headers = ['Phase', 'Title', 'Duration', 'Resource Title', 'Platform', 'URL', 'Description'];
    const rows = [];

    sections.forEach((section, idx) => {
      const sectionResources = section.resources || section.learningResources || [];
      const phaseName = section.phase || section.title || `Phase ${idx + 1}`;
      const duration = section.duration || 'N/A';

      if (sectionResources.length > 0) {
        sectionResources.forEach(resource => {
          rows.push([
            idx + 1,
            phaseName,
            duration,
            resource.title || '',
            resource.platform || '',
            resource.url || '',
            resource.description || ''
          ]);
        });
      } else {
        rows.push([idx + 1, phaseName, duration, 'No resources', '', '', '']);
      }
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const roadmapName = currentRoadmap.title || selectedRoadmap;
    link.setAttribute('href', url);
    link.setAttribute('download', `${roadmapName.toLowerCase().replace(/\s+/g, '_')}_roadmap_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return <Video size={14} className="text-blue-400" />;
      case 'article': return <FileText size={14} className="text-emerald-400" />;
      case 'practice': return <Code size={14} className="text-purple-400" />;
      case 'course': return <BookMarked size={14} className="text-yellow-400" />;
      case 'interactive': return <Zap size={14} className="text-cyan-400" />;
      default: return <BookOpen size={14} className="text-gray-400" />;
    }
  };

  const getLevelBadge = (level) => {
    const styles = {
      beginner: "bg-green-500/20 text-green-400 border-green-500/30",
      intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      advanced: "bg-red-500/20 text-red-400 border-red-500/30"
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${styles[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1, 3).toUpperCase()}
      </span>
    );
  };

  const handleEditResource = (resource) => {
    setEditingResource({...resource});
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    alert(`Resource "${editingResource.title}" updated!\n\nNote: Changes are displayed but not persisted to files.`);
    setShowEditModal(false);
    setEditingResource(null);
  };

  const handleValidateUrl = async (resourceId, url) => {
    setUrlValidation(prev => ({ 
      ...prev, 
      [resourceId]: { status: 'checking', message: 'Checking...' } 
    }));
    
    window.open(url, '_blank');
    
    setTimeout(() => {
      const isWorking = window.confirm(
        `Did the URL open successfully?\n\nURL: ${url}\n\nClick OK if it works, Cancel if it's broken.`
      );
      
      setUrlValidation(prev => ({ 
        ...prev, 
        [resourceId]: { 
          status: isWorking ? 'success' : 'error', 
          message: isWorking ? 'Verified working' : 'Reported as broken'
        } 
      }));
    }, 1000);
  };

  const handleBulkValidation = async () => {
    setIsValidating(true);
    const resourcesToCheck = paginatedResources.slice(0, 5);
    
    for (const resource of resourcesToCheck) {
      setUrlValidation(prev => ({ 
        ...prev, 
        [resource.id]: { status: 'checking', message: 'Checking...' } 
      }));
      
      window.open(resource.url, '_blank');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isWorking = window.confirm(
        `Is this URL working?\n\nResource: ${resource.title}\nURL: ${resource.url}\n\nClick OK if working, Cancel if broken.`
      );
      
      setUrlValidation(prev => ({ 
        ...prev, 
        [resource.id]: { 
          status: isWorking ? 'success' : 'error',
          message: isWorking ? 'Verified' : 'Broken'
        } 
      }));
    }
    
    setIsValidating(false);
    alert(`Bulk validation complete!\n\nChecked ${resourcesToCheck.length} resources.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white pb-20">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 mt-16">
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Resources Management</h1>
          <p className="text-sm sm:text-base text-gray-400">Review and validate all resources</p>
        </div>

        {/* Tab Navigation - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 sm:mb-8">
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => setActiveTab("learning")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                activeTab === "learning"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              <BookOpen className="inline-block mr-1.5 sm:mr-2" size={16} />
              <span className="hidden xs:inline">Learning </span>Resources
            </button>
            <button
              onClick={() => setActiveTab("roadmaps")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                activeTab === "roadmaps"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              <MapPin className="inline-block mr-1.5 sm:mr-2" size={16} />
              <span className="hidden xs:inline">Career </span>Roadmaps
            </button>
          </div>

          {/* Export Button - Mobile Optimized */}
          <button
            onClick={activeTab === 'learning' ? handleExportLearningResources : handleExportRoadmap}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-semibold text-sm sm:text-base"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export {activeTab === 'learning' ? 'Resources' : 'Roadmap'} </span>CSV
          </button>
        </div>

        {activeTab === "learning" && (
          <div>
            {/* Stats Cards - Mobile Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <BookOpen className="text-blue-400" size={20} />
                  <TrendingUp className="text-emerald-400" size={14} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalResources}</div>
                <div className="text-xs text-gray-400">Total Resources</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <Target className="text-purple-400" size={20} />
                  <Award className="text-yellow-400" size={14} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.topicCount}</div>
                <div className="text-xs text-gray-400">Topics</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <Globe className="text-cyan-400" size={20} />
                  <CheckCircle className="text-emerald-400" size={14} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.platformCount}</div>
                <div className="text-xs text-gray-400">Platforms</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <Code className="text-emerald-400" size={20} />
                  <Video className="text-blue-400" size={14} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{types.length}</div>
                <div className="text-xs text-gray-400">Types</div>
              </div>
            </div>

            {/* Level Distribution - Mobile Optimized */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-8">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3">Resources by Level</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.byLevel.beginner}</div>
                  <div className="text-xs text-gray-400">Beginner</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.byLevel.intermediate}</div>
                  <div className="text-xs text-gray-400">Intermediate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.byLevel.advanced}</div>
                  <div className="text-xs text-gray-400">Advanced</div>
                </div>
              </div>
            </div>

            {/* Search and Filters - Mobile Optimized */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-6 mb-4 sm:mb-6">
              {/* Search Bar */}
              <div className="mb-3 sm:mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filter Toggle Button - Mobile Only */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden w-full flex items-center justify-between px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm mb-3"
              >
                <span className="flex items-center gap-2">
                  <Menu size={16} />
                  Filters
                </span>
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Filters - Collapsible on Mobile */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
                <select
                  value={selectedTopic}
                  onChange={(e) => handleFilterChange(setSelectedTopic)(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Topics</option>
                  {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => handleFilterChange(setSelectedLevel)(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => handleFilterChange(setSelectedType)(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {types.map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                <select
                  value={selectedPlatform}
                  onChange={(e) => handleFilterChange(setSelectedPlatform)(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map(platform => <option key={platform} value={platform}>{platform}</option>)}
                </select>
              </div>

              {/* Action Row - Mobile Optimized */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-400">
                  Showing {paginatedResources.length} of {filteredResources.length} (Page {currentPage}/{totalPages})
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleBulkValidation}
                    disabled={isValidating}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-medium transition disabled:opacity-50"
                  >
                    {isValidating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span className="hidden sm:inline">Validating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        <span className="hidden sm:inline">Validate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Resources Cards - Mobile Optimized */}
            <div className="space-y-2 sm:space-y-3">
              {paginatedResources.map((resource, idx) => (
                <div
                  key={`${resource.topic}-${resource.id}-${idx}`}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-gray-600/50 transition"
                >
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                      {getResourceIcon(resource.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                        <h3 className="text-sm sm:text-base text-white font-semibold line-clamp-2 flex-1">{resource.title}</h3>
                        {getLevelBadge(resource.level)}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-2 sm:mb-3">{resource.description}</p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2 sm:mb-3">
                        <span className="flex items-center gap-1">
                          <Target size={10} />
                          {resource.topic}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe size={10} />
                          {resource.platform}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {resource.duration}
                        </span>
                      </div>

                      {/* Action Buttons - Mobile Optimized */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs font-medium transition"
                        >
                          <ExternalLink size={12} />
                          <span className="hidden sm:inline">Open</span>
                        </a>
                        <button
                          onClick={() => handleValidateUrl(resource.id, resource.url)}
                          className="px-2.5 sm:px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded text-xs font-medium transition"
                        >
                          {urlValidation[resource.id]?.status === 'checking' ? '...' : 'Check'}
                        </button>
                        <button
                          onClick={() => handleEditResource(resource)}
                          className="px-2.5 sm:px-3 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded text-xs font-medium transition"
                        >
                          Edit
                        </button>
                        {urlValidation[resource.id] && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            urlValidation[resource.id].status === 'success' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : urlValidation[resource.id].status === 'checking'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {urlValidation[resource.id].status === 'success' ? '✓' : 
                             urlValidation[resource.id].status === 'checking' ? '...' : 
                             '✗'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {paginatedResources.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto mb-4 text-gray-500" size={48} />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-400 mb-2">No resources found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your filters</p>
                </div>
              )}
            </div>

            {/* Pagination - Mobile Optimized */}
            {totalPages > 1 && (
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                >
                  Prev
                </button>
                
                <div className="flex gap-1 sm:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsis = 
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return <span key={page} className="px-2 py-2 text-gray-500 text-sm">...</span>;
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "roadmaps" && (
          <div>
            {/* Roadmap Selector - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 mb-4 sm:mb-8">
              {[
                { key: 'software', label: 'Software', fullLabel: 'Software Dev', icon: Code },
                { key: 'data', label: 'Data', fullLabel: 'Data Analytics', icon: TrendingUp },
                { key: 'it_management', label: 'IT Mgmt', fullLabel: 'IT Management', icon: Briefcase },
                { key: 'networking', label: 'Network', fullLabel: 'Networking', icon: Globe },
                { key: 'qa', label: 'QA', fullLabel: 'QA Testing', icon: CheckCircle },
                { key: 'specialized', label: 'Special', fullLabel: 'Specialized IT', icon: Award },
                { key: 'support', label: 'Support', fullLabel: 'Tech Support', icon: Wrench }
              ].map(({ key, label, fullLabel, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedRoadmap(key);
                    setExpandedPhases({});
                  }}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition flex flex-col items-center gap-1.5 sm:gap-2 ${
                    selectedRoadmap === key
                      ? "bg-blue-600/20 border-blue-500 text-blue-400"
                      : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <Icon size={20} className="sm:hidden" />
                  <Icon size={24} className="hidden sm:block" />
                  <span className="text-xs font-semibold text-center sm:hidden">{label}</span>
                  <span className="hidden sm:block text-xs font-semibold text-center">{fullLabel}</span>
                </button>
              ))}
            </div>

            {/* Roadmap Stats - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-8">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">{roadmapStats.phases}</div>
                <div className="text-xs text-gray-400">Phases</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{roadmapStats.resources}</div>
                <div className="text-xs text-gray-400">Resources</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{roadmapStats.certifications}</div>
                <div className="text-xs text-gray-400">Certifications</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">{roadmapStats.projects}</div>
                <div className="text-xs text-gray-400">Projects</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl font-bold text-cyan-400">{roadmapStats.totalDuration}</div>
                <div className="text-xs text-gray-400">Duration</div>
              </div>
            </div>

            {/* Roadmap Info - Mobile Optimized */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                {roadmaps[selectedRoadmap]?.title || "Career Roadmap"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-4">
                {roadmaps[selectedRoadmap]?.description || "Detailed career path information"}
              </p>
              
              <button
                onClick={() => {
                  const sections = roadmaps[selectedRoadmap]?.phases || roadmaps[selectedRoadmap]?.modules || [];
                  sections.forEach((section) => {
                    const resources = section.resources || section.learningResources || [];
                    resources.forEach((resource) => {
                      if (resource.url) {
                        handleValidateUrl(`roadmap_${resource.id || resource.title}`, resource.url);
                      }
                    });
                  });
                }}
                disabled={isValidating}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {isValidating ? 'Validating...' : 'Validate All URLs'}
              </button>
            </div>

            {/* Roadmap Phases - Mobile Optimized */}
            <div className="space-y-2 sm:space-y-4">
              {(roadmaps[selectedRoadmap]?.phases || roadmaps[selectedRoadmap]?.modules || []).map((section, idx) => {
                const sectionResources = section.resources || section.learningResources || [];
                return (
                  <div key={idx} className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl overflow-hidden">
                    <button
                      onClick={() => togglePhase(idx)}
                      className="w-full p-3 sm:p-5 flex items-center justify-between hover:bg-gray-800/70 transition"
                    >
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm sm:text-base">
                          {idx + 1}
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm sm:text-lg font-bold text-white">{section.phase || section.title}</h3>
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {section.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen size={10} />
                              {sectionResources.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      {expandedPhases[idx] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    {expandedPhases[idx] && (
                      <div className="border-t border-gray-700/50 p-3 sm:p-5 bg-gray-900/30">
                        {section.description && <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">{section.description}</p>}
                        
                        {sectionResources.length > 0 && (
                          <div className="mb-3 sm:mb-4">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3">Learning Resources:</h4>
                            <div className="space-y-2">
                              {sectionResources.map((resource, resIdx) => (
                                <div key={resIdx} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs sm:text-sm text-white font-medium line-clamp-2">{resource.title}</div>
                                    <div className="text-xs text-gray-400">{resource.platform}</div>
                                    {resource.description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{resource.description}</div>}
                                  </div>
                                  {resource.url && (
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer"
                                      className="flex-shrink-0 px-2.5 sm:px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded text-xs flex items-center gap-1">
                                      <ExternalLink size={12} className="hidden sm:inline" />
                                      <span>Open</span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Edit Resource Modal - Mobile Optimized */}
      {showEditModal && editingResource && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 my-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white">Edit Resource</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({...editingResource, title: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">URL</label>
                <input
                  type="url"
                  value={editingResource.url}
                  onChange={(e) => setEditingResource({...editingResource, url: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Platform</label>
                <input
                  type="text"
                  value={editingResource.platform}
                  onChange={(e) => setEditingResource({...editingResource, platform: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    value={editingResource.duration}
                    onChange={(e) => setEditingResource({...editingResource, duration: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={editingResource.type}
                    onChange={(e) => setEditingResource({...editingResource, type: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="course">Course</option>
                    <option value="practice">Practice</option>
                    <option value="interactive">Interactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={editingResource.description}
                  onChange={(e) => setEditingResource({...editingResource, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-yellow-400">
                  ⚠️ <strong>Note:</strong> Changes displayed but not persisted to files.
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}