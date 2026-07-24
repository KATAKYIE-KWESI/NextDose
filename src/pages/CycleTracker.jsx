import { useState } from 'react';

export default function CycleTracker() {
  // Navigation & Life Stage state
  const [activeTab, setActiveTab] = useState('tracker'); 
  const [lifeStage, setLifeStage] = useState('expectant'); // 'adolescent', 'conceiving', 'expectant', 'postpartum'

  // Collapsible section toggles state
  const [collapsedSections, setCollapsedSections] = useState({
    calendar: false,
    overview: false,
    urgent: false,
    symptoms: false,
    vitals: false,
    fetal: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calendar Mock State
  const [selectedDate, setSelectedDate] = useState('2026-07-24');

  // Adolescent Stage Specific States
  const [cycleDay, setCycleDay] = useState(14);
  const [flowIntensity, setFlowIntensity] = useState('Medium');
  const [adolescentSymptoms, setAdolescentSymptoms] = useState([]);
  const adolescentSymptomList = ['Cramps', 'Headache', 'Acne', 'Bloating', 'Mood Swings', 'Fatigue'];

  const toggleAdolescentSymptom = (symptom) => {
    setAdolescentSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  // Conceiving Stage Specific States
  const [fertilityStatus, setFertilityStatus] = useState('High Fertility (Ovulation Approaching)');
  const [basalTemp, setBasalTemp] = useState('36.4');
  const [cervicalMucus, setCervicalMucus] = useState('Eggwhite / Stretchy');

  // Postpartum Stage Specific States
  const [weeksPostpartum, setWeeksPostpartum] = useState('6 Weeks');
  const [lochiaFlow, setLochiaFlow] = useState('Light (Scant)');
  const [moodCheckin, setMoodCheckin] = useState('Doing well / Calm');
  const [babyFeeding, setBabyFeeding] = useState('Exclusive Breastfeeding');

  // Maternal / Expectant Journey State
  const [pregnancyData, setPregnancyData] = useState({
    currentWeek: '24',
    trimester: '2nd Trimester',
    dueDate: '2026-11-12',
    babySize: 'Corn Ear (~30cm, 600g)',
    pregnancyType: 'Singleton',
    nextAntenatal: '2026-07-28',
    hospitalProvider: 'Korle-Bu Teaching Hospital',
    emergencyContact: '+233 30 266 5011'
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedUrgentFlags, setSelectedUrgentFlags] = useState([]);

  // Vitals State
  const [weight, setWeight] = useState('72.5');
  const [bloodSugar, setBloodSugar] = useState('5.4');

  // Fetal & Contraction State
  const [fetalStatus, setFetalStatus] = useState('Movement feels normal');
  const [contractions, setContractions] = useState([]);
  const [isContractionActive, setIsContractionActive] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const routineSymptomsList = [
    'Nausea', 'Fatigue', 'Headache', 'Back/Pelvic pain', 
    'Heartburn', 'Constipation', 'Leg cramps', 'Sleep issues', 'Discharge', 'Mood shifts'
  ];

  const urgentSignsList = [
    'Vaginal bleeding', 'Leaking fluid', 'Severe abdominal pain', 
    'Persistent headache', 'Vision changes', 'Sudden swelling', 
    'Fever', 'Chest pain / Breathing diff.', 'Reduced fetal movement', 'Early labour signs'
  ];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  };

  const toggleUrgentFlag = (flag) => {
    setSelectedUrgentFlags(prev => prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]);
  };

  const startContractionTimer = () => {
    setStartTime(new Date());
    setIsContractionActive(true);
  };

  const stopContractionTimer = () => {
    if (!startTime) return;
    const durationSecs = Math.round((new Date() - startTime) / 1000);
    setContractions([{
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: `${durationSecs}s`,
      intensity: 'Moderate'
    }, ...contractions]);
    setIsContractionActive(false);
    setStartTime(null);
  };

  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '750px',
        margin: '0 auto',
        padding: '12px 10px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, sans-serif',
        color: '#1E293B',
        background: '#F8FAFC',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      {/* HEADER & LIFE STAGE SELECTOR */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: '800' }}>Health & Cycle Tracker</h1>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Select your current stage to customize your dashboard.</p>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'adolescent', label: 'Adolescent' },
          { id: 'conceiving', label: 'Conceiving' },
          { id: 'expectant', label: 'Expectant Mother' },
          { id: 'postpartum', label: 'Postpartum' }
        ].map((stage) => (
          <button
            key={stage.id}
            onClick={() => setLifeStage(stage.id)}
            style={{
              flex: '1 0 auto',
              padding: '8px 10px',
              borderRadius: '8px',
              border: lifeStage === stage.id ? '1px solid #0284c7' : '1px solid #CBD5E1',
              background: lifeStage === stage.id ? '#0284c7' : '#FFFFFF',
              color: lifeStage === stage.id ? '#FFFFFF' : '#475569',
              fontWeight: '700',
              fontSize: '0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {stage.label}
          </button>
        ))}
      </div>

      {/* STANDARD TRACKER CALENDAR */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>July 2026 Calendar</h2>
          <button onClick={() => toggleSection('calendar')} style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7' }}>
            {collapsedSections.calendar ? '+' : '−'}
          </button>
        </div>

        {!collapsedSections.calendar && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isSelected = day === 24;
                const isPeriodDay = day >= 1 && day <= 5; // Mocking a 5-day period window
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(`2026-07-${day < 10 ? '0' + day : day}`)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #F1F5F9',
                      background: isPeriodDay ? '#FFE4E6' : (isSelected ? '#E0F2FE' : '#F8FAFC'),
                      color: isPeriodDay ? '#9F1239' : (isSelected ? '#0369a1' : '#334155'),
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <span>{day}</span>
                    {isPeriodDay && <span style={{ fontSize: '0.5rem', color: '#E11D48', fontWeight: '800' }}>● DROP</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ADOLESCENT STAGE VIEW */}
      {lifeStage === 'adolescent' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#E11D48', textTransform: 'uppercase' }}>Adolescent Cycle Tracker</span>
            <h3 style={{ margin: '2px 0 10px 0', fontSize: '1rem' }}>Cycle Day {cycleDay} • Flow & Symptoms</h3>
            
            <div style={{ background: '#FFF1F2', padding: '12px', borderRadius: '8px', border: '1px solid #FECDD3', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#9F1239', fontWeight: '700' }}>🩸 Period & Flow Status</p>
                <span style={{ fontSize: '0.75rem', color: '#881337' }}>Current Flow: <strong>{flowIntensity}</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Light', 'Medium', 'Heavy'].map((flow) => (
                  <button 
                    key={flow} 
                    onClick={() => setFlowIntensity(flow)}
                    style={{
                      background: flowIntensity === flow ? '#E11D48' : '#FFFFFF',
                      color: flowIntensity === flow ? '#FFFFFF' : '#9F1239',
                      border: '1px solid #FDA4AF',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {flow}
                  </button>
                ))}
              </div>
            </div>

            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem' }}>Log Daily Teen Symptoms</h4>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {adolescentSymptomList.map((sym) => {
                const active = adolescentSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleAdolescentSymptom(sym)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '16px',
                      border: active ? '1px solid #E11D48' : '1px solid #CBD5E1',
                      background: active ? '#FFE4E6' : '#F8FAFC',
                      color: active ? '#9F1239' : '#334155',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {active ? '✓ ' : '+ '}{sym}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONCEIVING STAGE VIEW */}
      {lifeStage === 'conceiving' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#10B981', textTransform: 'uppercase' }}>Fertility & Ovulation Tracking</span>
            <h3 style={{ margin: '2px 0 10px 0', fontSize: '1rem' }}>{fertilityStatus}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '10px' }}>
              <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#166534' }}>Basal Body Temp (°C)</span>
                <input type="number" step="0.1" value={basalTemp} onChange={(e) => setBasalTemp(e.target.value)} style={{ width: '100%', marginTop: '4px', padding: '6px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#166534' }}>Cervical Mucus</span>
                <select value={cervicalMucus} onChange={(e) => setCervicalMucus(e.target.value)} style={{ width: '100%', marginTop: '4px', padding: '6px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.8rem', boxSizing: 'border-box' }}>
                  <option>Dry</option>
                  <option>Sticky</option>
                  <option>Creamy</option>
                  <option>Eggwhite / Stretchy</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POSTPARTUM STAGE VIEW */}
      {lifeStage === 'postpartum' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#8B5CF6', textTransform: 'uppercase' }}>Postpartum Recovery</span>
            <h3 style={{ margin: '2px 0 10px 0', fontSize: '1rem' }}>Recovery Phase • {weeksPostpartum}</h3>

            <div style={{ display: 'grid', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ background: '#F5F3FF', padding: '10px', borderRadius: '8px', border: '1px solid #DDD6FE', display: 'flex', justifyContent: 'space-between' }}>
                <span>Lochia Flow: <strong>{lochiaFlow}</strong></span>
                <span>Baby Feeding: <strong>{babyFeeding}</strong></span>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Emotional Check-in: <strong>{moodCheckin}</strong></span>
                <button onClick={() => alert('Logged postpartum check-in')} style={{ background: '#8B5CF6', color: '#FFFFFF', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPECTANT MOTHER / MATERNAL JOURNEY INTEGRATED VIEWS */}
      {lifeStage === 'expectant' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          
          {/* 1. Pregnancy Overview */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>Pregnancy Overview</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1rem' }}>Week {pregnancyData.currentWeek} • {pregnancyData.trimester}</h3>
              </div>
              <button onClick={() => toggleSection('overview')} style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7' }}>
                {collapsedSections.overview ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.overview && (
              <div style={{ display: 'grid', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Baby Size: <strong>{pregnancyData.babySize}</strong></span>
                  <span>Due Date: <strong>{pregnancyData.dueDate}</strong></span>
                </div>
                <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '8px', border: '1px solid #FCA5A5', color: '#991B1B', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hospital: {pregnancyData.hospitalProvider}</span>
                  <span>Emergency: {pregnancyData.emergencyContact}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Urgent Signs */}
          <div style={{ background: '#FEF2F2', borderRadius: '14px', border: '2px solid #EF4444', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🚨</span>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#991B1B' }}>Urgent Signs</h3>
              </div>
              <button onClick={() => toggleSection('urgent')} style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: '#991B1B' }}>
                {collapsedSections.urgent ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.urgent && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '10px' }}>
                  {urgentSignsList.map((sign) => {
                    const isSelected = selectedUrgentFlags.includes(sign);
                    return (
                      <button
                        key={sign}
                        onClick={() => toggleUrgentFlag(sign)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid #991B1B' : '1px solid #FCA5A5',
                          background: isSelected ? '#991B1B' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#991B1B',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {isSelected ? '⚠️ ' : '⭕ '}{sign}
                      </button>
                    );
                  })}
                </div>
                {selectedUrgentFlags.length > 0 && (
                  <a href={`tel:${pregnancyData.emergencyContact}`} style={{ display: 'block', textAlign: 'center', background: '#EF4444', color: '#FFFFFF', textDecoration: 'none', padding: '8px', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem' }}>
                    📞 Call Emergency Contact Now
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 3. Routine Symptoms */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Routine Symptoms</h3>
              <button onClick={() => toggleSection('symptoms')} style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7' }}>
                {collapsedSections.symptoms ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.symptoms && (
              <div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {routineSymptomsList.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '16px',
                          border: isSelected ? '1px solid #0284c7' : '1px solid #CBD5E1',
                          background: isSelected ? '#E0F2FE' : '#F8FAFC',
                          color: isSelected ? '#0369a1' : '#334155',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}{symptom}
                      </button>
                    );
                  })}
                </div>
                {selectedSymptoms.length > 0 && (
                  <button onClick={() => alert('Saved routine symptoms!')} style={{ background: '#0284c7', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}>
                    Save Symptoms
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. Clinical Vitals */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Clinical Vitals</h3>
              <button onClick={() => toggleSection('vitals')} style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7' }}>
                {collapsedSections.vitals ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.vitals && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B' }}>Weight (kg)</label>
                  <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B' }}>Blood Sugar</label>
                  <input type="number" step="0.1" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
              </div>
            )}
          </div>

          {/* 5. Fetal & Contractions */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Fetal Movement & Contractions</h3>
              <button onClick={() => toggleSection('fetal')} style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7' }}>
                {collapsedSections.fetal ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.fetal && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '10px' }}>Status: <strong>{fetalStatus}</strong></p>
                {!isContractionActive ? (
                  <button onClick={startContractionTimer} style={{ background: '#0284c7', color: '#FFFFFF', border: 'none', width: '90px', height: '90px', borderRadius: '50%', fontWeight: '700', fontSize: '0.7rem', cursor: 'pointer', margin: '0 auto' }}>
                    START CONTRACTION
                  </button>
                ) : (
                  <button onClick={stopContractionTimer} style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', width: '90px', height: '90px', borderRadius: '50%', fontWeight: '700', fontSize: '0.7rem', cursor: 'pointer', margin: '0 auto' }}>
                    STOP TIMER
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}