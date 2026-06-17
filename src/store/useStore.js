import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: {
        name: '',
        email: '',
        isLoggedIn: false,
      },

      // Career & Assessment state
      career: '',
      currentSkills: [],
      experienceLevel: '',
      studyHours: 10,
      educationLevel: 'Undergraduate - 3rd Year',
      completedSkills: {}, // { careerName: [skillName, ...] }

      // Theme
      theme: 'dark',

      // AI Mentor chat history
      chatHistory: [],

      // Readiness page data
      projectsBuilt: [],   // array of project name strings
      certifications: [],  // array of { name, issuer }

      // Actions
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData, isLoggedIn: true },
        })),

      setCareer: (career) => set({ career }),

      setSkills: (skills) => set({ currentSkills: skills }),

      toggleSkill: (skill) =>
        set((state) => ({
          currentSkills: state.currentSkills.includes(skill)
            ? state.currentSkills.filter((s) => s !== skill)
            : [...state.currentSkills, skill],
        })),

      setExperienceLevel: (level) => set({ experienceLevel: level }),

      setStudyHours: (hours) => set({ studyHours: hours }),

      setEducationLevel: (level) => set({ educationLevel: level }),

      setCompletedSkills: (careerName, skills) =>
        set((state) => ({
          completedSkills: {
            ...state.completedSkills,
            [careerName]: skills,
          },
        })),

      toggleCompletedSkill: (careerName, skillName) =>
        set((state) => {
          const existing = state.completedSkills[careerName] || [];
          const updated = existing.includes(skillName)
            ? existing.filter((s) => s !== skillName)
            : [...existing, skillName];
          return {
            completedSkills: {
              ...state.completedSkills,
              [careerName]: updated,
            },
          };
        }),

      setTheme: (theme) => {
        set({ theme });
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
          document.documentElement.style.backgroundColor = '';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          document.documentElement.style.backgroundColor = '#F8FAFC';
        }
      },

      toggleTheme: () => {
        const current = get().theme;
        const newTheme = current === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
          document.documentElement.style.backgroundColor = '';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          document.documentElement.style.backgroundColor = '#F8FAFC';
        }
      },

      // Chat history actions
      addMessage: (message) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, message],
        })),

      clearChatHistory: () => set({ chatHistory: [] }),

      // Readiness actions
      addProject: (project) =>
        set((state) => ({
          projectsBuilt: [...state.projectsBuilt, project],
        })),

      removeProject: (index) =>
        set((state) => ({
          projectsBuilt: state.projectsBuilt.filter((_, i) => i !== index),
        })),

      addCertification: (cert) =>
        set((state) => ({
          certifications: [...state.certifications, cert],
        })),

      removeCertification: (index) =>
        set((state) => ({
          certifications: state.certifications.filter((_, i) => i !== index),
        })),

      logout: () =>
        set({
          user: { name: '', email: '', isLoggedIn: false },
          career: '',
          currentSkills: [],
          experienceLevel: '',
          studyHours: 10,
          educationLevel: 'Undergraduate - 3rd Year',
          completedSkills: {},
          chatHistory: [],
          projectsBuilt: [],
          certifications: [],
        }),

      setAssessmentData: (data) =>
        set({
          career: data.career || '',
          currentSkills: data.currentSkills || [],
          experienceLevel: data.experienceLevel || '',
          studyHours: data.studyHours || 10,
          educationLevel: data.educationLevel || 'Undergraduate - 3rd Year',
        }),
    }),
    {
      name: 'skillovix-storage',
      partialize: (state) => ({
        user: state.user,
        career: state.career,
        currentSkills: state.currentSkills,
        experienceLevel: state.experienceLevel,
        studyHours: state.studyHours,
        educationLevel: state.educationLevel,
        completedSkills: state.completedSkills,
        theme: state.theme,
        chatHistory: state.chatHistory,
        projectsBuilt: state.projectsBuilt,
        certifications: state.certifications,
      }),
    }
  )
);

export default useStore;
