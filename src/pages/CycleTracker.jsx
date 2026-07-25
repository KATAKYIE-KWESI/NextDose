import { useState, useEffect } from 'react';

export default function CycleTracker() {
  // Navigation, Life Stage & Language state
  const [activeTab, setActiveTab] = useState('tracker'); 
  const [lifeStage, setLifeStage] = useState('expectant'); // 'adolescent', 'conceiving', 'expectant', 'postpartum'
  const [language, setLanguage] = useState('en'); // 'en', 'fr', 'ar'

  // Translation Dictionary
  const t = {
    en: {
      title: 'Health & Cycle Tracker',
      subtitle: 'Select your current stage to customize your dashboard.',
      stages: { adolescent: 'Adolescent', conceiving: 'Conceiving', expectant: 'Expectant Mother', postpartum: 'Postpartum' },
      calendarTitle: 'July 2026 Calendar',
      days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      drop: 'DROP',
      adolescentTracker: 'Adolescent Cycle Tracker',
      cycleDayPrefix: 'Cycle Day',
      flowStatus: '🩸 Period & Flow Status',
      currentFlow: 'Current Flow:',
      flows: ['Light', 'Medium', 'Heavy'],
      logTeen: 'Log Daily Teen Symptoms',
      adolescentSymptomList: ['Cramps', 'Headache', 'Acne', 'Bloating', 'Mood Swings', 'Fatigue'],
      fertilityTitle: 'Fertility & Ovulation Tracking',
      basalTemp: 'Basal Body Temp (°C)',
      cervicalMucus: 'Cervical Mucus',
      mucusOptions: ['Dry', 'Sticky', 'Creamy', 'Eggwhite / Stretchy'],
      postpartumTitle: 'Postpartum Recovery',
      recoveryPhase: 'Recovery Phase',
      lochiaFlow: 'Lochia Flow:',
      babyFeeding: 'Baby Feeding:',
      emotionalCheck: 'Emotional Check-in:',
      updateBtn: 'Update',
      postpartumAlert: 'Logged postpartum check-in',
      pregnancyOverview: 'Pregnancy Overview',
      weekPrefix: 'Week',
      babySize: 'Baby Size:',
      dueDate: 'Due Date:',
      hospital: 'Hospital:',
      emergency: 'Emergency:',
      urgentSigns: 'Urgent Signs',
      callEmergency: '📞 Call Emergency Contact Now',
      routineSymptoms: 'Routine Symptoms',
      saveSymptoms: 'Save Symptoms',
      savedSymptomsAlert: 'Saved routine symptoms!',
      clinicalVitals: 'Clinical Vitals',
      weightKg: 'Weight (kg)',
      bloodSugar: 'Blood Sugar',
      fetalTitle: 'Fetal Movement & Contractions',
      statusPrefix: 'Status:',
      tracking: 'Tracking...',
      timerReady: 'Timer Ready',
      startContraction: '▶ Start Contraction',
      stopContraction: '⏹ Stop & Log Contraction',
      recentLog: 'Recent Contractions Log',
      duration: 'Duration:',
      intensities: { Strong: 'Strong', Moderate: 'Moderate' }
    },
    fr: {
      title: 'Suivi de la Santé et du Cycle',
      subtitle: 'Sélectionnez votre étape actuelle pour personnaliser votre tableau de bord.',
      stages: { adolescent: 'Adolescente', conceiving: 'Conception', expectant: 'Femme Enceinte', postpartum: 'Post-partum' },
      calendarTitle: 'Calendrier Juillet 2026',
      days: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
      drop: 'RÈGLES',
      adolescentTracker: 'Suivi du Cycle Adolescent',
      cycleDayPrefix: 'Jour du cycle',
      flowStatus: '🩸 Statut des Règles et Flux',
      currentFlow: 'Flux Actuel :',
      flows: ['Léger', 'Moyen', 'Abondant'],
      logTeen: 'Enregistrer les symptômes quotidiens',
      adolescentSymptomList: ['Crampes', 'Maux de tête', 'Acné', 'Ballonnements', 'Sautes d\'humeur', 'Fatigue'],
      fertilityTitle: 'Suivi de la Fertilité et de l\'Ovulation',
      basalTemp: 'Température basale (°C)',
      cervicalMucus: 'Glaire cervicale',
      mucusOptions: ['Sec', 'Collant', 'Crémeux', 'Blanc d\'œuf / Élastique'],
      postpartumTitle: 'Récupération Post-partum',
      recoveryPhase: 'Phase de récupération',
      lochiaFlow: 'Flux des lochies :',
      babyFeeding: 'Alimentation du bébé :',
      emotionalCheck: 'Bilan émotionnel :',
      updateBtn: 'Mettre à jour',
      postpartumAlert: 'Bilan post-partum enregistré',
      pregnancyOverview: 'Aperçu de la Grossesse',
      weekPrefix: 'Semaine',
      babySize: 'Taille du bébé :',
      dueDate: 'Date prévue :',
      hospital: 'Hôpital :',
      emergency: 'Urgence :',
      urgentSigns: 'Signes d\'Urgence',
      callEmergency: '📞 Appeler le Contact d\'Urgence',
      routineSymptoms: 'Symptômes Habituels',
      saveSymptoms: 'Enregistrer les symptômes',
      savedSymptomsAlert: 'Symptômes habituels enregistrés !',
      clinicalVitals: 'Signes Vitaux',
      weightKg: 'Poids (kg)',
      bloodSugar: 'Glycémie',
      fetalTitle: 'Mouvements Fœtaux et Contractions',
      statusPrefix: 'Statut :',
      tracking: 'Enregistrement...',
      timerReady: 'Prêt',
      startContraction: '▶ Démarrer la Contraction',
      stopContraction: '⏹ Arrêter et Enregistrer',
      recentLog: 'Journal des Contractions',
      duration: 'Durée :',
      intensities: { Strong: 'Fortes', Moderate: 'Modérées' }
    },
    ar: {
      title: 'متبع Health & Cycle',
      subtitle: 'حدد مرحلتك الحالية لتخصيص لوحة التحكم الخاص بك.',
      stages: { adolescent: 'مراهقة', conceiving: 'تخطيط للحمل', expectant: 'حامل', postpartum: 'ما بعد الولادة' },
      calendarTitle: 'تقويم يوليو 2026',
      days: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
      drop: 'حيض',
      adolescentTracker: 'متبع دورة المراهقات',
      cycleDayPrefix: 'اليوم من الدورة',
      flowStatus: '🩸 حالة التدفق والحيض',
      currentFlow: 'التدفق الحالي:',
      flows: ['خفيف', 'متوسط', 'غزير'],
      logTeen: 'تسجيل أعراض المراهقة اليومية',
      adolescentSymptomList: ['تشنجات', 'صداع', 'حب شباب', 'انتفاخ', 'تقلبات مزاجية', 'إرهاق'],
      fertilityTitle: 'تتبع الخصوبة والتبويض',
      basalTemp: 'درجة حرارة الجسم الأساسية (°م)',
      cervicalMucus: 'مخاط عنق الرحم',
      mucusOptions: ['جاف', 'لزج', 'كريمي', 'بياض البيض / مطاطي'],
      postpartumTitle: 'فترة التعافي بعد الولادة',
      recoveryPhase: 'مرحلة التعافي',
      lochiaFlow: 'تدفق النفاس:',
      babyFeeding: 'تغذية الطفل:',
      emotionalCheck: 'المتابعة العاطفية:',
      updateBtn: 'تحديث',
      postpartumAlert: 'تم تسجيل حالة ما بعد الولادة',
      pregnancyOverview: 'نظرة عامة على الحمل',
      weekPrefix: 'الأسبوع',
      babySize: 'حجم الجنين:',
      dueDate: 'موعد الولادة المتوقع:',
      hospital: 'المستشفى:',
      emergency: 'الطوارئ:',
      urgentSigns: 'علامات خطيرة',
      callEmergency: '📞 الاتصال برقم الطوارئ الآن',
      routineSymptoms: 'الأعراض الاعتيادية',
      saveSymptoms: 'حفظ الأعراض',
      savedSymptomsAlert: 'تم حفظ الأعراض الاعتيادية!',
      clinicalVitals: 'المؤشرات الحيوية السريرية',
      weightKg: 'الوزن (كجم)',
      bloodSugar: 'سكر الدم',
      fetalTitle: 'حركة الجنين ومؤقت التقلصات',
      statusPrefix: 'الحالة:',
      tracking: 'جارٍ التتبع...',
      timerReady: 'المؤقت جاهز',
      startContraction: '▶ بدء تقلص الرحم',
      stopContraction: '⏹ إيقاف وتسجيل التقلص',
      recentLog: 'سجل التقلصات الأخيرة',
      duration: 'المدة:',
      intensities: { Strong: 'قوي', Moderate: 'متوسط' }
    }
  };

  const currentStrings = t[language];

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

  // Fetal & Contraction Stopwatch State
  const [fetalStatus, setFetalStatus] = useState('Movement feels normal');
  const [contractions, setContractions] = useState([]);
  const [isContractionActive, setIsContractionActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live Timer Effect for Contraction Stopwatch
  useEffect(() => {
    let interval = null;
    if (isContractionActive && startTime) {
      interval = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        setElapsedSeconds(seconds);
      }, 1000);
    } else {
      clearInterval(interval);
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isContractionActive, startTime]);

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
    setStartTime(Date.now());
    setIsContractionActive(true);
    setElapsedSeconds(0);
  };

  const stopContractionTimer = () => {
    if (!startTime) return;
    const durationSecs = Math.round((Date.now() - startTime) / 1000);
    setContractions([{
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      duration: `${durationSecs}s`,
      intensity: durationSecs > 45 ? 'Strong' : 'Moderate'
    }, ...contractions]);
    setIsContractionActive(false);
    setStartTime(null);
    setElapsedSeconds(0);
  };

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
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
      {/* LANGUAGE SELECTOR HEADER */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', marginBottom: '8px' }}>
        {[
          { id: 'en', label: 'English' },
          { id: 'fr', label: 'Français' },
          { id: 'ar', label: 'العربية' }
        ].map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: language === lang.id ? '1px solid #0284c7' : '1px solid #CBD5E1',
              background: language === lang.id ? '#0284c7' : '#FFFFFF',
              color: language === lang.id ? '#FFFFFF' : '#475569',
              fontSize: '0.65rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* HEADER & LIFE STAGE SELECTOR */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: '800' }}>{currentStrings.title}</h1>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>{currentStrings.subtitle}</p>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
        {[
          { id: 'adolescent', label: currentStrings.stages.adolescent },
          { id: 'conceiving', label: currentStrings.stages.conceiving },
          { id: 'expectant', label: currentStrings.stages.expectant },
          { id: 'postpartum', label: currentStrings.stages.postpartum }
        ].map((stage) => (
          <button
            key={stage.id}
            onClick={() => setLifeStage(stage.id)}
            style={{
              flex: '0 0 auto',
              padding: '10px 14px',
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
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>{currentStrings.calendarTitle}</h2>
          <button onClick={() => toggleSection('calendar')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7', padding: '4px 8px' }}>
            {collapsedSections.calendar ? '+' : '−'}
          </button>
        </div>

        {!collapsedSections.calendar && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
              {currentStrings.days.map((d, index) => (
                <span key={index}>{d}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isSelected = day === 24;
                const isPeriodDay = day >= 1 && day <= 5; 
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
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      position: 'relative'
                    }}
                  >
                    <span>{day}</span>
                    {isPeriodDay && <span style={{ fontSize: '0.45rem', color: '#E11D48', fontWeight: '800', lineHeight: 1 }}>{currentStrings.drop}</span>}
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
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#E11D48', textTransform: 'uppercase' }}>{currentStrings.adolescentTracker}</span>
            <h3 style={{ margin: '2px 0 10px 0', fontSize: '1rem' }}>{currentStrings.cycleDayPrefix} {cycleDay} • Flow & Symptoms</h3>
            
            <div style={{ background: '#FFF1F2', padding: '12px', borderRadius: '8px', border: '1px solid #FECDD3', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', color: '#9F1239', fontWeight: '700' }}>{currentStrings.flowStatus}</p>
                <span style={{ fontSize: '0.75rem', color: '#881337' }}>{currentStrings.currentFlow} <strong>{flowIntensity}</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {currentStrings.flows.map((flow, index) => {
                  const originalFlowKey = ['Light', 'Medium', 'Heavy'][index];
                  return (
                    <button 
                      key={flow} 
                      onClick={() => setFlowIntensity(originalFlowKey)}
                      style={{
                        flex: '1',
                        background: flowIntensity === originalFlowKey ? '#E11D48' : '#FFFFFF',
                        color: flowIntensity === originalFlowKey ? '#FFFFFF' : '#9F1239',
                        border: '1px solid #FDA4AF',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {flow}
                    </button>
                  );
                })}
              </div>
            </div>

            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem' }}>{currentStrings.logTeen}</h4>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {currentStrings.adolescentSymptomList.map((sym, index) => {
                const originalSym = adolescentSymptomList[index];
                const active = adolescentSymptoms.includes(originalSym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleAdolescentSymptom(originalSym)}
                    style={{
                      padding: '8px 12px',
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
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#10B981', textTransform: 'uppercase' }}>{currentStrings.fertilityTitle}</span>
            <h3 style={{ margin: '2px 0 10px 0', fontSize: '1rem', wordBreak: 'break-word' }}>{fertilityStatus}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '4px' }}>{currentStrings.basalTemp}</span>
                <input type="number" step="0.1" value={basalTemp} onChange={(e) => setBasalTemp(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '4px' }}>{currentStrings.cervicalMucus}</span>
                <select value={cervicalMucus} onChange={(e) => setCervicalMucus(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.8rem', boxSizing: 'border-box', background: '#FFFFFF' }}>
                  {currentStrings.mucusOptions.map((opt, index) => {
                    const originalOpt = ['Dry', 'Sticky', 'Creamy', 'Eggwhite / Stretchy'][index];
                    return <option key={opt} value={originalOpt}>{opt}</option>;
                  })}
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
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#8B5CF6', textTransform: 'uppercase' }}>{currentStrings.postpartumTitle}</span>
            <h3 style={{ margin: '2px 0 10px 0', fontSize: '1rem' }}>{currentStrings.recoveryPhase} • {weeksPostpartum}</h3>

            <div style={{ display: 'grid', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ background: '#F5F3FF', padding: '10px', borderRadius: '8px', border: '1px solid #DDD6FE', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>{currentStrings.lochiaFlow} <strong>{lochiaFlow}</strong></span>
                <span>{currentStrings.babyFeeding} <strong>{babyFeeding}</strong></span>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <span style={{ wordBreak: 'break-word' }}>{currentStrings.emotionalCheck} <strong>{moodCheckin}</strong></span>
                <button onClick={() => alert(currentStrings.postpartumAlert)} style={{ background: '#8B5CF6', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>{currentStrings.updateBtn}</button>
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
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>{currentStrings.pregnancyOverview}</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1rem' }}>{currentStrings.weekPrefix} {pregnancyData.currentWeek} • {pregnancyData.trimester}</h3>
              </div>
              <button onClick={() => toggleSection('overview')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7', padding: '4px 8px' }}>
                {collapsedSections.overview ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.overview && (
              <div style={{ display: 'grid', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>{currentStrings.babySize} <strong>{pregnancyData.babySize}</strong></span>
                  <span>{currentStrings.dueDate} <strong>{pregnancyData.dueDate}</strong></span>
                </div>
                <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '8px', border: '1px solid #FCA5A5', color: '#991B1B', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>{currentStrings.hospital} {pregnancyData.hospitalProvider}</span>
                  <span>{currentStrings.emergency} {pregnancyData.emergencyContact}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Urgent Signs */}
          <div style={{ background: '#FEF2F2', borderRadius: '14px', border: '2px solid #EF4444', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🚨</span>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#991B1B' }}>{currentStrings.urgentSigns}</h3>
              </div>
              <button onClick={() => toggleSection('urgent')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: '#991B1B', padding: '4px 8px' }}>
                {collapsedSections.urgent ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.urgent && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                  {urgentSignsList.map((sign) => {
                    const isSelected = selectedUrgentFlags.includes(sign);
                    return (
                      <button
                        key={sign}
                        onClick={() => toggleUrgentFlag(sign)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid #991B1B' : '1px solid #FCA5A5',
                          background: isSelected ? '#991B1B' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#991B1B',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textAlign: language === 'ar' ? 'right' : 'left',
                          width: '100%'
                        }}
                      >
                        {isSelected ? '⚠️ ' : '⭕ '}{sign}
                      </button>
                    );
                  })}
                </div>
                {selectedUrgentFlags.length > 0 && (
                  <a href={`tel:${pregnancyData.emergencyContact}`} style={{ display: 'block', textAlign: 'center', background: '#EF4444', color: '#FFFFFF', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem' }}>
                    {currentStrings.callEmergency}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 3. Routine Symptoms */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{currentStrings.routineSymptoms}</h3>
              <button onClick={() => toggleSection('symptoms')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7', padding: '4px 8px' }}>
                {collapsedSections.symptoms ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.symptoms && (
              <div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {routineSymptomsList.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        style={{
                          padding: '8px 12px',
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
                  <button onClick={() => alert(currentStrings.savedSymptomsAlert)} style={{ background: '#0284c7', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', width: '100%' }}>
                    {currentStrings.saveSymptoms}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. Clinical Vitals */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{currentStrings.clinicalVitals}</h3>
              <button onClick={() => toggleSection('vitals')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7', padding: '4px 8px' }}>
                {collapsedSections.vitals ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.vitals && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '4px' }}>{currentStrings.weightKg}</label>
                  <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '4px' }}>{currentStrings.bloodSugar} (mmol/L)</label>
                  <input type="number" step="0.1" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
              </div>
            )}
          </div>

          {/* 5. Fetal Movement & Contractions */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{currentStrings.fetalTitle}</h3>
              <button onClick={() => toggleSection('fetal')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: '#0284c7', padding: '4px 8px' }}>
                {collapsedSections.fetal ? '+' : '−'}
              </button>
            </div>

            {!collapsedSections.fetal && (
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '4px' }}>{currentStrings.statusPrefix}</label>
                  <select value={fetalStatus} onChange={(e) => setFetalStatus(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', background: '#FFFFFF' }}>
                    <option value="Movement feels normal">Movement feels normal</option>
                    <option value="Reduced movement noticed">Reduced movement noticed</option>
                    <option value="Very active / Kicking strongly">Very active / Kicking strongly</option>
                  </select>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', fontVariantNumeric: 'tabular-nums', color: isContractionActive ? '#EF4444' : '#0284c7', marginBottom: '8px' }}>
                    {formatTime(elapsedSeconds)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '10px' }}>
                    {isContractionActive ? currentStrings.tracking : currentStrings.timerReady}
                  </div>
                  
                  {!isContractionActive ? (
                    <button onClick={startContractionTimer} style={{ background: '#0284c7', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', width: '100%' }}>
                      {currentStrings.startContraction}
                    </button>
                  ) : (
                    <button onClick={stopContractionTimer} style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', width: '100%' }}>
                      {currentStrings.stopContraction}
                    </button>
                  )}
                </div>

                {contractions.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: '#475569' }}>{currentStrings.recentLog}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
                      {contractions.map((c) => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.72rem' }}>
                          <span>{c.time}</span>
                          <span>{currentStrings.duration} <strong>{c.duration}</strong></span>
                          <span>Intensity: <strong>{currentStrings.intensities[c.intensity] || c.intensity}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}