import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useInvitationStore from '../stores/invitationStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const { invitations, fetchInvitations } = useInvitationStore();
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (token) fetchInvitations(token);
  }, [token]);

  const handleCreateNew = () => {
    navigate('/checkout/balloon');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="w-60 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-12">💍 WedLink</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setTab('overview')}
            className={`w-full text-left px-4 py-2 rounded ${tab === 'overview' ? 'bg-amber-700' : 'hover:bg-slate-800'}`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setTab('invitations')}
            className={`w-full text-left px-4 py-2 rounded ${tab === 'invitations' ? 'bg-amber-700' : 'hover:bg-slate-800'}`}
          >
            📧 My Invitations
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`w-full text-left px-4 py-2 rounded ${tab === 'settings' ? 'bg-amber-700' : 'hover:bg-slate-800'}`}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 rounded hover:bg-slate-800 mt-8 border-t border-slate-700 pt-8"
          >
            ← Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <button
            onClick={handleCreateNew}
            className="px-6 py-2 bg-amber-700 text-white rounded font-semibold hover:bg-amber-800"
          >
            + Create Invitation
          </button>
        </div>

        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Invitations', value: invitations.length },
                { label: 'Published', value: invitations.filter(i => i.status === 'published').length },
                { label: 'Drafts', value: invitations.filter(i => i.status === 'draft').length },
                { label: 'Total Guests', value: '—' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow">
                  <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-amber-700">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'invitations' && (
          <div className="space-y-4">
            {invitations.length === 0 ? (
              <p className="text-center text-slate-600 py-12">No invitations yet. Create one to get started!</p>
            ) : (
              invitations.map((inv) => (
                <div key={inv.id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{inv.couple_name_1} & {inv.couple_name_2}</h3>
                    <p className="text-sm text-slate-600">{inv.event_date}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${inv.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {inv.status}
                    </span>
                    <button
                      onClick={() => navigate(`/editor/${inv.id}`)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="bg-white p-8 rounded-lg shadow max-w-md">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Account Settings</h2>
            <p className="text-slate-600 mb-4">Email: {user?.email}</p>
            <button
              onClick={logout}
              className="w-full py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
