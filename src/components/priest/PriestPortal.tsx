import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  PriestProfile,
  Vacancy,
  Application,
  ContributorProposal,
  Temple,
  Message,
} from '../../types';
import {
  Flame,
  User,
  Briefcase,
  FileCheck2,
  Lock,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Building,
  Save,
  Send,
  AlertCircle,
  HelpCircle,
  XCircle,
  Filter,
  Check,
} from 'lucide-react';

export const PriestPortal: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'vacancies' | 'applications' | 'contributor' | 'messages'>('profile');
  const [loading, setLoading] = useState(true);

  // Profile State
  const [profile, setProfile] = useState<PriestProfile | null>(null);
  const [tradition, setTradition] = useState('Smartha / Saiva Agama');
  const [vedaShakha, setVedaShakha] = useState('Rigveda - Shakala Shakha');
  const [experienceYears, setExperienceYears] = useState(12);
  const [pathashala, setPathashala] = useState('Sri Kanchi Veda Pathashala');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Nitya Puja & Archana',
    'Rudrabhishekam',
    'Ganapati Homam',
    'Navagraha Havan',
    'Vivaham (Marriage rites)',
    'Upanayanam',
  ]);
  const [languages, setLanguages] = useState<string[]>(['Sanskrit', 'Tamil', 'Telugu']);
  const [contactConsent, setContactConsent] = useState(true);
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Vacancies State
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [filterSkill, setFilterSkill] = useState('');
  const [filterTradition, setFilterTradition] = useState('');
  const [filterAccom, setFilterAccom] = useState(false);
  const [selectedVacancyToApply, setSelectedVacancyToApply] = useState<Vacancy | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [availableFrom, setAvailableFrom] = useState('2026-05-01');
  const [applying, setApplying] = useState(false);

  // Applications State
  const [myApplications, setMyApplications] = useState<Application[]>([]);

  // Contributor Workspace State
  const [contributorTemples, setContributorTemples] = useState<Temple[]>([]);
  const [myProposals, setMyProposals] = useState<ContributorProposal[]>([]);
  const [selectedTempleForProposal, setSelectedTempleForProposal] = useState<string>('');
  const [proposalType, setProposalType] = useState<string>('timings');
  const [proposedText, setProposedText] = useState('{"morning": "5:30 AM - 12:30 PM", "evening": "4:00 PM - 9:30 PM"}');
  const [proposalRationale, setProposalRationale] = useState('Adjusting for upcoming seasonal Brahmotsavam utsavam schedule.');
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalSuccessMsg, setProposalSuccessMsg] = useState<string | null>(null);

  // Messages State
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');

  const ritualSkillsCatalog = [
    'Nitya Puja & Archana',
    'Rudrabhishekam',
    'Maha Ganapati Homam',
    'Navagraha Havan',
    'Vivaham (Marriage rites)',
    'Upanayanam & Gayatri Diksha',
    'Vastu Shanti Puja',
    'Sudarshana Homam',
    'Chandi Parayanam & Havan',
    'Kumbhabhishekam Kainkaryam',
    'Alankaram Specialization',
  ];

  const loadPriestData = async () => {
    setLoading(true);
    try {
      const [prof, vacs, apps, cTemples, props, msgs] = await Promise.all([
        api.getPriestProfile(),
        api.searchVacancies(),
        api.getMyApplications(),
        api.getContributorTemples(),
        api.getMyProposals(),
        api.getMessages(),
      ]);

      if (prof) {
        setProfile(prof);
        setTradition(prof.tradition || prof.vedaTradition || 'Smartha / Saiva Agama');
        setVedaShakha(prof.vedaShakha || 'Rigveda - Shakala Shakha');
        setExperienceYears(prof.experienceYears || 10);
        setPathashala(prof.pathashala || prof.trainingQualifications || 'Sri Kanchi Veda Pathashala');
        setSelectedSkills(prof.skills || prof.purohithamSkills || []);
        setLanguages(prof.languages || ['Sanskrit', 'Tamil']);
        setContactConsent(prof.contactVisibilityConsent ?? prof.shareContactConsent ?? true);
      }

      setVacancies(vacs);
      setMyApplications(apps);
      setContributorTemples(cTemples);
      if (cTemples.length > 0) {
        setSelectedTempleForProposal(cTemples[0].id);
      }
      setMyProposals(props);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load priest data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPriestData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSavedMsg(null);
    try {
      const res = await api.updatePriestProfile({
        tradition,
        vedaShakha,
        experienceYears,
        pathashala,
        skills: selectedSkills,
        languages,
        contactVisibilityConsent: contactConsent,
      });
      setProfile(res.profile);
      setProfileSavedMsg('Vedic profile & Purohitham portfolio saved successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancyToApply) return;
    setApplying(true);
    try {
      await api.applyForVacancy(selectedVacancyToApply.id, {
        coverNote,
        availableFrom,
      });
      setSelectedVacancyToApply(null);
      setCoverNote('');
      const apps = await api.getMyApplications();
      setMyApplications(apps);
      setActiveTab('applications');
    } catch (err: any) {
      alert(err.message || 'Failed to apply for vacancy');
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.withdrawApplication(applicationId);
      const apps = await api.getMyApplications();
      setMyApplications(apps);
    } catch (err: any) {
      alert(err.message || 'Failed to withdraw application');
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTempleForProposal) {
      alert('Please select an authorized temple.');
      return;
    }

    setSubmittingProposal(true);
    setProposalSuccessMsg(null);

    let parsedData = proposedText;
    try {
      parsedData = JSON.parse(proposedText);
    } catch {
      // treat as raw string
    }

    try {
      const res = await api.proposeTempleUpdate(selectedTempleForProposal, {
        updateType: proposalType,
        proposedData: parsedData,
        rationale: proposalRationale,
      });
      setProposalSuccessMsg('Proposal submitted to temple administrator for review.');
      const props = await api.getMyProposals();
      setMyProposals(props);
    } catch (err: any) {
      alert(err.message || 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleFilterVacancies = async () => {
    try {
      const vacs = await api.searchVacancies({
        skill: filterSkill || undefined,
        tradition: filterTradition || undefined,
        accommodation: filterAccom || undefined,
      });
      setVacancies(vacs);
    } catch (err) {
      console.warn('Failed to filter vacancies:', err);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-50">
        <div className="text-center text-xs text-stone-500">
          <Flame className="w-8 h-8 text-emerald-600 animate-pulse mx-auto mb-2" />
          <span>Loading Vedic Priest Portfolio & Opportunities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/60 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white border-b border-emerald-900/40 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Flame className="w-3.5 h-3.5" />
              Certified Vedic Priest & Scholar Portal
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{user?.name}</span>
            </h1>
            <p className="text-xs text-stone-300 mt-0.5">
              {tradition} • {vedaShakha} • {experienceYears} Years Kainkaryam
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('vacancies')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow-sm transition-colors flex items-center gap-2"
              id="browse-vacancies-header-btn"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Vacancies ({vacancies.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center space-x-1 border-b border-stone-200 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>Vedic Ritual Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('vacancies')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'vacancies'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Temple Openings ({vacancies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>My Applications ({myApplications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contributor')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'contributor'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Authorized Contributor Workspace</span>
            {contributorTemples.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {contributorTemples.length} Temple(s)
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Admin Messages ({messages.length})</span>
          </button>
        </div>

        {/* Tab 1: VEDIC RITUAL PROFILE */}
        {activeTab === 'profile' && (
          <div className="py-6 space-y-6">
            {profileSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-stone-900">
                    Vedic Pedigree & Ritual Qualifications
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    This profile is analyzed by TempleConnect's AI matching engine when you apply for temple vacancies.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Sampradaya / Tradition *
                  </label>
                  <select
                    value={tradition}
                    onChange={(e) => setTradition(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Smartha / Saiva Agama">Smartha / Saiva Agama</option>
                    <option value="Sri Vaishnava (Pancharatra)">Sri Vaishnava (Pancharatra)</option>
                    <option value="Sri Vaishnava (Vaikhanasa)">Sri Vaishnava (Vaikhanasa)</option>
                    <option value="Madhwa Sampradaya">Madhwa Sampradaya</option>
                    <option value="Rigveda Shakala">Rigveda Shakala</option>
                    <option value="Krishna Yajurveda Taittiriya">Krishna Yajurveda Taittiriya</option>
                    <option value="Sukla Yajurveda Madhyandina">Sukla Yajurveda Madhyandina</option>
                    <option value="Samaveda Kauthuma">Samaveda Kauthuma</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Veda Shakha *
                  </label>
                  <input
                    type="text"
                    required
                    value={vedaShakha}
                    onChange={(e) => setVedaShakha(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Years of Temple Kainkaryam & Archana Experience
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Pathashala / Gurukulam Attended
                  </label>
                  <input
                    type="text"
                    value={pathashala}
                    onChange={(e) => setPathashala(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Ritual Skills Checklist */}
              <div>
                <label className="font-semibold text-stone-700 block mb-2">
                  Ritual Specializations & Havan Portfolio:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {ritualSkillsCatalog.map((skill) => (
                    <div
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{skill}</span>
                      {selectedSkills.includes(skill) && (
                        <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Consent */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactConsent}
                    onChange={(e) => setContactConsent(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Contact Visibility Consent
                    </span>
                    <span className="text-stone-500 text-[11px] leading-relaxed">
                      Allow authorized temple administrators to view your direct phone and email when you apply for a vacancy or when they shortlist your profile.
                    </span>
                  </div>
                </label>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: TEMPLE OPENINGS */}
        {activeTab === 'vacancies' && (
          <div className="py-6 space-y-5">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-stone-700">Filter By:</span>
                </div>

                <input
                  type="text"
                  placeholder="Ritual skill (e.g. Saiva Agama)..."
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />

                <input
                  type="text"
                  placeholder="Tradition (e.g. Rigveda)..."
                  value={filterTradition}
                  onChange={(e) => setFilterTradition(e.target.value)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />

                <label className="flex items-center gap-1.5 font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={filterAccom}
                    onChange={(e) => setFilterAccom(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span>Accommodation Provided</span>
                </label>
              </div>

              <button
                onClick={handleFilterVacancies}
                className="px-3.5 py-1.5 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800"
              >
                Apply Filters
              </button>
            </div>

            {/* Vacancies List */}
            <div className="grid grid-cols-1 gap-4">
              {vacancies.map((vac) => {
                const alreadyApplied = myApplications.some((a) => a.vacancyId === vac.id);
                return (
                  <div
                    key={vac.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs text-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-cinzel text-base font-bold text-stone-900">
                          {vac.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {vac.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-stone-600 font-medium">
                        Temple: <strong className="text-stone-900">{vac.templeName}</strong> ({vac.location})
                      </p>

                      <p className="text-stone-500">
                        Tradition: <strong>{vac.vedaTraditionRequired}</strong> • Experience Required: <strong>{vac.minExperienceYears}+ years</strong>
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {vac.ritualSpecialization.map((sk: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[10px] font-semibold"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 text-[11px] text-stone-600 flex flex-wrap gap-4">
                        <span>Remuneration: <strong className="text-stone-900">{vac.remuneration}</strong></span>
                        <span>Quarters: <strong className="text-stone-900">{vac.accommodationProvided ? 'Provided' : 'Self'}</strong></span>
                        <span>Prasadam: <strong className="text-stone-900">{vac.foodProvided ? 'Provided' : 'Self'}</strong></span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {alreadyApplied ? (
                        <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-500 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Application Submitted</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedVacancyToApply(vac);
                            setCoverNote(`Namaskaram. I have ${experienceYears} years of experience in ${tradition} and hold diplomas in ${selectedSkills.slice(0, 3).join(', ')}. I would be honored to render kainkaryam at ${vac.templeName}.`);
                          }}
                          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <Flame className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Apply for Position</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: MY APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="py-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-stone-900 mb-2">
              Submitted Applications & Status Tracking ({myApplications.length})
            </h3>

            {myApplications.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-xs text-stone-500">
                You have not submitted any applications yet. Explore openings to apply.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs text-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div>
                        <h4 className="font-cinzel text-base font-bold text-stone-900">
                          {app.vacancyTitle}
                        </h4>
                        <p className="text-stone-500">
                          {app.templeName} • Submitted on {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                          app.status === 'selected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'shortlisted'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'withdrawn'
                            ? 'bg-stone-100 text-stone-500'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                        {app.status !== 'withdrawn' && app.status !== 'selected' && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className="px-2.5 py-1 text-red-600 hover:text-red-800 text-[11px] font-semibold"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar Flow */}
                    <div className="grid grid-cols-5 gap-2 pt-1 text-center text-[10px] font-semibold text-stone-400">
                      <div className={`p-2 rounded-lg ${app.status !== 'withdrawn' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'bg-stone-50'}`}>
                        1. Submitted
                      </div>
                      <div className={`p-2 rounded-lg ${['under_review', 'shortlisted', 'contacted', 'selected'].includes(app.status) ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'bg-stone-50'}`}>
                        2. Under Review
                      </div>
                      <div className={`p-2 rounded-lg ${['shortlisted', 'contacted', 'selected'].includes(app.status) ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200' : 'bg-stone-50'}`}>
                        3. Shortlisted
                      </div>
                      <div className={`p-2 rounded-lg ${['contacted', 'selected'].includes(app.status) ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' : 'bg-stone-50'}`}>
                        4. Contacted
                      </div>
                      <div className={`p-2 rounded-lg ${app.status === 'selected' ? 'bg-emerald-600 text-white font-bold' : 'bg-stone-50'}`}>
                        5. Selected
                      </div>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-600">
                      <span className="font-bold text-stone-800 block mb-0.5">Your Application Cover Note:</span>
                      <p className="italic">"{app.coverNote}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: AUTHORIZED CONTRIBUTOR WORKSPACE */}
        {activeTab === 'contributor' && (
          <div className="py-6 space-y-6">
            {/* Rule Box */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                <Lock className="w-4 h-4 text-emerald-700" />
                Authorized Contributor Protocol
              </span>
              <p className="leading-relaxed">
                You can propose updates only for temples where an administrator has explicitly granted you contributor permissions. All proposed updates are vetted by the temple management before going live.
              </p>
            </div>

            {contributorTemples.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center text-xs text-stone-500">
                <Lock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h4 className="font-cinzel text-base font-bold text-stone-800 mb-1">
                  No Contributor Permissions Assigned Yet
                </h4>
                <p className="max-w-md mx-auto leading-relaxed">
                  You do not currently have contributor access to any temples. Temple administrators must explicitly authorize your profile before you can propose updates for their sanctum.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Proposal Submission Form */}
                <form onSubmit={handleSubmitProposal} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4 text-xs">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="font-cinzel text-base font-bold text-stone-900">
                      Propose Temple Record Update
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Submit schedule or ritual revisions for an authorized temple.
                    </p>
                  </div>

                  {proposalSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{proposalSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Select Authorized Temple *
                      </label>
                      <select
                        value={selectedTempleForProposal}
                        onChange={(e) => setSelectedTempleForProposal(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        {contributorTemples.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Update Category *
                      </label>
                      <select
                        value={proposalType}
                        onChange={(e) => setProposalType(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        <option value="timings">Sanctum Timings</option>
                        <option value="pujas">Pujas & Rituals</option>
                        <option value="events">Upcoming Festivals</option>
                        <option value="description">Description & Sthala Puranam</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Proposed Data / Payload (JSON or Text)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={proposedText}
                      onChange={(e) => setProposedText(e.target.value)}
                      className="w-full font-mono text-[11px] px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Agamic or Sthala Rationale *
                    </label>
                    <input
                      type="text"
                      required
                      value={proposalRationale}
                      onChange={(e) => setProposalRationale(e.target.value)}
                      placeholder="e.g. Extending evening darshan for Karthigai Deepam festival"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingProposal}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingProposal ? 'Submitting...' : 'Submit Proposal to Admin'}</span>
                    </button>
                  </div>
                </form>

                {/* Proposals History Tracker */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                  <h3 className="font-cinzel text-base font-bold text-stone-900 mb-3">
                    Your Submitted Proposals ({myProposals.length})
                  </h3>

                  {myProposals.length === 0 ? (
                    <p className="text-xs text-stone-500 py-4 text-center">No proposals submitted yet.</p>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {myProposals.map((prop) => (
                        <div key={prop.id} className="py-3 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">{prop.templeName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              prop.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : prop.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {prop.status}
                            </span>
                          </div>
                          <div className="text-stone-600">
                            Update: <strong>{prop.updateType}</strong> • Rationale: "{prop.rationale}"
                          </div>
                          {prop.adminFeedback && (
                            <div className="p-2 bg-stone-50 rounded-lg text-stone-700 text-[11px]">
                              <strong>Admin Feedback:</strong> {prop.adminFeedback}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="py-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-stone-900 mb-2">
              Messages from Temple Administrators ({messages.length})
            </h3>

            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-xs text-stone-500">
                No direct messages yet.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{msg.senderName}</span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* APPLY MODAL */}
      {selectedVacancyToApply && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  Apply for Kainkaryam Position
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedVacancyToApply.title} at {selectedVacancyToApply.templeName}
                </p>
              </div>
              <button
                onClick={() => setSelectedVacancyToApply(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Vedic Credentials & Cover Note *
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Detail your pathashala training, previous kainkaryam experience, and commitment to the presiding deity."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Available to Join From *
                </label>
                <input
                  type="date"
                  required
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                ⚡ Your profile ({tradition}, {selectedSkills.length} ritual skills, {experienceYears} yrs experience) will be automatically attached and analyzed by the temple's AI screening system.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVacancyToApply(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  {applying ? 'Submitting Application...' : 'Confirm & Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
