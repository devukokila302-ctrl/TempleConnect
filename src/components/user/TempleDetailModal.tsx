import React, { useState } from 'react';
import { Temple, Puja, TempleEvent } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Calendar,
  Send,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  AlertTriangle,
  Flame,
  FileCheck2,
  Navigation,
} from 'lucide-react';

interface TempleDetailModalProps {
  temple: Temple;
  onClose: () => void;
  onUpdate?: () => void;
}

export const TempleDetailModal: React.FC<TempleDetailModalProps> = ({ temple, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'timings' | 'pujas' | 'history' | 'events' | 'ai_assistant' | 'claim'>('timings');

  // AI Assistant state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: 'What are the main darshan timings and guidelines?',
      a: `According to verified temple records, ${temple.name} is open from ${temple.timings.morning} and ${temple.timings.evening}. ${temple.timings.notes || ''} Dress code: ${temple.dressCode || 'Traditional attire recommended'}.`,
      time: 'Just now',
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Claim State
  const [officialRole, setOfficialRole] = useState('Trustee / Archakar / Representative');
  const [claimPhone, setClaimPhone] = useState(user?.phone || '');
  const [claimEmail, setClaimEmail] = useState(user?.email || '');
  const [verificationDocs, setVerificationDocs] = useState('');
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const question = aiQuestion.trim();
    setAiQuestion('');
    setAiLoading(true);

    try {
      const res = await api.aiAskTempleAssistant(temple.id, question);
      setAiChat((prev) => [
        ...prev,
        {
          q: question,
          a: res.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setAiChat((prev) => [
        ...prev,
        {
          q: question,
          a: 'Could not connect to the temple records assistant. Please check back shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimLoading(true);
    try {
      const res = await api.claimTemple(temple.id, {
        officialRole,
        phone: claimPhone,
        email: claimEmail,
        verificationDocs,
      });
      setClaimSuccess(res.message);
      if (onUpdate) onUpdate();
    } catch (err: any) {
      alert(err.message || 'Failed to submit claim');
    } finally {
      setClaimLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (temple.status) {
      case 'representative_verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Representative Verified
          </span>
        );
      case 'community_confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle className="w-3.5 h-3.5 text-blue-700" />
            Community Confirmed
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Pending Verification
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300">
            <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
            Community Added
          </span>
        );
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${temple.name}, ${temple.address}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Banner with Close button */}
        <div className="relative h-48 sm:h-64 w-full bg-stone-800 overflow-hidden shrink-0">
          <img
            src={temple.photos[0] || 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80'}
            alt={temple.name}
            className="w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors focus:outline-hidden"
            id="close-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header text on banner */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {getStatusBadge()}
              {temple.distanceKm !== undefined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/90 text-stone-950">
                  <Navigation className="w-3 h-3" />
                  {temple.distanceKm} km away
                </span>
              )}
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              {temple.name}
            </h2>
            <p className="text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 mt-0.5">
              <span>Presiding Deity:</span>
              <span className="text-white font-semibold">{temple.deity}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {temple.city}, {temple.state}
              </span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-stone-200 px-6 bg-stone-50/60 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('timings')}
            className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'timings'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Timings & Darshan
          </button>
          <button
            onClick={() => setActiveTab('pujas')}
            className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'pujas'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Pujas & Rituals ({temple.pujas.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Heritage & Sthala Puranam
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'events'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Festivals ({temple.events.length})
          </button>
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai_assistant'
                ? 'border-amber-700 text-amber-900 bg-amber-50/70 font-extrabold'
                : 'border-transparent text-amber-800 hover:text-amber-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Ask Temple AI Guide
          </button>
          {temple.status !== 'representative_verified' && (
            <button
              onClick={() => setActiveTab('claim')}
              className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'claim'
                  ? 'border-orange-700 text-orange-900 bg-white'
                  : 'border-transparent text-orange-700 hover:text-orange-900'
              }`}
            >
              Claim Temple
            </button>
          )}
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: TIMINGS & DARSHAN */}
          {activeTab === 'timings' && (
            <div className="space-y-6">
              {/* Daily Schedule Card */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5">
                <h4 className="font-cinzel text-sm font-bold text-amber-950 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Daily Sanctum & Darshan Schedule
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Morning Darshan Session
                    </span>
                    <span className="text-base font-bold text-stone-900">{temple.timings.morning}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Evening Darshan Session
                    </span>
                    <span className="text-base font-bold text-stone-900">{temple.timings.evening}</span>
                  </div>
                </div>

                {temple.timings.notes && (
                  <div className="mt-3 text-xs text-amber-900/90 font-medium">
                    📌 {temple.timings.notes}
                  </div>
                )}
                {temple.timings.specialDays && (
                  <div className="mt-1 text-xs text-amber-900/90 font-medium">
                    ✨ Festival Schedule: {temple.timings.specialDays}
                  </div>
                )}
              </div>

              {/* Dress Code Notice */}
              {temple.dressCode && (
                <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl text-xs text-orange-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Sanctum Dress Code & Etiquette:</span>
                    <span>{temple.dressCode}</span>
                  </div>
                </div>
              )}

              {/* Address & Navigation */}
              <div className="border border-stone-200 rounded-2xl p-5 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Location & Map Coordinates
                    </span>
                    <p className="text-xs font-semibold text-stone-900 mb-1">{temple.address}</p>
                    <p className="text-[11px] text-stone-500">
                      GPS: {temple.lat.toFixed(4)}, {temple.lng.toFixed(4)}
                    </p>
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm shrink-0"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 flex items-center gap-3 text-xs">
                  <Phone className="w-4 h-4 text-stone-500" />
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold">Temple Office</span>
                    <span className="font-semibold text-stone-900">{temple.contact.phone || 'Available on request'}</span>
                  </div>
                </div>
                <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 flex items-center gap-3 text-xs">
                  <Mail className="w-4 h-4 text-stone-500" />
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold">Official Email</span>
                    <span className="font-semibold text-stone-900">{temple.contact.email || 'trustee@temple.org'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PUJAS & RITUALS */}
          {activeTab === 'pujas' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 mb-2">
                All daily Nitya pujas, scheduled abhishekams, and vishesha aradhana rituals performed according to consecrated Agamic traditions:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {temple.pujas.map((puja, index) => (
                  <div
                    key={puja.id || index}
                    className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-600" />
                        <h4 className="text-sm font-bold text-stone-900">{puja.name}</h4>
                        {puja.timing && (
                          <span className="text-[11px] px-2 py-0.5 bg-stone-100 text-stone-700 font-semibold rounded-md">
                            {puja.timing}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 pl-6">{puja.significance}</p>
                    </div>
                    {puja.fee && (
                      <div className="sm:text-right pl-6 sm:pl-0 shrink-0">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Kanikkai / Seva</span>
                        <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                          {puja.fee}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HERITAGE & HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6 text-xs text-stone-700 leading-relaxed">
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="font-cinzel text-sm font-bold text-stone-900 mb-2">Temple Overview</h4>
                <p>{temple.description}</p>
              </div>

              <div>
                <h4 className="font-cinzel text-sm font-bold text-stone-900 mb-2">Sthala Puranam & Sacred Origins</h4>
                <p className="whitespace-pre-line">{temple.history}</p>
              </div>

              {temple.photos.length > 1 && (
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-stone-900 mb-3">Sanctum & Architecture Gallery</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {temple.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt="Temple architecture"
                        className="rounded-xl h-32 w-full object-cover border border-stone-200 hover:scale-102 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FESTIVALS & EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {temple.events.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs">
                  No upcoming festivals listed currently. Check back during Utsavam season.
                </div>
              ) : (
                <div className="space-y-3">
                  {temple.events.map((event) => (
                    <div
                      key={event.id}
                      className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="w-16 h-16 rounded-xl bg-amber-700 text-white flex flex-col items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 mb-0.5 text-amber-200" />
                        <span className="text-[10px] font-bold uppercase">{event.date.substring(5)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-cinzel text-sm font-bold text-stone-900">{event.title}</h4>
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            {event.time}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ASK TEMPLE AI GUIDE */}
          {activeTab === 'ai_assistant' && (
            <div className="flex flex-col h-[400px]">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900">
                  <span className="font-bold">Verified AI Guide:</span> Answers are strictly grounded in TempleConnect's verified database for {temple.name} (darshan slots, dress code, festivals, and sacred purana).
                </p>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                {aiChat.map((chat, idx) => (
                  <div key={idx} className="space-y-2">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-amber-700 text-white text-xs px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-sm">
                        {chat.q}
                      </div>
                    </div>
                    {/* Assistant response */}
                    <div className="flex justify-start">
                      <div className="bg-stone-100 text-stone-800 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-xs max-w-md border border-stone-200 whitespace-pre-line leading-relaxed">
                        {chat.a}
                        <div className="text-[10px] text-stone-400 mt-1">{chat.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-stone-100 text-stone-500 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      <span>Consulting temple archives...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input box */}
              <form onSubmit={handleAskAI} className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="e.g. Can we bring coconut inside? What are the morning abhishek hours?"
                  className="flex-1 text-xs border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: CLAIM TEMPLE */}
          {activeTab === 'claim' && (
            <div className="max-w-lg mx-auto py-2">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl mb-6 text-xs text-orange-950">
                <span className="font-bold block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-700" />
                  Official Representative Verification
                </span>
                Are you an authorized trustee, executive officer, or pradhana archakar of {temple.name}? Submit verification details to claim governance over this listing.
              </div>

              {claimSuccess ? (
                <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-center text-xs text-emerald-900 space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Claim Request Submitted</p>
                  <p>{claimSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Official Designation</label>
                    <input
                      type="text"
                      required
                      value={officialRole}
                      onChange={(e) => setOfficialRole(e.target.value)}
                      placeholder="e.g. Managing Trustee / Executive Officer"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Phone Number for Verification</label>
                    <input
                      type="tel"
                      required
                      value={claimPhone}
                      onChange={(e) => setClaimPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={claimEmail}
                      onChange={(e) => setClaimEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Verification Documentation Proof</label>
                    <textarea
                      required
                      rows={3}
                      value={verificationDocs}
                      onChange={(e) => setVerificationDocs(e.target.value)}
                      placeholder="Mention HR&CE registration number, Trust deed reference, or official website email domain."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={claimLoading}
                    className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    {claimLoading ? 'Submitting...' : 'Submit Claim for Review'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
