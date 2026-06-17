import React, { useState, useEffect } from 'react';
import { Zap, ChevronDown, Star, TrendingUp, ArrowRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import useStore from '../store/useStore';
import { CAREERS } from '../data/careers';
import { useNavigate } from 'react-router-dom';

const CAREER_COMPARE_DATA = {
  'Full Stack Developer': {
    timeline: '6–12 months',
    demand: 90,
    demandLabel: 'Very High',
    salaryIndia: '₹8–25 LPA',
    salaryUSA: '$90k–$140k',
    difficulty: 4,
    roles: ['Full Stack Dev', 'MERN Dev', 'Software Engineer'],
    companies: ['Google', 'Amazon', 'Infosys', 'Wipro', 'Startups'],
    salaryIndiaNum: 17,
    salaryUSANum: 115,
  },
  'Frontend Developer': {
    timeline: '4–8 months',
    demand: 78,
    demandLabel: 'High',
    salaryIndia: '₹5–18 LPA',
    salaryUSA: '$75k–$120k',
    difficulty: 3,
    roles: ['Frontend Dev', 'React Dev', 'UI Engineer'],
    companies: ['Flipkart', 'Swiggy', 'Adobe', 'Meta', 'Agencies'],
    salaryIndiaNum: 12,
    salaryUSANum: 97,
  },
  'Backend Developer': {
    timeline: '5–10 months',
    demand: 82,
    demandLabel: 'High',
    salaryIndia: '₹7–22 LPA',
    salaryUSA: '$85k–$135k',
    difficulty: 4,
    roles: ['Backend Dev', 'API Engineer', 'Java Dev'],
    companies: ['Microsoft', 'PayPal', 'TCS', 'HCL'],
    salaryIndiaNum: 15,
    salaryUSANum: 110,
  },
  'Data Scientist': {
    timeline: '8–14 months',
    demand: 92,
    demandLabel: 'Very High',
    salaryIndia: '₹9–30 LPA',
    salaryUSA: '$95k–$155k',
    difficulty: 4,
    roles: ['Data Scientist', 'ML Analyst', 'Research Analyst'],
    companies: ['Amazon', 'Netflix', 'MuSigma', 'Fractal'],
    salaryIndiaNum: 20,
    salaryUSANum: 125,
  },
  'AI/ML Engineer': {
    timeline: '10–18 months',
    demand: 97,
    demandLabel: 'Extreme',
    salaryIndia: '₹12–40 LPA',
    salaryUSA: '$120k–$200k',
    difficulty: 5,
    roles: ['ML Engineer', 'AI Researcher', 'NLP Engineer'],
    companies: ['Google DeepMind', 'OpenAI', 'NVIDIA', 'Jio'],
    salaryIndiaNum: 26,
    salaryUSANum: 160,
  },
  'Cybersecurity Analyst': {
    timeline: '8–14 months',
    demand: 95,
    demandLabel: 'Extreme',
    salaryIndia: '₹8–28 LPA',
    salaryUSA: '$80k–$150k',
    difficulty: 4,
    roles: ['Security Analyst', 'Pen Tester', 'SOC Analyst'],
    companies: ['Deloitte', 'PwC', 'Palo Alto', 'IBM'],
    salaryIndiaNum: 18,
    salaryUSANum: 115,
  },
  'Cloud Engineer': {
    timeline: '7–12 months',
    demand: 88,
    demandLabel: 'Very High',
    salaryIndia: '₹10–32 LPA',
    salaryUSA: '$100k–$160k',
    difficulty: 4,
    roles: ['Cloud Architect', 'AWS Engineer', 'Site Reliability'],
    companies: ['AWS', 'Azure', 'GCP', 'Accenture'],
    salaryIndiaNum: 21,
    salaryUSANum: 130,
  },
  'DevOps Engineer': {
    timeline: '6–12 months',
    demand: 87,
    demandLabel: 'Very High',
    salaryIndia: '₹9–28 LPA',
    salaryUSA: '$95k–$155k',
    difficulty: 4,
    roles: ['DevOps Engineer', 'Platform Engineer', 'SRE'],
    companies: ['Atlassian', 'HashiCorp', 'Razorpay', 'CRED'],
    salaryIndiaNum: 19,
    salaryUSANum: 125,
  },
  'Mobile App Developer': {
    timeline: '5–10 months',
    demand: 75,
    demandLabel: 'High',
    salaryIndia: '₹6–20 LPA',
    salaryUSA: '$80k–$130k',
    difficulty: 3,
    roles: ['Mobile Dev', 'React Native Dev', 'Flutter Dev'],
    companies: ['Zomato', 'Paytm', 'Apple', 'Samsung'],
    salaryIndiaNum: 13,
    salaryUSANum: 105,
  },
};

function DifficultyStars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          fill={i <= count ? '#F59E0B' : 'none'}
          className={i <= count ? 'text-amber-400' : 'text-slate-600'}
        />
      ))}
    </div>
  );
}

