import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Temple,
  Vacancy,
  Application,
  ContributorProposal,
  AuditLog,
  Puja,
  TempleEvent,
} from '../../types';
import {
  ShieldCheck,
  Building,
  Calendar,
  Briefcase,
  Users,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  AlertTriangle,
  History,
  Lock,
  ChevronRight,
  ExternalLink,
  Save,
  Flame,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();

  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'vacancies' | 'applications' | 'contributors' | 'audit'>('overview');

  // Related data
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [contributors, setContributors] = useState<any[]>([]);
  const [availablePriests, setAvailablePriests] = useState<any[]>([]);
  const [proposals, setProposals] = useState<ContributorProposal[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Sub-modals & forms
  const [showNewVacancyModal, setShowNewVacancyModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [aiMatchData, setAiMatchData] = useState<any | null>(null);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Proposal review modal
  const [selectedProposal, setSelectedProposal] = useState<ContributorProposal | null>(null);
  const [proposalFeedback, setProposalFeedback] = useState('');

  // Temple Edit Form State
  const [editTimingsMorning, setEditTimingsMorning] = useState('');
  const [editTimingsEvening, setEditTimingsEvening] = useState('');
  const [editDressCode, setEditDressCode] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // New Event Form State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-04-14');
  const [newEventTime, setNewEventTime] = useState('06:00 AM');
  const [newEventDesc, setNewEventDesc] = useState('');

  // New Vacancy Form State
  const [newVacTitle, setNewVacTitle] = useState('Senior Archakar / Vedic Priest');
  const [newVacTradition, setNewVacTradition] = useState('Rigveda / Saiva Agama');
  const [newVacExp, setNewVacExp] = useState('5');
  const [newVacSalary, setNewVacSalary] = useState('₹45,000 / month + Sambhavana');
  const [newVacDuties, setNewVacDuties] = useState('Daily Morning & Evening Abhishekam, Nitya Sandhya, Aradhana');
  const [newVacSkills, setNewVacSkills] = useState('Saiva Agama, Rudrabhishekam, Suprabhatam');
  const [newVacAccom, setNewVacAccom] = useState(true);
  const [newVacFood, setNewVacFood] = useState(true);
  const [newVacJoinDate, setNewVacJoinDate] = useState('2026-05-01');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const t = await api.getMyTemple();
      setTemple(t);
      setEditTimingsMorning(t.timings.morning);
      setEditTimingsEvening(t.timings.evening);
      setEditDressCode(t.dressCode || '');
      setEditDescription(t.description);

      const [vList, aList, cData, pList, aLogs] = await Promise.all([
        api.getTempleVacancies(t.id),
        api.getTempleApplications(t.id),
        api.getContributors(t.id),
        api.getTempleProposals(t.id),
        api.getAuditLogs(t.id),
      ]);

      setVacancies(vList);
      setApplications(aList);
      setContributors(cData.contributors);
      setAvailablePriests(cData.availablePriests);
      setProposals(pList);
      setAuditLogs(aLogs);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update Temple Details
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temple) return;
    setEditSaving(true);
    setSaveSuccessMsg(null);
    try {
      const res = await api.updateTemple(temple.id, {
        timings: {
          ...temple.timings,
          morning: editTimingsMorning,
          evening: editTimingsEvening,
        },
        dressCode: editDressCode,
        description: editDescription,
      });
      setTemple(res.temple);
      setSaveSuccessMsg('Temple details and sanctum schedule updated successfully.');
      const aLogs = await api.getAuditLogs(temple.id);
      setAuditLogs(aLogs);
    } catch (err: any) {
      alert(err.message || 'Failed to update details');
    } finally {
      setEditSaving(false);
    }
  };

  // Create Event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temple) return;
    try {
      await api.addEvent(temple.id, {
        title: newEventTitle,
        date: newEventDate,
        time: newEventTime,
        description: newEventDesc,
      });
      setShowEventModal(false);
      setNewEventTitle('');
      setNewEventDesc('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add festival event');
    }
  };

  // Delete Event
  const handleDeleteEvent = async (eventId: string) => {
    if (!temple) return;
    if (!confirm('Are you sure you want to remove this festival event?')) return;
    try {
      await api.deleteEvent(temple.id, eventId);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove festival event');
    }
  };

  // Create Vacancy
  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temple) return;
    try {
      await api.createVacancy(temple.id, {
        title: newVacTitle,
        vedaTraditionRequired: newVacTradition,
        minExperienceYears: parseInt(newVacExp) || 3,
        ritualSpecialization: newVacSkills.split(',').map((s) => s.trim()),
        description: newVacDuties,
        remuneration: newVacSalary,
        accommodationProvided: newVacAccom,
        foodProvided: newVacFood,
        location: `${temple.city}, ${temple.state}`,
      });
      setShowNewVacancyModal(false);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to post vacancy');
    }
  };

  // AI Matching for Applicant
  const handleAnalyzeApplicant = async (app: Application) => {
    setSelectedApplication(app);
    setAdminNote(app.adminNotes || '');
    setMessageSent(false);
    setAiMatchLoading(true);
    setAiMatchData(null);
    try {
      const match = await api.aiMatchPriest(app.vacancyId, app.priestId);
      setAiMatchData(match);
    } catch (err: any) {
      console.warn('AI matching error:', err);
    } finally {
      setAiMatchLoading(false);
    }
  };

  // Update Application Status
  const handleUpdateAppStatus = async (status: string) => {
    if (!selectedApplication) return;
    try {
      const res = await api.updateApplicationStatus(selectedApplication.id, {
        status,
        adminNotes: adminNote,
      });
      setSelectedApplication(res.application);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Send Direct Message to Priest
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication || !messageText.trim()) return;
    try {
      await api.sendMessage({
        recipientId: selectedApplication.priestId,
        content: messageText,
        templeId: temple?.id,
        applicationId: selectedApplication.id,
      });
      setMessageText('');
      setMessageSent(true);
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    }
  };

  // Contributor Grant / Revoke
  const handleGrantContributor = async (priestId: string) => {
    if (!temple) return;
    try {
      await api.grantContributor(temple.id, priestId);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to grant contributor access');
    }
  };

  const handleRevokeContributor = async (priestId: string) => {
    if (!temple) return;
    if (!confirm('Revoke contributor access for this priest?')) return;
    try {
      await api.revokeContributor(temple.id, priestId);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke contributor access');
    }
  };

  // Review Proposal
  const handleReviewProposal = async (action: 'approve' | 'reject') => {
    if (!selectedProposal) return;
    try {
      await api.reviewProposal(selectedProposal.id, {
        action,
        feedback: proposalFeedback,
      });
      setSelectedProposal(null);
      setProposalFeedback('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to process proposal review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-50">
        <div className="text-center text-xs text-stone-500">
          <ShieldCheck className="w-8 h-8 text-orange-600 animate-pulse mx-auto mb-2" />
          <span>Authenticating Temple Administration Privileges...</span>
        </div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-50 p-4">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center max-w-md">
          <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <h3 className="font-cinzel text-lg font-bold text-stone-900 mb-1">
            No Temple Assigned
          </h3>
          <p className="text-xs text-stone-600 mb-4">
            Your administrator account does not currently have ownership over any active temple registry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/60 pb-16">
      {/* Top Banner with Authorized Temple Name */}
      <div className="bg-gradient-to-r from-stone-900 via-orange-950 to-stone-900 text-white border-b border-orange-900/40 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authorized Sanctum Governance
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{temple.name}</span>
            </h1>
            <p className="text-xs text-stone-300 mt-0.5">
              {temple.city}, {temple.state} • Deity: {temple.deity} • Status: Representative Verified
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewVacancyModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-sm transition-colors flex items-center gap-2"
              id="post-vacancy-header-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Post Priest Vacancy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center space-x-1 border-b border-stone-200 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building className="w-4 h-4 text-orange-600" />
            <span>Overview & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Edit3 className="w-4 h-4 text-orange-600" />
            <span>Sanctum & Pujas</span>
          </button>

          <button
            onClick={() => setActiveTab('vacancies')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'vacancies'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-orange-600" />
            <span>Priest Vacancies ({vacancies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4 text-orange-600" />
            <span>Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contributors')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'contributors'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-4 h-4 text-orange-600" />
            <span>Contributors ({contributors.length})</span>
            {proposals.filter((p) => p.status === 'pending_admin_review').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <History className="w-4 h-4 text-orange-600" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="py-6 space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Active Vacancies
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-stone-900">
                    {vacancies.filter((v) => v.status === 'open').length}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Total Priest Applicants
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-stone-900">{applications.length}</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Approved Contributors
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-stone-900">{contributors.length}</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Audit Actions Logged
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-stone-900">{auditLogs.length}</span>
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                    <History className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Pending proposals alert */}
            {proposals.filter((p) => p.status === 'pending_admin_review').length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Pending Contributor Proposals Awaiting Review
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      {proposals.filter((p) => p.status === 'pending_admin_review').length} update(s) proposed by authorized priests.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('contributors')}
                  className="px-3.5 py-1.5 bg-amber-700 text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition-colors"
                >
                  Review Diff
                </button>
              </div>
            )}

            {/* Recent Applicants Section */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel text-base font-bold text-stone-900">
                  Recent Priest Applications
                </h3>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs text-orange-700 hover:text-orange-800 font-bold"
                >
                  View All ({applications.length}) →
                </button>
              </div>

              {applications.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">
                  No priest applications received yet. Vacancies posted will appear here.
                </p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-stone-900 block">{app.priestName}</span>
                        <span className="text-stone-500">
                          Applied for: <strong className="text-stone-700">{app.vacancyTitle}</strong> • {new Date(app.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                          {app.status.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('applications');
                            handleAnalyzeApplicant(app);
                          }}
                          className="px-3 py-1 bg-orange-50 text-orange-800 hover:bg-orange-100 rounded-lg font-bold text-xs"
                        >
                          Review Dossier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: SANCTUM & PUJAS & EVENTS */}
        {activeTab === 'details' && (
          <div className="py-6 space-y-6">
            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveDetails} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-stone-900">
                    Edit Sanctum Timings & Guidelines
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Updates made here directly reflect on public devotee listings and AI assistant grounded knowledge.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Morning Darshan Hours
                  </label>
                  <input
                    type="text"
                    value={editTimingsMorning}
                    onChange={(e) => setEditTimingsMorning(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Evening Darshan Hours
                  </label>
                  <input
                    type="text"
                    value={editTimingsEvening}
                    onChange={(e) => setEditTimingsEvening(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Dress Code & Sanctum Etiquette
                </label>
                <input
                  type="text"
                  value={editDressCode}
                  onChange={(e) => setEditDressCode(e.target.value)}
                  placeholder="e.g. Traditional Veshti/Dhoti for Men, Saree or Salwar for Women"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Public Overview Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </form>

            {/* Festivals & Events Section */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-stone-900">
                    Scheduled Festivals & Utsavams
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Broadcast upcoming temple brahotsavams, theerthavari, and divine wedding ceremonies.
                  </p>
                </div>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="px-3 py-1.5 bg-orange-50 text-orange-800 hover:bg-orange-100 rounded-xl font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Festival Event</span>
                </button>
              </div>

              {temple.events.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">
                  No upcoming festivals listed. Click above to schedule an utsavam.
                </p>
              ) : (
                <div className="space-y-3">
                  {temple.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 border border-stone-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-stone-900">{ev.title}</h4>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-semibold">
                            {ev.date} • {ev.time}
                          </span>
                        </div>
                        <p className="text-stone-600">{ev.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: VACANCIES */}
        {activeTab === 'vacancies' && (
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-cinzel text-base font-bold text-stone-900">
                Priest Employment Vacancies ({vacancies.length})
              </h3>
              <button
                onClick={() => setShowNewVacancyModal(true)}
                className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post New Vacancy</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {vacancies.map((vac) => (
                <div
                  key={vac.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-cinzel text-base font-bold text-stone-900">
                        {vac.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {vac.status}
                      </span>
                    </div>

                    <p className="text-stone-600 font-medium">
                      Tradition: <strong className="text-stone-900">{vac.vedaTraditionRequired}</strong> • Experience: <strong className="text-stone-900">{vac.minExperienceYears}+ years</strong>
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {vac.ritualSpecialization.map((s: string, idx: number) => (
                        <span
                          key={`vac-${vac.id}-skill-${idx}-${s}`}
                          className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[10px] font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 text-[11px] text-stone-500 flex flex-wrap gap-4">
                      <span>Remuneration: <strong className="text-stone-800">{vac.remuneration}</strong></span>
                      <span>Accommodation: <strong className="text-stone-800">{vac.accommodationProvided ? 'Provided on campus' : 'None'}</strong></span>
                      <span>Food: <strong className="text-stone-800">{vac.foodProvided ? 'Prasadam included' : 'Self'}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('applications')}
                      className="px-3.5 py-2 bg-orange-50 text-orange-900 hover:bg-orange-100 rounded-xl font-bold border border-orange-200"
                    >
                      View Applicants ({applications.filter((a) => a.vacancyId === vac.id).length})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: APPLICATIONS & AI REVIEW */}
        {activeTab === 'applications' && (
          <div className="py-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-stone-900 mb-2">
              Applicant Review & AI Evaluation
            </h3>

            {applications.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-xs text-stone-500">
                No priest applications found for this temple yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs text-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel text-base font-bold text-stone-900">
                          {app.priestName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                          Status: {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-stone-600">
                        Role Applied: <strong className="text-stone-900">{app.vacancyTitle}</strong> • Available: {app.availableFrom}
                      </p>

                      <p className="text-stone-500 italic max-w-xl">
                        "{app.coverNote}"
                      </p>

                      {app.adminNotes && (
                        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                          <strong>Internal Note:</strong> {app.adminNotes}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleAnalyzeApplicant(app)}
                        className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-orange-200" />
                        <span>AI Match & Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: CONTRIBUTORS MANAGEMENT */}
        {activeTab === 'contributors' && (
          <div className="py-6 space-y-6">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-orange-950">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                <Lock className="w-4 h-4 text-orange-700" />
                Strict Contributor Governance Mandate
              </span>
              <p className="leading-relaxed">
                Contributor access is <strong>NOT automatic</strong>. Only an authorized administrator can explicitly grant a priest contributor permissions for this temple. Priests with permission can propose edits (timings, pujas, events), which only become public once you review and approve the diff below.
              </p>
            </div>

            {/* Pending Proposals Section */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <h3 className="font-cinzel text-base font-bold text-stone-900 mb-1">
                Pending Contributor Proposals ({proposals.filter((p) => p.status === 'pending_admin_review').length})
              </h3>
              <p className="text-[11px] text-stone-500 mb-4">
                Review proposed additions and edits submitted by authorized priests.
              </p>

              {proposals.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">No proposals submitted yet.</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {proposals.map((prop) => (
                    <div key={prop.id} className="py-4 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{prop.priestName}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                            {prop.updateType}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            prop.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : prop.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {prop.status}
                          </span>
                        </div>
                        {prop.status === 'pending_admin_review' && (
                          <button
                            onClick={() => {
                              setSelectedProposal(prop);
                              setProposalFeedback('');
                            }}
                            className="px-3 py-1 bg-orange-700 text-white font-bold rounded-lg hover:bg-orange-800"
                          >
                            Review Diff & Decide
                          </button>
                        )}
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-[11px] text-stone-800">
                        {JSON.stringify(prop.proposedData, null, 2)}
                      </div>

                      <p className="text-stone-500 italic">Rationale: "{prop.rationale}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Currently Authorized Contributors */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <h3 className="font-cinzel text-base font-bold text-stone-900 mb-3">
                Authorized Priest Contributors
              </h3>

              {contributors.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">
                  No priests are currently authorized to propose updates for this temple.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contributors.map((c, idx) => (
                    <div
                      key={c.id || c.userId || `contrib-${idx}`}
                      className="p-4 border border-stone-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-stone-900 block">{c.name}</span>
                        <span className="text-stone-500">{c.email}</span>
                      </div>
                      <button
                        onClick={() => handleRevokeContributor(c.userId || c.id)}
                        className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grant Access to Registered Priests */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <h3 className="font-cinzel text-base font-bold text-stone-900 mb-1">
                Grant Contributor Permission
              </h3>
              <p className="text-[11px] text-stone-500 mb-4">
                Select a registered priest from the ecosystem to grant explicit update permissions.
              </p>

              {availablePriests.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">
                  All registered priests already have contributor access, or none are available.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availablePriests.map((p, idx) => (
                    <div
                      key={p.id || p.userId || `avail-${idx}`}
                      className="p-4 border border-stone-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-stone-900 block">{p.name}</span>
                        <span className="text-stone-500">{p.email}</span>
                      </div>
                      <button
                        onClick={() => handleGrantContributor(p.userId || p.id)}
                        className="px-3 py-1.5 bg-orange-700 text-white hover:bg-orange-800 font-bold rounded-lg"
                      >
                        Grant Access
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="py-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-stone-900 mb-2">
              Temple Governance Audit Trail
            </h3>
            <p className="text-xs text-stone-500">
              Immutable log of administrative updates, vacancy creations, status modifications, and contributor permissions.
            </p>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs divide-y divide-stone-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px] bg-stone-100 px-2 py-0.5 rounded-md mr-2">
                      {log.action}
                    </span>
                    <span className="text-stone-700">{log.details}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* APPLICANT REVIEW MODAL WITH GEMINI AI MATCHING */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md">
                  Applicant Review & AI Compatibility
                </span>
                <h3 className="font-cinzel text-xl font-bold text-stone-900 mt-1">
                  {selectedApplication.priestName}
                </h3>
                <p className="text-xs text-stone-500">
                  Applied for: {selectedApplication.vacancyTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Cover note */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-700 block mb-1">Priest's Application Statement:</span>
                <p className="text-stone-600 italic leading-relaxed">"{selectedApplication.coverNote}"</p>
                <div className="mt-2 text-[11px] text-stone-500">
                  Available to join from: <strong>{selectedApplication.availableFrom}</strong>
                </div>
              </div>

              {/* AI MATCHING BREAKDOWN CARD */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl border border-amber-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-700" />
                    <h4 className="font-cinzel text-sm font-bold text-stone-900">
                      AI Compatibility Screening (Gemini 3.8 Flash)
                    </h4>
                  </div>
                  {aiMatchData && (
                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-900">
                        {aiMatchData.matchScore}%
                      </span>
                      <span className="block text-[10px] font-bold text-amber-700 uppercase">
                        Vedic Fit Score
                      </span>
                    </div>
                  )}
                </div>

                {aiMatchLoading ? (
                  <div className="py-6 text-center text-amber-800">
                    <Sparkles className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-600" />
                    <span>Analyzing priest pathashala qualifications against vacancy requirements...</span>
                  </div>
                ) : aiMatchData ? (
                  <div className="space-y-3">
                    <p className="text-stone-700 font-medium leading-relaxed">
                      {aiMatchData.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-white p-3 rounded-xl border border-stone-200">
                        <span className="font-bold text-emerald-800 block mb-1">Ritual Strengths:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                          {aiMatchData.strengths.map((st: string, i: number) => (
                            <li key={`strength-${i}-${st.slice(0, 15)}`}>{st}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-stone-200">
                        <span className="font-bold text-amber-800 block mb-1">Gaps / Considerations:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                          {aiMatchData.gaps.map((gp: string, i: number) => (
                            <li key={`gap-${i}-${gp.slice(0, 15)}`}>{gp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-2.5 bg-amber-100/70 rounded-xl text-[11px] text-amber-950 font-semibold">
                      Recommendation: {aiMatchData.recommendation}
                    </div>
                  </div>
                ) : (
                  <p className="text-stone-500 py-2">
                    AI screening model is ready. Click review to refresh.
                  </p>
                )}
              </div>

              {/* Status Update Controls */}
              <div className="space-y-2">
                <span className="font-bold text-stone-800 block">Update Application Status:</span>
                <div className="flex flex-wrap gap-2">
                  {['under_review', 'shortlisted', 'contacted', 'selected', 'not_selected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateAppStatus(st)}
                      className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-colors ${
                        selectedApplication.status === st
                          ? 'bg-orange-700 text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Admin Note */}
              <div className="space-y-1">
                <label className="font-bold text-stone-800 block">Private Internal Admin Notes:</label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Record interview impressions, trust committee remarks, or salary discussions."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateAppStatus(selectedApplication.status)}
                  className="px-3 py-1 bg-stone-800 text-white font-semibold rounded-lg hover:bg-stone-900"
                >
                  Save Internal Note
                </button>
              </div>

              {/* Direct Messaging */}
              <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-stone-100">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  Direct Message to Priest:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="e.g. Namaskaram Pandit ji, we would like to schedule an in-person Kainkaryam trial..."
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-700 text-white font-bold rounded-xl hover:bg-orange-800"
                  >
                    Send
                  </button>
                </div>
                {messageSent && (
                  <p className="text-emerald-700 text-[11px] font-semibold">
                    ✓ Message sent to priest's inbox.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PROPOSAL DIFF REVIEW MODAL */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  Review Contributor Proposed Update
                </h3>
                <p className="text-xs text-stone-500">
                  Submitted by {selectedProposal.priestName} for update type: {selectedProposal.updateType}
                </p>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <span className="font-bold text-stone-700 block mb-1">Proposed Update Payload:</span>
                <pre className="font-mono text-[11px] text-stone-800 whitespace-pre-wrap">
                  {JSON.stringify(selectedProposal.proposedData, null, 2)}
                </pre>
              </div>

              <div>
                <span className="font-bold text-stone-700 block mb-1">Priest's Sthala Rationale:</span>
                <p className="text-stone-600 italic">"{selectedProposal.rationale}"</p>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Feedback / Justification for Decision (Optional):
                </label>
                <input
                  type="text"
                  value={proposalFeedback}
                  onChange={(e) => setProposalFeedback(e.target.value)}
                  placeholder="e.g. Approved. Will update the printed schedule accordingly."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleReviewProposal('reject')}
                  className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-xl font-bold"
                >
                  Reject Proposal
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewProposal('approve')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Apply Live</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST NEW VACANCY MODAL */}
      {showNewVacancyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  Post New Priest Vacancy
                </h3>
                <p className="text-xs text-stone-500">
                  Broadcast employment opportunities across verified Vedic scholar communities.
                </p>
              </div>
              <button
                onClick={() => setShowNewVacancyModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVacancy} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Vacancy Designation *</label>
                  <input
                    type="text"
                    required
                    value={newVacTitle}
                    onChange={(e) => setNewVacTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Vedic Tradition / Sampradaya *</label>
                  <input
                    type="text"
                    required
                    value={newVacTradition}
                    onChange={(e) => setNewVacTradition(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Required Experience (Years)</label>
                  <input
                    type="number"
                    value={newVacExp}
                    onChange={(e) => setNewVacExp(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Salary / Sambhavana *</label>
                  <input
                    type="text"
                    required
                    value={newVacSalary}
                    onChange={(e) => setNewVacSalary(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Required Ritual Skills (comma separated)</label>
                <input
                  type="text"
                  value={newVacSkills}
                  onChange={(e) => setNewVacSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Daily Kainkaryam Duties</label>
                <textarea
                  rows={2}
                  value={newVacDuties}
                  onChange={(e) => setNewVacDuties(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVacAccom}
                    onChange={(e) => setNewVacAccom(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>Accommodation Provided within Temple Quarters</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVacFood}
                    onChange={(e) => setNewVacFood(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>Temple Prasadam Provided</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNewVacancyModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FESTIVAL EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200 p-6 space-y-4 text-xs">
            <h3 className="font-cinzel text-base font-bold text-stone-900">
              Schedule Festival / Utsavam
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Festival Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Chithirai Thiruvizha & Divine Wedding"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Describe the utsavam sequence, chariot procession route, and special darshan timings."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-xl"
                >
                  Save Festival
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
