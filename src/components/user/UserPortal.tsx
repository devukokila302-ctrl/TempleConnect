import React, { useState, useEffect, useMemo } from 'react';
import { Temple, UserLocation } from '../../types';
import { api } from '../../services/api';
import { TempleDetailModal } from './TempleDetailModal';
import { AddTempleModal } from './AddTempleModal';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  MapPin,
  Navigation,
  Compass,
  Filter,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Clock,
  HelpCircle,
  ExternalLink,
  Plus,
  Flame,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const UserPortal: React.FC = () => {
  const { user } = useAuth();

  // State
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openNowOnly, setOpenNowOnly] = useState(false);

  // Geolocation & Radius
  const [userLocation, setUserLocation] = useState<UserLocation | null>({
    lat: 13.6288,
    lng: 79.4192,
    city: 'Tirupati',
  });
  const [radiusKm, setRadiusKm] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationFilterBanner, setLocationFilterBanner] = useState<string | null>(null);

  // Natural Language AI Search State
  const [aiSearching, setAiSearching] = useState(false);
  const [aiSearchSummary, setAiSearchSummary] = useState<string | null>(null);

  const radiusOptions: (number | null)[] = [null, 5, 10, 25, 50, 100];

  const popularHubs = [
    { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
    { name: 'Srikalahasti', lat: 13.7498, lng: 79.7037 },
    { name: 'Nandalur', lat: 14.2589, lng: 79.1172 },
    { name: 'Ontimitta', lat: 14.3941, lng: 79.0275 },
    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
    { name: 'Thiruvannamalai', lat: 12.2253, lng: 79.0677 },
    { name: 'Madurai', lat: 9.9195, lng: 78.1193 },
    { name: 'Rameswaram', lat: 9.2881, lng: 79.3174 },
    { name: 'Srisailam', lat: 16.0741, lng: 78.8686 },
    { name: 'Kedarnath', lat: 30.7352, lng: 79.0669 },
    { name: 'Varanasi', lat: 25.3109, lng: 83.0107 },
    { name: 'Somnath', lat: 20.8880, lng: 70.4013 },
  ];

  const locationQuickQueries = [
    'Temples near me',
    'Temples within 5 km',
    'Temples within 10 km',
    'Temples within 25 km',
    'Temples within 50 km',
    'Temples around my location',
    'Temples near Tirupati',
    'Temples within 50 km of my selected location',
  ];

  const fetchTemples = async (overrideQuery?: string) => {
    setLoading(true);
    try {
      const q = overrideQuery !== undefined ? overrideQuery : searchQuery;
      const res = await api.getTemples({
        city: selectedCity || undefined,
        deity: selectedDeity || undefined,
        lat: userLocation ? userLocation.lat : undefined,
        lng: userLocation ? userLocation.lng : undefined,
        radiusKm: radiusKm || undefined,
        search: q || undefined,
      });
      setTemples(res.temples);
      if (res.locationFilter?.isActive) {
        setLocationFilterBanner(res.locationFilter.explanation);
      } else {
        setLocationFilterBanner(null);
      }
    } catch (err) {
      console.warn('Network issue loading temples, initiating auto-recovery:', err);
      // Auto-retry once in case the server was reconnecting
      setTimeout(async () => {
        try {
          const res = await api.getTemples({
            city: selectedCity || undefined,
            deity: selectedDeity || undefined,
            lat: userLocation ? userLocation.lat : undefined,
            lng: userLocation ? userLocation.lng : undefined,
            radiusKm: radiusKm || undefined,
            search: overrideQuery !== undefined ? overrideQuery : searchQuery || undefined,
          });
          if (res?.temples) {
            setTemples(res.temples);
            if (res.locationFilter?.isActive) {
              setLocationFilterBanner(res.locationFilter.explanation);
            }
          }
        } catch (retryErr) {
          // Keep current state gracefully
        }
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, [selectedCity, selectedDeity, radiusKm, userLocation]);

  // Real Browser Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser geolocation is not supported in this environment.');
      return;
    }
    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          city: 'My Current Location (GPS)',
        });
        setSelectedCity('');
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationError('Could not acquire GPS coordinates in iframe. Anchored to Tirupati spiritual center.');
        setUserLocation({
          lat: 13.6288,
          lng: 79.4192,
          city: 'Tirupati',
        });
        setLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAiSearchSummary(null);
    fetchTemples(searchQuery);
  };

  // AI Semantic Temple Search
  const handleAiSearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchTemples();
      return;
    }

    setAiSearching(true);
    try {
      const res = await api.aiTempleSearch(
        searchQuery,
        userLocation?.lat,
        userLocation?.lng
      );
      setTemples(res.temples);
      setAiSearchSummary(res.explanation);
    } catch (err: any) {
      console.warn('AI search error, falling back to standard search:', err);
      fetchTemples();
    } finally {
      setAiSearching(false);
    }
  };

  // Filter temples by status & open now
  const filteredTemples = useMemo(() => {
    return temples.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      return true;
    });
  }, [temples, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'representative_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Representative Verified
          </span>
        );
      case 'community_confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            Community Confirmed
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Verification
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
            <HelpCircle className="w-3 h-3 text-stone-500" />
            Community Added
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/70 pb-16">
      {/* Top Hero / Search Banner */}
      <div className="bg-gradient-to-b from-amber-900 via-stone-900 to-stone-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                <Compass className="w-3.5 h-3.5" />
                Devotee Sanctum & Heritage Directory
              </div>
              <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Discover Sacred Temples
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
                Real-time darshan hours, Agamic nitya pujas, consecrated sthala puranam, and verified distance calculations across Bharat.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm flex items-center gap-2"
                id="add-temple-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Contribute Missing Temple</span>
              </button>
            </div>
          </div>

          {/* Search bar with dual Instant Proximity and AI assistance */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-4xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-stone-400 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by temple name, deity, or proximity (e.g. 'Temples within 50 km of Tirupati', 'Temples near me')..."
                className="w-full pl-12 pr-44 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm rounded-2xl border border-white/20 focus:border-amber-500 focus:outline-hidden backdrop-blur-md transition-all shadow-inner"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  title="Search temples by name, location or proximity"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Search</span>
                </button>
                <button
                  type="button"
                  onClick={handleAiSearch}
                  disabled={aiSearching}
                  className="px-3 py-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-amber-300 text-xs font-bold transition-colors flex items-center gap-1 border border-amber-500/30"
                  title="Ask Gemini for spiritual context and recommendations"
                >
                  {aiSearching ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="hidden md:inline">AI Explore</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Nearby & Proximity Search Suggestion Chips */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3 max-w-4xl">
            <span className="text-[11px] font-semibold text-amber-300/80 mr-1 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" /> Nearby Searches:
            </span>
            {locationQuickQueries.map((queryText) => (
              <button
                key={queryText}
                type="button"
                onClick={() => {
                  setSearchQuery(queryText);
                  fetchTemples(queryText);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  searchQuery === queryText
                    ? 'bg-amber-400 text-stone-900 font-bold shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15'
                }`}
              >
                {queryText}
              </button>
            ))}
          </div>

          {/* Proximity Filter Info Banner if active */}
          {locationFilterBanner && (
            <div className="mt-3.5 p-3 bg-amber-950/80 border border-amber-500/60 rounded-xl text-xs text-amber-100 flex items-center justify-between gap-3 max-w-4xl backdrop-blur-md shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="font-bold text-amber-300 text-[11px] tracking-wide uppercase">Proximity Search Active</div>
                  <div className="text-amber-100 text-xs mt-0.5">{locationFilterBanner}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilterBanner(null);
                  fetchTemples('');
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs shrink-0 border border-amber-500/40 transition-colors"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* AI Search result explanation if active */}
          {aiSearchSummary && (
            <div className="mt-3 p-3 bg-amber-950/70 border border-amber-600/40 rounded-xl text-xs text-amber-200 flex items-start gap-2 max-w-4xl">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Gemini AI Search Analysis:</span> {aiSearchSummary}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Controls Bar: GPS locator, City filters, Radius selector */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Real Geolocation status & button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLocateMe}
                disabled={locating}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-2 transition-colors shadow-2xs"
                id="locate-me-btn"
                title="Calculate real distance from your current coordinates"
              >
                <Navigation className={`w-3.5 h-3.5 text-amber-700 ${locating ? 'animate-pulse' : ''}`} />
                <span>{locating ? 'Acquiring GPS...' : 'Locate Me (GPS)'}</span>
              </button>

              {userLocation && (
                <div className="text-xs text-stone-600 flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    Anchor: <strong className="text-stone-900">{userLocation.city || 'GPS'}</strong> ({userLocation.lat.toFixed(2)}°, {userLocation.lng.toFixed(2)}°)
                  </span>
                </div>
              )}
            </div>

            {/* Radius Selector: All / 5 / 10 / 25 / 50 / 100 km */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">Radius Filter:</span>
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                {radiusOptions.map((km) => (
                  <button
                    key={km ?? 'all'}
                    onClick={() => setRadiusKm(km)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      radiusKm === km
                        ? 'bg-amber-700 text-white shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {km ? `${km} km` : 'All'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {locationError && (
            <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Quick City Chips & Status Filter */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-stone-500">Temple Hubs:</span>
              <button
                onClick={() => {
                  setSelectedCity('');
                  setUserLocation({ lat: 13.6288, lng: 79.4192, city: 'Tirupati' });
                }}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  !selectedCity
                    ? 'bg-stone-800 text-white border-stone-800 font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                All Temples
              </button>
              {popularHubs.map((hub) => (
                <button
                  key={hub.name}
                  onClick={() => {
                    setSelectedCity(hub.name);
                    setUserLocation({ lat: hub.lat, lng: hub.lng, city: hub.name });
                  }}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    selectedCity === hub.name
                      ? 'bg-amber-700 text-white border-amber-700 font-bold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {hub.name}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="representative_verified">Representative Verified</option>
                <option value="community_confirmed">Community Confirmed</option>
                <option value="community_added">Community Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Quick Stats */}
        <div className="flex items-center justify-between mb-4 text-xs text-stone-500">
          <div>
            Showing <strong className="text-stone-900">{filteredTemples.length}</strong> sacred temples
            {radiusKm && ` within ${radiusKm} km`}
          </div>
        </div>

        {/* Temples Grid */}
        {loading ? (
          <div className="py-20 text-center text-stone-500 text-xs">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-700 mb-2" />
            <span>Calculating distances and querying verified temple registry...</span>
          </div>
        ) : filteredTemples.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto my-8">
            <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-cinzel text-lg font-bold text-stone-800 mb-1">
              No Temples Found in this Radius
            </h3>
            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              No consecrated temples match your current filter within {radiusKm} km. Try expanding the radius or searching across All Regions.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setRadiusKm(100)}
                className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-300"
              >
                Expand to 100 km
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl"
              >
                Add Missing Temple
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemples.map((temple) => (
              <div
                key={temple.id}
                onClick={() => setSelectedTemple(temple)}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group"
                id={`temple-card-${temple.id}`}
              >
                <div>
                  {/* Photo container */}
                  <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={temple.photos[0] || 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80'}
                      alt={temple.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div>{getStatusBadge(temple.status)}</div>
                      {temple.distanceKm !== undefined && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-stone-900 shadow-xs flex items-center gap-1 backdrop-blur-xs">
                          <Navigation className="w-3 h-3 text-amber-600" />
                          {temple.distanceKm} km
                        </span>
                      )}
                    </div>

                    {/* Presiding deity on photo overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                        Presiding Deity
                      </span>
                      <p className="text-xs font-semibold drop-shadow-xs">{temple.deity}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-cinzel text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                        {temple.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-stone-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="line-clamp-1">{temple.city}, {temple.state}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                      {temple.description}
                    </p>

                    {/* Daily Darshan Timing Preview */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 mb-3 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="truncate">Morning: {temple.timings.morning}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="truncate">Evening: {temple.timings.evening}</span>
                      </div>
                    </div>

                    {/* Pujas Count Preview */}
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>{temple.pujas.length} Nitya Pujas Performed</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-0">
                  <div className="w-full py-2.5 px-3 rounded-xl bg-amber-50 group-hover:bg-amber-700 text-amber-900 group-hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-200 group-hover:border-amber-700">
                    <span>View Dossier, Pujas & Directions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Temple Details Modal */}
      {selectedTemple && (
        <TempleDetailModal
          temple={selectedTemple}
          onClose={() => setSelectedTemple(null)}
          onUpdate={fetchTemples}
        />
      )}

      {/* Add Temple Modal */}
      {showAddModal && (
        <AddTempleModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(newTemple) => {
            setShowAddModal(false);
            fetchTemples();
            setSelectedTemple(newTemple);
          }}
        />
      )}
    </div>
  );
};