function CareerDropdown({ value, onChange, label, exclude }) {
  const options = CAREERS.filter((c) => c.name !== exclude);
  return (
    <div className="relative flex-1">
      <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-2 block">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-6 py-4 pr-10 rounded-xl text-sm font-semibold text-white outline-none cursor-pointer"
          style={{ background: '#0D1B2E', border: '1px solid #1E3A5F' }}
        >
          {options.map((c) => (
            <option key={c.name} value={c.name} style={{ background: '#0A1120' }}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

export default function Compare() {
  const { career, setCareer } = useStore();
  const navigate = useNavigate();
  const careerNames = CAREERS.map((c) => c.name);

  const [careerA, setCareerA] = useState(career || careerNames[0]);
  const [careerB, setCareerB] = useState(
    careerNames.find((c) => c !== (career || careerNames[0])) || careerNames[1]
  );

  useEffect(() => {
    document.title = 'Skillovix | Career Compare';
  }, []);

  const dataA = CAREER_COMPARE_DATA[careerA] || CAREER_COMPARE_DATA[careerNames[0]];
  const dataB = CAREER_COMPARE_DATA[careerB] || CAREER_COMPARE_DATA[careerNames[1]];

  const salaryChartData = [
    {
      name: 'India (LPA)',
      [careerA]: dataA.salaryIndiaNum,
      [careerB]: dataB.salaryIndiaNum,
    },
    {
      name: 'USA (k$)',
      [careerA]: dataA.salaryUSANum,
      [careerB]: dataB.salaryUSANum,
    },
  ];

  const demandData = [
    { name: careerA, value: dataA.demand },
    { name: careerB, value: dataB.demand },
  ];

  const better = (valA, valB, higherIsBetter = true) => {
    if (higherIsBetter) return valA > valB ? 'A' : valA < valB ? 'B' : 'tie';
    return valA < valB ? 'A' : valA > valB ? 'B' : 'tie';
  };

  const cardStyle = {
    background: '#0D1B2E',
    border: '1px solid #1E3A5F',
    borderRadius: '16px',
  };

  const highlightA = { background: '#1a2f1a', border: '1px solid #22C55E40' };
  const highlightB = { background: '#1a1a2f', border: '1px solid #38BDF840' };

  // Recommendation logic
  const aScore = dataA.demand + dataA.salaryIndiaNum * 2 - dataA.difficulty * 5;
  const bScore = dataB.demand + dataB.salaryIndiaNum * 2 - dataB.difficulty * 5;
  const recommended = aScore >= bScore ? careerA : careerB;
  const recommendedData = recommended === careerA ? dataA : dataB;

  const tableRows = [
    {
      label: 'Learning Timeline',
      a: dataA.timeline,
      b: dataB.timeline,
      best: 'tie',
    },
    {
      label: 'Market Demand',
      a: `${dataA.demandLabel} (${dataA.demand}%)`,
      b: `${dataB.demandLabel} (${dataB.demand}%)`,
      best: better(dataA.demand, dataB.demand),
    },
    {
      label: 'Salary — India',
      a: dataA.salaryIndia,
      b: dataB.salaryIndia,
      best: better(dataA.salaryIndiaNum, dataB.salaryIndiaNum),
    },
    {
      label: 'Salary — USA',
      a: dataA.salaryUSA,
      b: dataB.salaryUSA,
      best: better(dataA.salaryUSANum, dataB.salaryUSANum),
    },
    {
      label: 'Difficulty',
      a: <DifficultyStars count={dataA.difficulty} />,
      b: <DifficultyStars count={dataB.difficulty} />,
      best: better(dataA.difficulty, dataB.difficulty, false),
    },
    {
      label: 'Job Roles',
      a: dataA.roles.join(' · '),
      b: dataB.roles.join(' · '),
      best: 'tie',
    },
    {
      label: 'Top Companies',
      a: dataA.companies.join(' · '),
      b: dataB.companies.join(' · '),
      best: 'tie',
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#070E1A] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          ⚖️ Skillovix Career Comparison
        </h1>
        <p className="text-slate-400 mt-2">Compare tech careers and make the right choice</p>
      </div>

      {/* Selectors */}
      <div className="flex items-end gap-8 flex-col sm:flex-row">
        <CareerDropdown
          value={careerA}
          onChange={setCareerA}
          label="Career A"
          exclude={careerB}
        />
        <div
          className="flex items-center justify-center shrink-0 font-black text-white text-sm"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
            boxShadow: '0 0 20px rgba(37,99,235,0.5)',
          }}
        >
          VS
        </div>
        <CareerDropdown
          value={careerB}
          onChange={setCareerB}
          label="Career B"
          exclude={careerA}
        />
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-6 py-5 border-b" style={{ borderColor: '#1E3A5F' }}>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-sky-400" />
            Skillovix Career Analysis
          </h2>
        </div>
        {/* Header Row */}
        <div className="grid grid-cols-3 px-6 py-4 border-b" style={{ borderColor: '#1E3A5F', background: '#162033' }}>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Metric</span>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider text-center">{careerA}</span>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider text-center">{careerB}</span>
        </div>
        {tableRows.map((row, i) => (
          <div
            key={row.label}
            className="grid grid-cols-3 px-6 border-b items-center transition-colors hover:bg-slate-800/30"
            style={{
              borderColor: '#1E3A5F',
              background: i % 2 === 0 ? 'transparent' : '#0A1528',
              minHeight: '56px',
            }}
          >
            <span className="text-sm text-slate-300 font-bold py-4">{row.label}</span>
            <div
              className="text-sm font-semibold text-center px-6 py-2 rounded-lg mx-auto"
              style={row.best === 'A' ? highlightA : {}}
            >
              <span className={row.best === 'A' ? 'text-emerald-400' : 'text-slate-300'}>
                {typeof row.a === 'string' ? row.a : row.a}
              </span>
            </div>
            <div
              className="text-sm font-semibold text-center px-6 py-2 rounded-lg mx-auto"
              style={row.best === 'B' ? highlightB : {}}
            >
              <span className={row.best === 'B' ? 'text-sky-400' : 'text-slate-300'}>
                {typeof row.b === 'string' ? row.b : row.b}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Salary */}
        <div className="p-6 rounded-2xl space-y-4" style={cardStyle}>
          <h3 className="text-sm font-bold text-white mb-6">Skillovix Salary Comparison</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salaryChartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="name" tick={{ fill: '#8BA5C7', fontSize: 13 }} />
              <YAxis tick={{ fill: '#8BA5C7', fontSize: 13 }} />
              <Tooltip
                contentStyle={{ background: '#0D1B2E', border: '1px solid #1E3A5F', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#8BA5C7' }}
              />
              <Bar dataKey={careerA} fill="#38BDF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey={careerB} fill="#A855F7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sky-400 inline-block" />{careerA}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-400 inline-block" />{careerB}</span>
          </div>
        </div>

        {/* Market Demand */}
        <div className="p-6 rounded-2xl space-y-4" style={cardStyle}>
          <h3 className="text-sm font-bold text-white mb-6">Market Demand on Skillovix</h3>
          <div className="space-y-6 mt-4">
            {demandData.map((item, i) => (
              <div key={item.name} className="space-y-2 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium truncate max-w-[60%]">{item.name}</span>
                  <span className="font-bold text-lg" style={{ color: i === 0 ? '#38BDF8' : '#A855F7' }}>
                    {item.value}%
                  </span>
                </div>
                <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.value}%`,
                      background: i === 0
                        ? 'linear-gradient(90deg, #2563EB, #38BDF8)'
                        : 'linear-gradient(90deg, #7C3AED, #A855F7)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl text-sm text-slate-400" style={{ background: '#162033' }}>
            Higher % = more job postings & industry demand in 2026
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div
        className="p-8 rounded-2xl space-y-5"
        style={{
          background: 'linear-gradient(135deg, #0D1B2E, #162033)',
          border: '1px solid #2563EB40',
        }}
      >
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <Zap size={18} className="text-yellow-400" fill="currentColor" />
          ⚡ Skillovix Recommendation
        </h2>
        <p className="text-slate-300 text-base leading-relaxed">
          Based on market demand, salary potential, and learning investment,{' '}
          <span className="font-bold text-white">{recommended}</span> is the stronger career choice
          right now. With {recommendedData.demandLabel.toLowerCase()} demand and salaries reaching{' '}
          <span className="font-bold text-sky-400">{recommendedData.salaryIndia}</span> in India,
          this path offers excellent ROI for your Skillovix journey.
        </p>
        <button
          onClick={() => {
            setCareer(recommended);
            navigate('/assessment');
          }}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
            boxShadow: '0 0 20px rgba(37,99,235,0.4)',
          }}
        >
          Switch to {recommended} on Skillovix
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
