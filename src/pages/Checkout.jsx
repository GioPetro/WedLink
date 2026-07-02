import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useInvitationStore from '../stores/invitationStore';

export default function Checkout() {
  const { tier } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { createInvitation } = useInvitationStore();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    coupleName1: '',
    coupleName2: '',
    eventDate: '',
  });

  const tiers = { kite: 150, balloon: 260, rocket: 370 };
  const price = tiers[tier] || 260;
  const vat = Math.round(price * 0.24);
  const total = price + vat;
  const deposit = Math.round(total / 2);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Create invitation
    const inv = await createInvitation(token, {
      title: `${form.coupleName1} & ${form.coupleName2} Wedding`,
      tier,
      coupleName1: form.coupleName1,
      coupleName2: form.coupleName2,
      eventDate: form.eventDate,
      eventTime: '18:00',
      venue: form.address,
    });

    setOrderId('ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    setPaymentComplete(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="flex-1 p-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Complete Your Order</h1>

        {!paymentComplete ? (
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="bg-amber-50 border border-amber-700 p-4 rounded">
              <strong className="text-amber-900">💡 Flexible Payment:</strong>
              <p className="text-sm text-amber-800">Pay {Math.round(deposit)}€ now, {Math.round(deposit)}€ upon delivery.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Groom Name</label>
              <input
                type="text"
                value={form.coupleName1}
                onChange={(e) => setForm({ ...form, coupleName1: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Bride Name</label>
              <input
                type="text"
                value={form.coupleName2}
                onChange={(e) => setForm({ ...form, coupleName2: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Wedding Date</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-4">
                {['card', 'paypal', 'bank'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: method })}
                    className={`p-4 border-2 rounded text-center font-semibold ${
                      form.paymentMethod === method
                        ? 'border-amber-700 bg-amber-50 text-amber-700'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    {method === 'card' ? '💳 Card' : method === 'paypal' ? '🅿️ PayPal' : '🏦 Bank'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-700 text-white rounded font-semibold hover:bg-amber-800"
            >
              Pay €{deposit} Now (50% Deposit)
            </button>
          </form>
        ) : (
          <div className="bg-white p-12 rounded-lg text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Payment Successful!</h2>
            <p className="text-slate-600 mb-6">Your invitation is being created. You'll receive an email shortly.</p>
            <div className="bg-slate-100 p-6 rounded mb-6 text-left space-y-2 text-sm">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Paid:</strong> €{deposit}</p>
              <p><strong>Balance Due:</strong> €{deposit} (in 5 days)</p>
              <p><strong>Email:</strong> {form.email}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-2 bg-amber-700 text-white rounded font-semibold hover:bg-amber-800"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Summary Sidebar */}
      <div className="w-96 bg-white p-8 border-l border-slate-200 h-screen overflow-y-auto">
        <h3 className="text-lg font-bold mb-6 text-slate-900">Order Summary</h3>
        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-slate-600">Package</span>
            <span className="font-semibold">{tier?.charAt(0).toUpperCase() + tier?.slice(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Base Price</span>
            <span>€{price}</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-slate-600">VAT (24%)</span>
            <span>€{vat}</span>
          </div>
          <div className="border-t pt-3 text-base font-bold flex justify-between text-amber-700">
            <span>Total Due Now</span>
            <span>€{deposit}</span>
          </div>
        </div>
        <div className="bg-amber-50 p-3 rounded text-xs text-amber-800 text-center">
          Remaining €{deposit} due upon delivery
        </div>
      </div>
    </div>
  );
}
