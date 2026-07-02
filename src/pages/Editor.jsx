import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useInvitationStore from '../stores/invitationStore';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { current, updateInvitation } = useInvitationStore();
  const [form, setForm] = useState({
    coupleName1: '',
    coupleName2: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    accentColor: '#d4a373',
    fontFamily: 'Playfair Display',
  });

  useEffect(() => {
    if (current) {
      setForm({
        coupleName1: current.couple_name_1 || '',
        coupleName2: current.couple_name_2 || '',
        eventDate: current.event_date || '',
        eventTime: current.event_time || '',
        venue: current.venue || '',
        accentColor: current.accent_color || '#d4a373',
        fontFamily: current.font_family || 'Playfair Display',
      });
    }
  }, [current]);

  const handleSave = async () => {
    await updateInvitation(token, id, form);
    alert('Invitation saved!');
  };

  const colors = ['#d4a373', '#c9704d', '#6b5344', '#9b7d6b', '#b8956f', '#8b6f47'];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="w-80 bg-white p-6 overflow-y-auto border-r border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Edit Invitation</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">Groom Name</label>
            <input
              type="text"
              value={form.coupleName1}
              onChange={(e) => setForm({ ...form, coupleName1: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">Bride Name</label>
            <input
              type="text"
              value={form.coupleName2}
              onChange={(e) => setForm({ ...form, coupleName2: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">Date</label>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">Time</label>
            <input
              type="time"
              value={form.eventTime}
              onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">Venue</label>
            <textarea
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-900">Accent Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm({ ...form, accentColor: color })}
                  className={`w-12 h-12 rounded border-2 ${
                    form.accentColor === color ? 'border-slate-900' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">Font</label>
            <select
              value={form.fontFamily}
              onChange={(e) => setForm({ ...form, fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option>Playfair Display</option>
              <option>Georgia</option>
              <option>Inter</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-amber-700 text-white rounded font-semibold hover:bg-amber-800"
            >
              Save
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-2 border border-slate-300 text-slate-900 rounded font-semibold hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-96 h-96">
          <div
            className="p-8 text-center h-full flex flex-col justify-center"
            style={{ backgroundColor: form.accentColor }}
          >
            <h1 className="text-3xl font-bold text-white mb-4">We're Getting Married!</h1>
            <p className="text-lg text-white mb-2">{form.coupleName1} & {form.coupleName2}</p>
            <p className="text-sm text-white opacity-90">{form.eventDate} at {form.eventTime}</p>
            <p className="text-xs text-white opacity-75 mt-4">{form.venue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
