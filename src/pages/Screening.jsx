import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

// Helper to automatically turn 'pap_smear' or 'breast_exam' into 'Pap Smear' dynamically
const formatTypeLabel = (type = '') => {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function Screening() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({});
  const [saving, setSaving] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadReminders = async () => {
    try {
      const res = await api.getReminders();
      setReminders(res?.reminders || []);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to fetch screening reminders from backend.');
    }
  };

  useEffect(() => {
    loadReminders().finally(() => setLoading(false));
  }, []);

  const logDate = async (type) => {
    const selectedDate = dates[type];
    if (!selectedDate) {
      setErrorMsg(`Please select a valid date for ${formatTypeLabel(type)}.`);
      return;
    }

    setErrorMsg('');
    setSaving(type);

    try {
      await api.updateScreening({ type, date: selectedDate });
      await loadReminders(); 
      setDates((prev) => ({ ...prev, [type]: '' }));
      setSuccessMsg(`Successfully updated record for ${formatTypeLabel(type)}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update screening date.');
    } finally {
      setSaving('');
    }
  };

  return (
    <div 
      className="screening-page" 
      style={{ 
        width: '100%',
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '16px 12px',
        boxSizing: 'border-box'
      }}
    >
      
      {/* HEADER */}
      <div className="screening-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', color: '#2C3E50', fontWeight: '700' }}>
          Screening Reminders
        </h1>
        <div 
          className="disclaimer" 
          style={{
            background: '#F8FAFC',
            borderLeft: '4px solid #64748B',
            padding: '12px 16px',
            fontSize: '0.88rem',
            color: '#475569',
            borderRadius: '4px',
            lineHeight: '1.5'
          }}
        >
          These are general awareness reminders based on standard medical screening intervals—not a diagnosis or personalized medical recommendation. Consult your healthcare specialist about your specific health needs.
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
          ✨ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ background: '#FEF2F2', border: '1px solid #EF4444', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* DYNAMIC CONTENT LOADING */}
      {loading ? (
        <p style={{ color: '#6B7280', fontSize: '0.95rem', textAlign: 'center', padding: '30px 0' }}>Loading schedule from server...</p>
      ) : reminders.length === 0 ? (
        <div className="card empty-state" style={{ padding: '32px 16px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
          <p style={{ margin: 0, color: '#64748B', fontSize: '1rem' }}>
            No screening reminders found in your account profile.
          </p>
        </div>
      ) : (
        <div className="reminders-list" style={{ display: 'grid', gap: '16px' }}>
          {reminders.map((r) => {
            const displayTitle = r.label || formatTypeLabel(r.type);
            const isSavingThis = saving === r.type;

            return (
              <div
                key={r.type}
                className="card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  overflowWrap: 'break-word'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1E293B', fontWeight: '600', flex: '1 1 200px' }}>
                    {displayTitle}
                  </h3>
                  <span
                    className={`pill ${r.due ? 'due' : 'ok'}`}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: r.due ? '#FEE2E2' : '#DCFCE7',
                      color: r.due ? '#991B1B' : '#166534',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {r.due ? 'Due' : 'Up to date'}
                  </span>
                </div>

                <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#64748B' }}>
                  Last logged: <strong>{r.lastDate ? r.lastDate : 'Never'}</strong>
                </p>

                {r.guidance && (
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#334155', lineHeight: '1.4' }}>
                    {r.guidance}
                  </p>
                )}

                {/* FORM CONTROLS: Mobile Friendly Grid/Stack */}
                <div 
                  style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'stretch', 
                    flexWrap: 'wrap',
                    background: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                      Log completed {displayTitle}
                    </label>
                    <input
                      type="date"
                      value={dates[r.type] || ''}
                      onChange={(e) => setDates((d) => ({ ...d, [r.type]: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                        outline: 'none',
                        background: '#FFFFFF'
                      }}
                    />
                  </div>

                  <button
                    className="btn secondary small"
                    onClick={() => logDate(r.type)}
                    disabled={isSavingThis || !dates[r.type]}
                    style={{
                      alignSelf: 'flex-end',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: dates[r.type] ? '#0F172A' : '#94A3B8',
                      color: '#FFFFFF',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: dates[r.type] && !isSavingThis ? 'pointer' : 'not-allowed',
                      flex: '1 1 auto',
                      minWidth: '110px'
                    }}
                  >
                    {isSavingThis ? 'Saving…' : 'Save date'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}