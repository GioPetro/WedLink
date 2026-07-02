import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import useAuthStore from '../stores/authStore';
import useInvitationStore from '../stores/invitationStore';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { current, fetchInvitation, updateInvitation, publishInvitation, uploadPhoto } = useInvitationStore();
  const [form, setForm] = useState({
    coupleName1: '',
    coupleName2: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    accentColor: '#d4a373',
    fontFamily: 'Playfair Display',
  });
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (id && token) fetchInvitation(token, id);
  }, [id, token]);

  useEffect(() => {
    if (current) {
      setForm({
        coupleName1: current.couple_name_1 || '',
        coupleName2: current.couple_name_2 || '',
        eventDate: current.event_date ? current.event_date.slice(0, 10) : '',
        eventTime: current.event_time || '',
        venue: current.venue || '',
        accentColor: current.accent_color || '#d4a373',
        fontFamily: current.font_family || 'Playfair Display',
      });
    }
  }, [current]);

  const publicUrl = current?.invitation_url
    ? `${window.location.origin}/invite/${current.invitation_url}`
    : '';

  useEffect(() => {
    if (publicUrl) {
      QRCode.toDataURL(publicUrl, { margin: 1, width: 160 }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
    } else {
      setQrDataUrl('');
    }
  }, [publicUrl]);

  const handleSave = async () => {
    await updateInvitation(token, id, form);
    alert('Invitation saved!');
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError('');
    try {
      await updateInvitation(token, id, form);
      await publishInvitation(token, id);
    } catch (err) {
      setPublishError(err.message || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      await uploadPhoto(token, id, file, 'cover');
    } catch (err) {
      alert(err.message || 'Photo upload failed');
    } finally {
      setUploadingCover(false);
    }
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
            <label className="block text-sm font-semibold mb-2 text-slate-900">Cover Photo</label>
            {current?.cover_photo_url && (
              <img
                src={current.cover_photo_url}
                alt="Cover"
                className="w-full h-32 object-cover rounded mb-2 border border-slate-300"
              />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleCoverUpload}
              disabled={uploadingCover}
              className="w-full text-sm"
            />
            {uploadingCover && <p className="text-xs text-slate-500 mt-1">Uploading…</p>}
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

          <div className="border-t border-slate-200 pt-6">
            {current?.status === 'published' ? (
              <div className="text-center">
                <p className="text-sm font-semibold text-green-700 mb-3">✅ Published</p>
                {qrDataUrl && <img src={qrDataUrl} alt="QR code" className="mx-auto mb-3 rounded" />}
                <input
                  readOnly
                  value={publicUrl}
                  onClick={(e) => e.target.select()}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-center mb-2"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(publicUrl)}
                  className="w-full py-2 border border-slate-300 rounded text-sm font-semibold hover:bg-slate-50"
                >
                  Copy Link
                </button>
              </div>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full py-2 bg-emerald-700 text-white rounded font-semibold hover:bg-emerald-800 disabled:opacity-50"
              >
                {publishing ? 'Publishing…' : 'Publish Invitation'}
              </button>
            )}
            {publishError && <p className="text-xs text-red-600 mt-2 text-center">{publishError}</p>}
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
