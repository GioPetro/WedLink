import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function PublicInvitation() {
  const { url } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [rsvpForm, setRsvpForm] = useState({
    guestName: '',
    guestEmail: '',
    attending: '',
    numAdults: '1',
    numChildren: '0',
    dietaryRestrictions: '',
    message: '',
  });
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [activeTab, setActiveTab] = useState('rsvp');

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/public/invitations/${url}`);
        const data = await res.json();
        setInvitation(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvitation();
  }, [url]);

  const handleRSVP = async (e) => {
    e.preventDefault();
    if (!rsvpForm.guestName || !rsvpForm.attending) {
      setRsvpMessage('❌ Please fill in required fields');
      return;
    }
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/public/invitations/${url}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpForm),
      });
      setRsvpMessage(`✅ Thank you ${rsvpForm.guestName}! Your RSVP has been recorded.`);
    } catch (err) {
      setRsvpMessage('❌ Error submitting RSVP');
    }
  };

  if (!invitation) return <div className="text-center py-12">Loading invitation...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Hero Cover */}
        <div
          className="text-center text-white py-20 rounded-lg mb-8"
          style={{ backgroundColor: invitation.accent_color }}
        >
          <h1 className="text-5xl font-bold mb-2">💍 We're Getting Married! 💍</h1>
          <p className="text-lg opacity-90">Join us to celebrate our love</p>
        </div>

        {/* Couple Info */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: invitation.accent_color }}>
            {invitation.couple_name_1} & {invitation.couple_name_2}
          </h2>
          <p className="text-slate-600 mb-6">Sunday, the {new Date(invitation.event_date).getDate()}th of {new Date(invitation.event_date).toLocaleString('default', { month: 'long' })}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-2xl">⛪</div>
              <p className="font-semibold">Ceremony</p>
              <p className="text-sm text-slate-600">{invitation.event_time}</p>
            </div>
            <div>
              <div className="text-2xl">🍽️</div>
              <p className="font-semibold">Reception</p>
              <p className="text-sm text-slate-600">After ceremony</p>
            </div>
          </div>
          <p className="text-slate-600">{invitation.venue}</p>
        </div>

        {/* Navigation */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex justify-center gap-4">
          {['rsvp', 'details', 'accommodations', 'gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                activeTab === tab
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab === 'rsvp' ? 'RSVP' : tab === 'details' ? 'Details' : tab === 'accommodations' ? 'Hotels' : 'Gallery'}
            </button>
          ))}
        </div>

        {/* RSVP Form */}
        {activeTab === 'rsvp' && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8 border-2" style={{ borderColor: invitation.accent_color }}>
            <h3 className="text-2xl font-bold mb-6 text-center">RSVP</h3>
            <p className="text-center text-slate-600 mb-6">Please let us know if you can join us</p>

            <form onSubmit={handleRSVP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Your Name *</label>
                <input
                  type="text"
                  value={rsvpForm.guestName}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guestName: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded"
                  style={{ borderColor: invitation.accent_color }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={rsvpForm.guestEmail}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guestEmail: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded"
                  style={{ borderColor: invitation.accent_color }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">Will you be attending? *</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                      required
                    />
                    <span>Yes, I'll be there! 🎉</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                    />
                    <span>Sorry, I can't make it 😢</span>
                  </label>
                </div>
              </div>

              {rsvpForm.attending === 'yes' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Number of Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={rsvpForm.numAdults}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, numAdults: e.target.value })}
                      className="w-full px-4 py-2 border-2 rounded"
                      style={{ borderColor: invitation.accent_color }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Number of Children</label>
                    <input
                      type="number"
                      min="0"
                      value={rsvpForm.numChildren}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, numChildren: e.target.value })}
                      className="w-full px-4 py-2 border-2 rounded"
                      style={{ borderColor: invitation.accent_color }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Dietary Restrictions</label>
                    <select
                      value={rsvpForm.dietaryRestrictions}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, dietaryRestrictions: e.target.value })}
                      className="w-full px-4 py-2 border-2 rounded"
                      style={{ borderColor: invitation.accent_color }}
                    >
                      <option value="">None</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="gluten-free">Gluten-free</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Message (optional)</label>
                <textarea
                  value={rsvpForm.message}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded"
                  style={{ borderColor: invitation.accent_color }}
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white rounded font-semibold hover:opacity-90"
                style={{ backgroundColor: invitation.accent_color }}
              >
                Submit RSVP
              </button>
              {rsvpMessage && <p className="text-center text-sm mt-2">{rsvpMessage}</p>}
            </form>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Wedding Details</h3>
            <p className="text-slate-600 mb-2"><strong>Date:</strong> {invitation.event_date}</p>
            <p className="text-slate-600 mb-2"><strong>Time:</strong> {invitation.event_time}</p>
            <p className="text-slate-600"><strong>Venue:</strong> {invitation.venue}</p>
          </div>
        )}

        {activeTab === 'accommodations' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Hotel Recommendations</h3>
            <p className="text-slate-600">Special rates available for our guests. Details coming soon!</p>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold mb-4">Photo Gallery</h3>
            <p className="text-slate-600">Share your photos with us after the wedding!</p>
          </div>
        )}
      </div>
    </div>
  );
}
