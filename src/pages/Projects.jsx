import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Plus, Trash2, Check, Clock, Award, Star, Zap,
  ExternalLink, Layers, Play, AlertCircle, FileCode
} from 'lucide-react';
import useStore from '../store/useStore';
import { PROJECTS } from '../data/projects';
import { useToast } from '../components/ui/Toast';

export default function Projects() {
  const { career, experienceLevel } = useStore();
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('All');
  const [labProjects, setLabProjects] = useState([]);

  // Load My Lab projects from localStorage
  useEffect(() => {
    document.title = "Skillovix | Projects";
    const stored = localStorage.getItem('skillovix_lab_projects');
    if (stored) {
      try {
        setLabProjects(JSON.parse(stored));
      } catch (e) {
        print("Failed to parse lab projects", e);
      }
    }
  }, []);

  const activeProjects = career ? (PROJECTS[career] || []) : [];

  if (!career) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#1E3A5F]/40 flex items-center justify-center border border-[#38BDF8]/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
          <AlertCircle size={40} className="text-[#38BDF8]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">No Active Career Path</h1>
          <p className="text-base text-[#8BA5C7]">
            Please complete the career assessment first to receive portfolio project recommendations.
          </p>
        </div>
        <button
          onClick={() => navigate('/assessment')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 active:scale-95 transition-all text-white font-semibold rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.2)] cursor-pointer"
        >
          <Zap size={18} fill="white" />
          Start Career Assessment
        </button>
      </div>
    );
  }

  // Filter projects by tab
  const filteredProjects = activeTab === 'All'
    ? activeProjects
    : activeProjects.filter(p => p.difficulty.toLowerCase() === activeTab.toLowerCase());

  // Check if a project is already in lab
  const isProjectInLab = (title) => {
    return labProjects.some(lp => lp.title === title);
  };

  const handleAddToLab = (project) => {
    if (isProjectInLab(project.title)) {
      toast(`⚡ Skillovix: Project "${project.title}" is already in your Lab.`, 'warning');
      return;
    }

    const newLabProject = {
      ...project,
      status: 'In Progress',
      dateAdded: new Date().toLocaleDateString()
    };

    const updated = [...labProjects, newLabProject];
    setLabProjects(updated);
    localStorage.setItem('skillovix_lab_projects', JSON.stringify(updated));
    toast(`⚡ Skillovix: Added "${project.title}" to My Lab!`, 'success');
  };

  const handleRemoveFromLab = (title) => {
    const updated = labProjects.filter(lp => lp.title !== title);
    setLabProjects(updated);
    localStorage.setItem('skillovix_lab_projects', JSON.stringify(updated));
    toast(`⚡ Skillovix: Removed project from your Lab.`, 'warning');
  };

  const handleUpdateStatus = (title, status) => {
    const updated = labProjects.map(lp => {
      if (lp.title === title) {
        return { ...lp, status };
      }
      return lp;
    });
    setLabProjects(updated);
    localStorage.setItem('skillovix_lab_projects', JSON.stringify(updated));
    toast(`⚡ Skillovix: Project status updated to ${status}.`, 'success');
  };

  const isRecommended = (difficulty) => {
    if (!experienceLevel) return false;
    const diff = difficulty.toLowerCase();
    const lvl = experienceLevel.toLowerCase();

    if (lvl === 'beginner' && diff === 'beginner') return true;
    if ((lvl === 'some' || lvl === 'intermediate') && diff === 'intermediate') return true;
    if (lvl === 'advanced' && diff === 'advanced') return true;
    return false;
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 min-w-0 py-6 lg:py-8 space-y-6 text-left font-inter">


      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E3A5F] pb-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            // PROJECT SANDBOX & LABORATORY
          </p>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-3xl">💼</span>
            Portfolio Project Recommendations
          </h1>
          <p className="text-xs text-[#8BA5C7] mt-0.5">
            Build real-world projects with specific tech requirements to prove your skills to recruiters.
          </p>
        </div>
      </div>

      {/* Main Split: Left Grid, Right Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side: Recommendations and Filter Tabs */}
        <div className="xl:col-span-2 space-y-6 min-w-0">
          <div className="flex flex-wrap gap-2 border-b border-[#1E3A5F]/60 pb-3">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md'
                    : 'bg-[#0A1120] border-[#1E3A5F] text-[#8BA5C7] hover:text-white hover:border-[#38BDF8]/40'
                }`}
              >
                {tab} Projects
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const isRec = isRecommended(project.difficulty);
              const inLab = isProjectInLab(project.title);

              const diffColors = {
                Beginner: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25',
                Intermediate: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/25',
                Advanced: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/25'
              };

              return (
                <div
                  key={project.title}
                  className={`glass-card p-6 border flex flex-col justify-between space-y-4 hover:shadow-lg transition-all rounded-xl ${
                    isRec ? 'border-[#38BDF8]/65 bg-[#0A1120] shadow-[0_0_15px_rgba(56,189,248,0.05)]' : 'border-[#1E3A5F] bg-[#0A1120]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${diffColors[project.difficulty]}`}>
                        {project.difficulty}
                      </span>
                      {isRec && (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-2 py-0.5 rounded animate-pulse">
                          <Star size={8} fill="currentColor" />
                          Recommended
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="text-xl">{project.emoji}</span>
                      {project.title}
                    </h3>

                    <p className="text-xs text-[#8BA5C7] leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[9px] font-semibold text-[#8BA5C7] bg-[#162033]/60 px-2 py-0.5 rounded border border-[#1E3A5F]/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1E3A5F]/40 gap-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-[#8BA5C7]">
                      <Clock size={13} className="text-[#38BDF8]" />
                      {project.duration}
                    </div>
                    {inLab ? (
                      <span className="flex items-center gap-1 text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-2.5 py-1 rounded-lg border border-[#10B981]/25">
                        <Check size={12} />
                        In My Lab
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToLab(project)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2563EB] hover:bg-[#2563EB]/90 transition-colors text-white text-xs font-bold rounded-lg cursor-pointer shadow-md"
                      >
                        <Plus size={13} />
                        Add to Lab
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: My Skillovix Lab */}
        <div className="xl:col-span-1 space-y-6 min-w-0">
          <div className="glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-4 min-h-[400px] flex flex-col">
            <div className="pb-2 border-b border-[#1E3A5F]/40">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-[#38BDF8]" />
                My Skillovix Lab
              </h2>
              <p className="text-xs text-[#8BA5C7] mt-0.5">Update project execution status and milestones</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-1 pt-1">
              {labProjects.length > 0 ? (
                labProjects.map((project) => {
                  const statusColors = {
                    'Not Started': 'border-[#1E3A5F] text-[#8BA5C7] bg-[#0A1120]',
                    'In Progress': 'border-[#38BDF8]/40 text-[#38BDF8] bg-[#38BDF8]/5',
                    'Completed': 'border-[#10B981]/40 text-[#10B981] bg-[#10B981]/5'
                  };

                  return (
                    <div key={project.title} className="p-4 rounded-xl border border-[#1E3A5F] bg-[#162033]/20 flex flex-col justify-between space-y-3 shadow-inner">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{project.emoji}</span>
                          <h4 className="text-xs font-bold text-white truncate">{project.title}</h4>
                        </div>
                        <p className="text-[11px] text-[#8BA5C7] line-clamp-2 leading-relaxed">{project.description}</p>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#1E3A5F]/35">
                        <select
                          value={project.status}
                          onChange={(e) => handleUpdateStatus(project.title, e.target.value)}
                          className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-none transition-colors cursor-pointer ${statusColors[project.status]}`}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <button
                          onClick={() => handleRemoveFromLab(project.title)}
                          className="text-[#4B6A9B] hover:text-[#EF4444] p-1.5 rounded transition-colors"
                          title="Remove from lab"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 border border-dashed border-[#1E3A5F] rounded-xl text-[#8BA5C7] text-xs flex flex-col items-center justify-center gap-2 my-auto">
                  <FileCode size={20} className="text-[#4B6A9B]" />
                  Your sandbox is empty. Select "Add to Lab" to track active projects!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
