import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-700">💍 WedLink</h1>
          <nav className="flex gap-8 items-center">
            <a href="#features" className="text-sm text-slate-600 hover:text-amber-700">Features</a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-amber-700">Pricing</a>
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-amber-700 text-white rounded">
                Dashboard
              </button>
            ) : (
              <button onClick={() => navigate('/auth')} className="px-4 py-2 bg-amber-700 text-white rounded">
                Get Started
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">Elegant Digital Wedding Invitations</h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Create stunning, shareable invitations in minutes. Manage RSVPs, seating charts, and guest galleries all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-3 bg-amber-700 text-white rounded font-semibold hover:bg-amber-800"
          >
            Start Creating
          </button>
          <button
            onClick={() => document.getElementById('features').scrollIntoView()}
            className="px-8 py-3 border-2 border-amber-700 text-amber-700 rounded font-semibold hover:bg-amber-50"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-center mb-16">Why Choose WedLink</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🎨', title: 'Beautiful Templates', desc: 'Hand-crafted designs for every wedding style.' },
            { icon: '📝', title: 'Smart RSVP Forms', desc: 'Guests respond directly with dietary preferences.' },
            { icon: '🪑', title: 'Seating Charts', desc: 'Organize tables and assign seats easily.' },
            { icon: '📸', title: 'Guest Galleries', desc: 'Guests upload photos during the event.' },
            { icon: '📊', title: 'Live Analytics', desc: 'See invitation views and RSVP stats in real-time.' },
            { icon: '🎯', title: 'Complete Control', desc: 'Edit details anytime before the big day.' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold mb-2 text-slate-900">{feature.title}</h4>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Kite', price: 150, emoji: '🪁', features: ['1 template', '5 photos', 'RSVP form', '27 colors', 'Basic list'] },
              { name: 'Balloon', price: 260, emoji: '🎈', features: ['10 photos', 'Seating chart', 'Guest quiz', 'Analytics', 'Live chat'], featured: true },
              { name: 'Rocket', price: 370, emoji: '🚀', features: ['Unlimited photos', 'Pro seating', 'Gift registry', 'QR codes', 'Priority support'] },
            ].map((tier, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-lg border-2 transition ${
                  tier.featured
                    ? 'border-amber-700 bg-amber-50 scale-105'
                    : 'border-slate-200 bg-white hover:border-amber-700'
                }`}
              >
                <div className="text-4xl mb-4">{tier.emoji}</div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h4>
                <div className="text-3xl font-bold text-amber-700 mb-1">€{tier.price}</div>
                <p className="text-sm text-slate-600 mb-6">one-time</p>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="text-sm text-slate-600">✓ {feat}</li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full py-2 bg-amber-700 text-white rounded font-semibold hover:bg-amber-800"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white text-center py-8">
        <p>© 2026 WedLink. Making weddings more connected.</p>
      </footer>
    </div>
  );
}
