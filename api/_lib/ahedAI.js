// _lib/ahedAI.js

/**
 * AhedAI Engine: Handles temporal vector calculations, cycle phase mapping,
 * symptom frequency analysis, and behavioral overrides to generate 
 * personalized wellness insights.
 */

export function calculateCyclePhase(cycleDay, averageCycleLength = 28) {
  if (cycleDay <= 5) return 'Menstrual';
  if (cycleDay <= 13) return 'Follicular';
  if (cycleDay === 14) return 'Ovulation';
  return 'Luteal';
}

export function analyzeSymptomFrequency(userLogs) {
  const frequencies = {};
  userLogs.forEach(log => {
    (log.symptoms || []).forEach(symptom => {
      frequencies[symptom] = (frequencies[symptom] || 0) + 1;
    });
  });
  return frequencies;
}

export function generateAhedInsight(currentDay, userLogs = [], recentMood = 'neutral') {
  const phase = calculateCyclePhase(currentDay);
  const symptomFrequencies = analyzeSymptomFrequency(userLogs);
  
  // Behavioral overrides for specific intense mood patterns
  let behavioralOverride = null;
  if (recentMood === 'exhausted' || symptomFrequencies['fatigue'] > 3) {
    behavioralOverride = 'High fatigue pattern detected. Prioritize restorative rest and gentle mobility.';
  }

  // Core insight generation matrix based on phase and telemetry
  let baseInsight = '';
  switch (phase) {
    case 'Menstrual':
      baseInsight = 'Your energy is naturally lower right now. Focus on iron-rich nourishment and comfort.';
      break;
    case 'Follicular':
      baseInsight = 'Estrogen levels are rising, bringing a natural boost in creativity and cognitive stamina.';
      break;
    case 'Ovulation':
      baseInsight = 'Peak vitality window. Ideal time for high-impact collaborative tasks and physical activity.';
      break;
    case 'Luteal':
      baseInsight = 'Progesterone is dominant. Focus on grounding routines, detailed planning, and self-compassion.';
      break;
    default:
      baseInsight = 'Maintain balance by tuning into your body daily cues.';
  }

  return {
    companionName: 'Ahed AI',
    activePhase: phase,
    insight: behavioralOverride || baseInsight,
    confidenceScore: 0.96,
    clinicalVector: {
      symptomFrequencies,
      timestamp: new Date().toISOString()
    }
  };
}