import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const SYMPTOM_OPTIONS = [
  { key: 'cramps', label: 'Cramps', icon: '🩸' },
  { key: 'bloating', label: 'Bloating', icon: '🎈' },
  { key: 'fatigue', label: 'Fatigue', icon: '😴' },
  { key: 'headache', label: 'Headache', icon: '🤕' },
  { key: 'mood', label: 'Mood changes', icon: '🎭' },
  { key: 'breast', label: 'Breast tenderness', icon: '🍒' },
  { key: 'acne', label: 'Acne', icon: '✨' },
  { key: 'back', label: 'Back pain', icon: '🧘‍♀️' },
  { key: 'nausea', label: 'Nausea', icon: '🤢' },
  { key: 'cravings', label: 'Cravings', icon: '🍫' }
];

export default function CycleTracker() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [type, setType] = useState('period');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [flow, setFlow] = useState('medium');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  // Load logs from API
  const loadLogs = async () => {
    try {
      const response = await api.listLogs();
      const sortedLogs = (response.logs || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setLogs(sortedLogs);
    } catch (err) {
      console.error('Failed to load logs:', err);
      setError('Failed to load your history.');
    }
  };

  useEffect(() => {
    loadLogs().finally(() => setLoading(false));
  }, []);

  const toggleSymptom = (label) => {
    setSymptoms((cur) =>
      cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.addLog({
        date,
        type,
        flow: type === 'period' ? flow : null,
        symptoms,
        notes: notes.trim(),
      });

      // Reset symptoms and notes
      setSymptoms([]);
      setNotes('');
      await loadLogs();
    } catch (err) {
      setError(err.message || 'Failed to save entry.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await api.deleteLog(id);
      await loadLogs();
    } catch (err) {
      alert('Failed to delete log.');
    }
  };

  const formatDateDisplay = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="dashboard-container tracker-page">
      <header className="dashboard-header">
        <h1 className="greeting-title">Cycle & symptom tracker</h1>
        <p className="greeting-date">
          Log periods and symptoms to build your private health history.
        </p>
      </header>

      {/* NEW ENTRY CARD */}
      <div className="card tracker-form-card">
        <h2 className="card-title">New Entry</h2>
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form tracker-form">
          <div className="form-row-split">
            <div className="field">
              <label htmlFor="entryType">Entry type</label>
              <select
                id="entryType"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="period">Period Start/End</option>
                <option value="symptom">Symptom Log Only</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="entryDate">Date</label>
              <input
                id="entryDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {type === 'period' && (
            <div className="field flow-field">
              <label>Flow intensity</label>
              <div className="flow-selector">
                {['light', 'medium', 'heavy'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`flow-btn ${f} ${flow === f ? 'selected' : ''}`}
                    onClick={() => setFlow(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="field symptoms-field">
            <label>Symptoms & Mood</label>
            <div className="symptoms-grid">
              {SYMPTOM_OPTIONS.map((item) => {
                const isSelected = symptoms.includes(item.label);
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`symptom-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSymptom(item.label)}
                  >
                    <span className="symptom-icon">{item.icon}</span>
                    <span className="symptom-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling overall?"
              rows="3"
            />
          </div>

          <button
            className="auth-btn tracker-submit-btn"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving Entry…' : 'Save entry'}
          </button>
        </form>
      </div>

      {/* HISTORY SECTION */}
      <section className="section-block history-section">
        <h3 className="section-title">Your History</h3>

        {loading ? (
          <div className="card loading-card">
            <p className="muted">Loading history…</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="card empty-card">
            <p className="muted">
              No entries logged yet. Use the form above to start your history.
            </p>
          </div>
        ) : (
          <div className="history-list">
            {logs.map((log) => (
              <div className="card log-entry-card" key={log.id}>
                <div className="log-entry-header">
                  <div className="log-meta">
                    <span className={`log-type-pill ${log.type}`}>
                      {log.type === 'period' ? 'PERIOD' : 'SYMPTOM'}
                    </span>
                    <span className="log-date-display">
                      {formatDateDisplay(log.date)}
                    </span>
                  </div>
                  <button
                    className="icon-btn-delete"
                    onClick={() => onDelete(log.id)}
                    title="Delete entry"
                  >
                    &times;
                  </button>
                </div>

                <div className="log-entry-body">
                  {log.type === 'period' && (
                    <p className="log-flow-data">
                      Flow: <strong>{log.flow}</strong>
                    </p>
                  )}

                  {log.symptoms?.length > 0 && (
                    <div className="log-symptoms-list">
                      {log.symptoms.map((sLabel) => {
                        const sOpt = SYMPTOM_OPTIONS.find(
                          (o) => o.label === sLabel
                        );
                        return (
                          <span key={sLabel} className="history-symptom-pill">
                            {sOpt?.icon} {sLabel}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {log.notes && (
                    <div className="log-notes-box">
                      <p className="log-notes-text">{log.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}