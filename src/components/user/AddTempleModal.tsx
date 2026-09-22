import React, { useState } from 'react';
import { api } from '../../services/api';
import { Temple } from '../../types';
import {
  X,
  AlertTriangle,
  CheckCircle,
  Building,
  Sparkles,
  MapPin,
  Clock,
  Flame,
} from 'lucide-react';

interface AddTempleModalProps {
  onClose: () => void;
  onSuccess: (newTemple: Temple) => void;
}

export const AddTempleModal: React.FC<AddTempleModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [deity, setDeity] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('9.9195');
  const [lng, setLng] = useState('78.1193');
  const [morningTiming, setMorningTiming] = useState('6:00 AM - 12:30 PM');
  const [eveningTiming, setEveningTiming] = useState('4:30 PM - 9:00 PM');
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80');

  const [loading, setLoading] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Trigger AI duplicate check when user finishes typing name & city
  const checkDuplicate = async () => {
    if (!name.trim() || !city.trim()) return;
    setCheckingDuplicate(true);
    setDuplicateWarning(null);
    try {
      const res = await api.aiDetectDuplicate({
        name,
        city,
        deity,
        address,
      });
      if (res.isDuplicateLikely && res.warningMessage) {
        setDuplicateWarning(res.warningMessage);
      }
    } catch {
      // ignore
    } finally {
      setCheckingDuplicate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.addTemple({
        name,
        deity,
        city,
        state,
        address,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        timings: {
          morning: morningTiming,
          evening: eveningTiming,
          notes: 'Timings contributed by devotee community. Verified upon representative claim.',
        },
        pujas: [
          {
            id: 'puja_default_1',
            name: 'Suprabhatam & Morning Deeparadhana',
            timing: '6:30 AM',
            significance: 'Consecrated opening of sanctum gates with Vedic stotrams.',
          },
          {
            id: 'puja_default_2',
            name: 'Sayarakshai / Evening Arati',
            timing: '7:00 PM',
            significance: 'Evening camphor offering and sacred mangala arati.',
          },
        ],
        description,
        history,
        photos: [photoUrl],
        contact: {
          phone: '',
          email: '',
        },
        events: [],
      });

      onSuccess(res.temple);
    } catch (err: any) {
      setError(err.message || 'Failed to submit temple listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-stone-900">
                Contribute Missing Temple
              </h3>
              <p className="text-[11px] text-stone-500">
                Heritage and community listing with automated duplicate screening.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* Duplicate AI Warning Box */}
          {duplicateWarning && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Potential Duplicate Detected:</span>
                <span className="text-[11px] leading-relaxed">{duplicateWarning}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Temple Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={checkDuplicate}
                placeholder="e.g. Sri Koodal Azhagar Temple"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Presiding Deity *
              </label>
              <input
                type="text"
                required
                value={deity}
                onChange={(e) => setDeity(e.target.value)}
                placeholder="e.g. Lord Vishnu / Lord Shiva"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                City / Locality *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={checkDuplicate}
                placeholder="e.g. Madurai"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Tamil Nadu"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Exact Address / Street
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Periyar Bus Stand, Madurai"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Latitude</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Longitude</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Morning Darshan Hours
              </label>
              <input
                type="text"
                value={morningTiming}
                onChange={(e) => setMorningTiming(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Evening Darshan Hours
              </label>
              <input
                type="text"
                value={eveningTiming}
                onChange={(e) => setEveningTiming(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Short Description & Spiritual Significance
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight sacred lore, sthala vriksham, teertham, or principal utsavam."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Sthala Puranam & Ancient Heritage
            </label>
            <textarea
              rows={2}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="Describe dynastic origins (Chola, Pandya, Pallava, Vijayanagara) or puranic legend."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Photo Image URL
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || checkingDuplicate}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Submit Temple Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
