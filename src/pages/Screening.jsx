import { useState, useEffect, useContext } from 'react';
import { api } from '../api/client.js';
// Import your global language/translation context provider path if different
import { useLanguage } from '../context/LanguageContext';

// Helper to automatically turn 'pap_smear' or 'breast_exam' into 'Pap Smear' dynamically
const formatTypeLabel = (type = '') => {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function MaternalScreeningHub() {
  // Pull translation state, current language, and RTL utilities from global context
  const { t, language, isRTL } = useLanguage ? useLanguage() : { t: (key, fallback) => fallback, language: 'en', isRTL: false };

  const [activeMainTab, setActiveMainTab] = useState('journey'); // 'journey' | 'screening'

  // Maternal Journey States
  const [journeyTab, setJourneyTab] = useState('dashboard');
  const [routineNote, setRoutineNote] = useState('');
  const [quickCheckin, setQuickCheckin] = useState('');

  // Screening & Health Story States
  const [screeningSubTab, setScreeningSubTab] = useState('reminders'); // 'reminders' | 'story' | 'conditions'
  const [healthStoryRange, setHealthStoryRange] = useState('1M'); // '1M' | '3M' | '6M'

  // Screening Reminders States
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
      setErrorMsg(err?.message || t('screening.error_fetch', 'Failed to fetch screening reminders from backend.'));
    }
  };

  useEffect(() => {
    loadReminders().finally(() => setLoading(false));
  }, []);

  const logDate = async (type) => {
    const selectedDate = dates[type];
    if (!selectedDate) {
      setErrorMsg(t('screening.error_date', `Please select a valid date for ${formatTypeLabel(type)}.`));
      return;
    }

    setErrorMsg('');
    setSaving(type);

    try {
      await api.updateScreening({ type, date: selectedDate });
      await loadReminders(); 
      setDates((prev) => ({ ...prev, [type]: '' }));
      setSuccessMsg(t('screening.success_update', `Successfully updated record for ${formatTypeLabel(type)}!`));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err?.message || t('screening.error_update', 'Failed to update screening date.'));
    } finally {
      setSaving('');
    }
  };

  return (
    <div 
      className="maternal-screening-hub"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '20px 16px',
        boxSizing: 'border-box',
        textAlign: isRTL ? 'right' : 'left'
      }}
    >
      {/* MODULE HEADER */}
      <div className="hub-header" style={{ marginBottom: '20px' }}>
        <span 
          style={{ 
            display: 'inline-block', 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            color: '#0284c7', 
            background: '#e0f2fe', 
            padding: '4px 12px', 
            borderRadius: '20px',
            marginBottom: '10px'
          }}
        >
          {t('hub.badge', 'High-Stakes Life Stage & Preventive Care')}
        </span>
        <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#1E293B', fontWeight: '700' }}>
          {t('hub.title', "Maternal & Women's Health Hub")}
        </h1>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748B', lineHeight: '1.5' }}>
          {t('hub.subtitle', 'Structured clinical tracking built around WHO antenatal standards, intelligent symptom segmentation, and preventive health reminders.')}
        </p>
      </div>

      {/* TOP-LEVEL VIEW SWITCHER */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '24px', 
          borderBottom: '2px solid #E2E8F0',
          paddingBottom: '12px',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}
      >
        <button
          onClick={() => setActiveMainTab('journey')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: activeMainTab === 'journey' ? '1px solid #0284c7' : '1px solid #CBD5E1',
            background: activeMainTab === 'journey' ? '#0284c7' : '#FFFFFF',
            color: activeMainTab === 'journey' ? '#FFFFFF' : '#475569',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          {t('tabs.maternal_journey', '🤱 Maternal Journey')}
        </button>
        <button
          onClick={() => setActiveMainTab('screening')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: activeMainTab === 'screening' ? '1px solid #0284c7' : '1px solid #CBD5E1',
            background: activeMainTab === 'screening' ? '#0284c7' : '#FFFFFF',
            color: activeMainTab === 'screening' ? '#FFFFFF' : '#475569',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          {t('tabs.screening_story', '🩺 Screening & Health Story')}
        </button>
      </div>

      {/* VIEW 1: MATERNAL JOURNEY */}
      {activeMainTab === 'journey' && (
        <div>
          {/* SUB-NAVIGATION TABS */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '8px', 
              marginBottom: '20px', 
              overflowX: 'auto', 
              paddingBottom: '4px',
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            {[
              { id: 'dashboard', label: t('journey.tab_dashboard', '1. Pregnancy Dashboard') },
              { id: 'antenatal', label: t('journey.tab_antenatal', '2. Antenatal Visits') },
              { id: 'symptoms', label: t('journey.tab_symptoms', '3. Symptom Tracker') },
              { id: 'education', label: t('journey.tab_education', '4. Trimester Guide') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setJourneyTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: journeyTab === tab.id ? '1px solid #0284c7' : '1px solid #CBD5E1',
                  background: journeyTab === tab.id ? '#0284c7' : '#FFFFFF',
                  color: journeyTab === tab.id ? '#FFFFFF' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PREGNANCY DASHBOARD */}
          {journeyTab === 'dashboard' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>
                      {t('dashboard.current_progress', 'Current Progress')}
                    </span>
                    <h2 style={{ margin: '2px 0 0 0', fontSize: '1.4rem', color: '#1E293B' }}>
                      {t('dashboard.week_info', 'Week 24 • 2nd Trimester')}
                    </h2>
                  </div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 14px', borderRadius: '8px', color: '#166534', fontSize: '0.85rem', fontWeight: '600' }}>
                    {t('dashboard.baby_size', '👶 Baby size: Corn Ear (~30cm, 600g)')}
                  </div>
                </div>

                <div style={{ width: '100%', background: '#F1F5F9', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ width: '60%', background: '#0284c7', height: '100%', borderRadius: '5px', float: isRTL ? 'right' : 'left' }}></div>
                </div>

                <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#64748B' }}>
                  {t('dashboard.countdown', 'Next Antenatal Visit Countdown:')} <strong>{t('dashboard.days_remaining', '5 days remaining')}</strong> ({t('dashboard.who_contact', 'WHO Contact #4 of 8')})
                </p>

                {/* Check-in input block */}
                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    {t('dashboard.feeling_prompt', 'How are you feeling today?')}
                  </label>
                  <input 
                    type="text" 
                    placeholder={t('dashboard.feeling_placeholder', 'e.g. Mild back fatigue, good energy...')}
                    value={quickCheckin}
                    onChange={(e) => setQuickCheckin(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none', marginBottom: '10px', textAlign: isRTL ? 'right' : 'left' }}
                  />
                  <button 
                    onClick={() => {
                      console.log("Saving check-in:", quickCheckin);
                      setSuccessMsg(t('dashboard.checkin_saved', 'Quick check-in saved successfully!'));
                      setTimeout(() => setSuccessMsg(''), 4000);
                      setQuickCheckin('');
                    }}
                    disabled={!quickCheckin.trim()}
                    style={{
                      background: quickCheckin.trim() ? '#0F172A' : '#94A3B8',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: quickCheckin.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {t('dashboard.save_checkin', 'Save Check-in')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANTENATAL VISIT TRACKER */}
          {journeyTab === 'antenatal' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#1E293B' }}>
                  {t('antenatal.schedule_title', 'WHO 8-Contact Schedule Checklist')}
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748B' }}>
                  {t('antenatal.schedule_desc', 'Track completed vs. upcoming clinical milestones to ensure optimal maternal health.')}
                </p>

                <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { contact: t('antenatal.c1', 'Contact 1 (Up to 12 weeks)'), status: t('antenatal.completed', 'Completed'), date: '14 Mar 2026' },
                    { contact: t('antenatal.c2', 'Contact 2 (20 weeks)'), status: t('antenatal.completed', 'Completed'), date: '12 May 2026' },
                    { contact: t('antenatal.c3', 'Contact 3 (26 weeks)'), status: t('antenatal.upcoming', 'Upcoming'), date: '28 Jul 2026' },
                    { contact: t('antenatal.c4', 'Contact 4 (30 weeks)'), status: t('antenatal.scheduled', 'Scheduled'), date: '25 Aug 2026' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.88rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <span style={{ fontWeight: '600', color: '#334155' }}>{item.contact}</span>
                      <span style={{ fontSize: '0.78rem', padding: '3px 8px', borderRadius: '12px', background: item.status.includes('Completed') ? '#DCFCE7' : '#FEF3C7', color: item.status.includes('Completed') ? '#166534' : '#92400E', fontWeight: '700' }}>
                        {item.status} ({item.date})
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '14px', borderRadius: '10px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#be185d' }}>
                    {t('antenatal.ai_title', '✨ Pre-Visit AI Consultation Summary')}
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#831843' }}>
                    {t('antenatal.ai_desc', 'Your logged symptoms and questions are auto-organized into a clear brief for your doctor.')}
                  </p>
                  <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', color: '#475569', border: '1px dashed #f472b6', lineHeight: '1.5' }}>
                    {t('antenatal.ai_bullet1', '• Frequency of mild lower back pain increased over past 4 days.')}<br />
                    {t('antenatal.ai_bullet2', '• Question for clinician: Safe stretching routines for third trimester?')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYMPTOM LOG */}
          {journeyTab === 'symptoms' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FEF2F2', borderRadius: '14px', border: '2px solid #EF4444', padding: '20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ fontSize: '1.2rem' }}>🚨</span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#991B1B' }}>
                    {t('symptoms.urgent_title', 'Urgent Flags (Immediate Action Required)')}
                  </h3>
                </div>
                <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#B91C1C' }}>
                  {t('symptoms.urgent_desc', 'Severe headache, vision changes, sudden swelling, reduced fetal movement, bleeding, or fever. Never blended with routine logging.')}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    {t('symptoms.call_emergency', '📞 Call Doctor / Emergency Now')}
                  </button>
                </div>
              </div>

              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1E293B' }}>
                  {t('symptoms.routine_title', 'Routine Log')}
                </h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#64748B' }}>
                  {t('symptoms.routine_desc', 'Nausea, fatigue, mild back pain, sleep quality — logged casually with no alarm styling.')}
                </p>
                <textarea 
                  rows="3" 
                  placeholder={t('symptoms.routine_placeholder', 'Log daily routine symptoms...')}
                  value={routineNote}
                  onChange={(e) => setRoutineNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none', marginBottom: '10px', textAlign: isRTL ? 'right' : 'left' }}
                />
                <button style={{ background: '#0F172A', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  {t('symptoms.save_routine', 'Save Routine Entry')}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATIONAL CONTENT */}
          {journeyTab === 'education' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#1E293B' }}>
                  {t('education.title', 'Trimester-by-Trimester Guides')}
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#64748B', lineHeight: '1.5' }}>
                  {t('education.desc', 'Short, non-alarming explainers curated to help you understand what is normal and expected at each specific stage of your pregnancy journey.')}
                </p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {[
                    t('education.g1', 'First Trimester: Early development & managing fatigue'), 
                    t('education.g2', 'Second Trimester: Movement, nutrition, & body changes'), 
                    t('education.g3', 'Third Trimester: Preparation, birth signs, & postpartum planning')
                  ].map((guide, idx) => (
                    <div key={idx} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
                      📖 {guide}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: SCREENING & HEALTH STORY HUB */}
      {activeMainTab === 'screening' && (
        <div className="screening-page">
          {/* SUB-TABS FOR SCREENING SECTION */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '8px', 
              marginBottom: '20px', 
              borderBottom: '1px solid #E2E8F0', 
              paddingBottom: '12px',
              overflowX: 'auto',
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            {[
              { id: 'reminders', label: t('screening.sub_reminders', '🩺 Preventive Reminders') },
              { id: 'story', label: t('screening.sub_story', '📖 My Health Story') },
              { id: 'conditions', label: t('screening.sub_conditions', '🛡️ Women’s Health Focus') }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setScreeningSubTab(sub.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: screeningSubTab === sub.id ? '1px solid #7c3aed' : '1px solid #CBD5E1',
                  background: screeningSubTab === sub.id ? '#7c3aed' : '#FFFFFF',
                  color: screeningSubTab === sub.id ? '#FFFFFF' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* SUB-VIEW 1: SCREENING REMINDERS */}
          {screeningSubTab === 'reminders' && (
            <div>
              <div className="screening-header" style={{ marginBottom: '20px' }}>
                <div 
                  className="disclaimer" 
                  style={{
                    background: '#F8FAFC',
                    [isRTL ? 'borderRight' : 'borderLeft']: '4px solid #64748B',
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    color: '#475569',
                    borderRadius: '4px',
                    lineHeight: '1.5'
                  }}
                >
                  {t('screening.disclaimer', 'These are general awareness reminders based on standard medical screening intervals—not a diagnosis or personalized medical recommendation. Consult your healthcare specialist about your specific health needs.')}
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

              {loading ? (
                <p style={{ color: '#6B7280', fontSize: '0.95rem', textAlign: 'center', padding: '30px 0' }}>
                  {t('screening.loading', 'Loading schedule from server...')}
                </p>
              ) : reminders.length === 0 ? (
                <div className="card empty-state" style={{ padding: '32px 16px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '1rem' }}>
                    {t('screening.empty', 'No screening reminders found in your account profile.')}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
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
                            {r.due ? t('screening.due', 'Due') : t('screening.up_to_date', 'Up to date')}
                          </span>
                        </div>

                        <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#64748B' }}>
                          {t('screening.last_logged', 'Last logged:')} <strong>{r.lastDate ? r.lastDate : t('screening.never', 'Never')}</strong>
                        </p>

                        {r.guidance && (
                          <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#334155', lineHeight: '1.4' }}>
                            {r.guidance}
                          </p>
                        )}

                        <div 
                          style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            alignItems: 'stretch', 
                            flexWrap: 'wrap',
                            background: '#F8FAFC',
                            padding: '12px',
                            borderRadius: '8px',
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                              {t('screening.log_completed', 'Log completed')} {displayTitle}
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
                                background: '#FFFFFF',
                                textAlign: isRTL ? 'right' : 'left'
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
                            {isSavingThis ? t('screening.saving', 'Saving…') : t('screening.save_date', 'Save date')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 2: MY HEALTH STORY */}
          {screeningSubTab === 'story' && (
            <div style={{ display: 'grid', gap: '16px', background: '#FAF5FF', padding: '16px', borderRadius: '16px', border: '1px solid #E9D5FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#581c87', fontWeight: '700' }}>
                  {t('story.title', 'My Health Story')}
                </h2>
                <button style={{ background: '#FFFFFF', border: '1px solid #D8B4FE', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#7e22ce', fontSize: '0.85rem', fontWeight: '600', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  📤 {t('story.share_summary', 'Share Summary')}
                </button>
              </div>

              {/* TIME RANGE SELECTOR */}
              <div style={{ display: 'flex', background: '#F3E8FF', padding: '4px', borderRadius: '12px', gap: '4px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                {['1M', '3M', '6M'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setHealthStoryRange(range)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: healthStoryRange === range ? '#7c3aed' : 'transparent',
                      color: healthStoryRange === range ? '#FFFFFF' : '#6b21a8',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {range === '1M' ? t('story.range_1m', '1 Month') : range === '3M' ? t('story.range_3m', '3 Months') : t('story.range_6m', '6 Months')}
                  </button>
                ))}
              </div>

              {/* SUMMARY CARD */}
              <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '18px', border: '1px solid #E9D5FF', boxShadow: '0 2px 6px rgba(124, 58, 237, 0.04)' }}>
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ margin: '0 0 2px 0', fontSize: '1rem', color: '#1F2937' }}>
                    {t('story.summary_header', 'Summary for May 1 – May 14, 2024')}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                    {t('story.generated_on', 'Generated on May 14, 2024')}
                  </span>
                </div>

                {/* MAIN CONCERNS */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {t('story.main_concerns', 'Main concerns')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '6px', background: '#FEF2F2', padding: '10px 12px', borderRadius: '10px', border: '1px solid #FCA5A5', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: '1.1rem' }}>📍</span>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#991B1B', lineHeight: '1.4' }}>
                      {t('story.concerns_text', 'Frequent lower back fatigue and intermittent sleep disruptions reported during the current period.')}
                    </p>
                  </div>
                </div>

                {/* KEY INSIGHTS */}
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {t('story.key_insights', 'Key Insights')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '6px', background: '#F5F3FF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #DDD6FE', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: '1.1rem' }}>💡</span>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#5B21B6', lineHeight: '1.4' }}>
                      {t('story.insights_text', 'Consistent tracking helps flag patterns early. Consider discussing stretching techniques during your next scheduled clinical visit.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: WOMEN'S HEALTH CONDITIONS FOCUS */}
          {screeningSubTab === 'conditions' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#1E293B' }}>
                  {t('conditions.title', 'Targeted Women’s Health Focus')}
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#64748B', lineHeight: '1.5' }}>
                  {t('conditions.desc', 'Explore educational overviews and foundational awareness guides regarding key conditions affecting women’s wellness.')}
                </p>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { title: t('conditions.c1_title', 'PCOS (Polycystic Ovary Syndrome)'), desc: t('conditions.c1_desc', 'Understanding hormonal balance, cycle monitoring, and lifestyle management approaches.') },
                    { title: t('conditions.c2_title', 'Endometriosis Awareness'), desc: t('conditions.c2_desc', 'Recognizing pelvic discomfort patterns and partnering effectively with specialists.') },
                    { title: t('conditions.c3_title', 'Bone Density & Calcium Health'), desc: t('conditions.c3_desc', 'Long-term nutritional support and preventive strategies across different life stages.') }
                  ].map((cond, idx) => (
                    <div key={idx} style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#0F172A', fontWeight: '600' }}>
                        {cond.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: '1.4' }}>
                        {cond.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}