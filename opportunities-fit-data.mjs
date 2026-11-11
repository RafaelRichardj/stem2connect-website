// Provider-informed self-assessment, not an admissions probability model.
// Questions follow the linked provider pages. Weights are editorial choices.
export const fitVersion = '1.0';
export const fitReviewedOn = '2026-09-16';
const criterion = (id, title, weight, prompt, next, source, levels = ['Not yet', 'Partly', 'Clearly']) => ({id, title, weight, prompt, next, source, levels});
const gate = (id, text, source) => ({id, text, source});
const citizenship = source => gate('residency', 'I meet the US citizenship or permanent-residency requirement.', source);
const sources = {
  bwsi: 'https://bwsi.mit.edu/faq/',
  mites: 'https://mites.mit.edu/discover-mites/apply-to-mites/prepare-your-application-mites-summer-and-mites-semester/',
  sams: 'https://www.cmu.edu/pre-college/academic-programs/sams.html',
  clark: 'https://www.depts.ttu.edu/clarkscholars/ApplicationDetails.php',
  esteem: 'https://eng.umd.edu/cmse/pre-college-programs/esteem-ser-quest',
  esp: 'https://engineering.wisc.edu/engineering-summer-program/',
  wss: 'https://worldsciencescholars.com/application-details/',
  summet: 'https://undergraduate-admissions.mines.edu/summer-mines-engineering-and-training-summet/',
  duke: 'https://summersession.duke.edu/how-apply'
};
const academic = (weight, source) => criterion('academic', 'Academic preparation', weight, 'My schoolwork gives concrete evidence of strong preparation in the relevant subjects.', 'Identify relevant courses and examples of work you understand well; ask a teacher where to strengthen your preparation.', source);
const interest = (weight, source) => criterion('interest', 'Demonstrated interest', weight, 'I can explain my interest with specific learning, activities, or questions I have pursued.', 'Choose one real example of your curiosity and explain what you learned. Schoolwork and independent learning count.', source);
const reflection = (weight, source) => criterion('reflection', 'Purpose & reflection', weight, 'I can explain what I hope to learn, and reflect on how I have grown through a challenge.', 'Draft a specific learning goal and a short example of how you responded to a challenge.', source);
const recommendations = (weight, source, prompt) => criterion('references', 'Recommendation preparation', weight, prompt, 'Check the required recommender roles and deadlines; ask people who know your work before the application window.', source, ['Not arranged', 'Some arranged', 'All arranged']);

export const fitRubrics = {
  bwsi: {
    type: 'application', source: sources.bwsi,
    note: 'Course prerequisites and progress are central to this preparation checklist. Exact course expectations vary.',
    gates: [gate('location', 'I live or attend high school in the US and can be in the US for the summer program.', 'https://bwsi.mit.edu/apply-now/')],
    criteria: [
      criterion('coursework', 'Online course preparation', 50, 'I have completed the current-year online work expected by my chosen course at application time.', 'Read the expectations at the start of your chosen course and work through the required modules for this cycle.', sources.bwsi, ['Not started', 'In progress', 'Expected work complete']),
      interest(20, sources.bwsi),
      criterion('responses', 'Application responses', 20, 'My short answers explain my course choice and give specific examples of my activities.', 'Prepare concise, specific answers within the application’s limits.', 'https://bwsi.mit.edu/apply-now/', ['Not started', 'Drafted', 'Reviewed']),
      recommendations(10, sources.bwsi, 'I have arranged the summer application’s teacher or mentor recommendation.')
    ]
  },
  mites: {
    type: 'application', source: sources.mites,
    note: 'This checklist covers several stated qualities; MITES also considers context that a short self-assessment cannot capture.',
    gates: [citizenship(sources.mites)],
    criteria: [academic(35, sources.mites), interest(35, sources.mites), reflection(20, sources.mites), recommendations(10, sources.mites, 'I have arranged the required teacher and counselor/administrator recommendations.')]
  },
  sams: {
    type: 'application', source: sources.sams,
    note: 'SAMS emphasizes STEM interest and contribution to a supportive community. This tool does not score income or personal background.',
    gates: [citizenship(sources.sams), gate('documents', 'I can provide the required financial documentation or accepted waiver through the official application.', sources.sams)],
    criteria: [interest(40, sources.sams),
      criterion('community', 'Community contribution', 30, 'I can describe how I contributed to a group or community through learning, activities, or service.', 'Choose an example of supporting others and explain your contribution and what you learned.', sources.sams),
      reflection(20, sources.sams), recommendations(10, sources.sams, 'I have arranged two recommendations, including the required math instructor or provider-approved alternative.')]
  },
  clark: {
    type: 'application', source: sources.clark,
    note: 'Clark reviews a full application. This checklist uses its requested components, not inferred acceptance odds.',
    gates: [citizenship('https://www.depts.ttu.edu/clarkscholars/ProgramDetails.php')],
    criteria: [academic(35, sources.clark),
      criterion('activities', 'Meaningful activities', 30, 'I can explain my most meaningful activities or accomplishments and my own contribution.', 'Select your most meaningful activities rather than adding more just to fill a list.', sources.clark),
      criterion('essays', 'Essay preparation', 25, 'I have developed specific, reflective responses to the published essay prompts.', 'Read the official prompts and draft responses that show your own thinking and experience.', sources.clark, ['Not started', 'Drafted', 'Reviewed']),
      recommendations(10, sources.clark, 'I have arranged three recommendations, at least two from teachers.')]
  },
  esteem: {
    type: 'application', source: sources.esteem,
    note: 'Use this to prepare from the latest published requirements; confirm the next cycle before applying.',
    gates: [gate('academics', 'I meet the published 3.2 GPA minimum, math/science grade rules, and required trigonometry, chemistry and pre-calculus coursework.', sources.esteem), gate('availability', 'I can attend the full four-week commuter program and have a serious interest in engineering at Maryland.', sources.esteem)],
    criteria: [interest(35, sources.esteem),
      criterion('communication', 'Communication', 25, 'I can explain an engineering idea clearly in writing and in conversation.', 'Practice explaining a technical idea to someone outside the subject.', sources.esteem),
      criterion('purpose', 'Engineering purpose', 25, 'I can explain a societal problem I would like to address through engineering.', 'Pick a concrete problem and explain why engineering interests you as a way to address it.', sources.esteem),
      recommendations(15, sources.esteem, 'I have arranged recommendations from a math teacher and a science teacher.')]
  },
  esp: {
    type: 'application', source: sources.esp,
    note: 'ESP describes holistic selection. The weights below organize preparation, not the university’s review process.',
    gates: [citizenship(sources.esp), gate('academics', 'I have at least a 3.0 unweighted GPA and the required year of algebra and geometry.', sources.esp)],
    criteria: [academic(40, sources.esp), interest(25, sources.esp), reflection(20, sources.esp), recommendations(15, sources.esp, 'I have arranged the required recommendation form with someone who knows my work.')]
  },
  wss: {
    type: 'application', source: sources.wss,
    note: 'Advanced mathematical thinking matters here; paid activities, awards, and prior research are not required by this checklist.',
    gates: [gate('school', 'I am in high school or accelerated middle school, or an eligible gap year, and can finish the program before university.', sources.wss), gate('access', 'I can discuss advanced math/science in English, access a computer and internet, and commit about two hours weekly for a year.', sources.wss)],
    criteria: [
      criterion('mathematics', 'Mathematical depth', 45, 'I can show and explain mathematical work that goes substantially beyond routine exercises.', 'Choose a challenging problem or mathematical idea and explain your reasoning in your own words.', sources.wss),
      criterion('independence', 'Independent curiosity', 25, 'I pursue challenging ideas beyond assigned work and keep going when they are difficult.', 'Explore one topic independently and keep a short record of your questions and discoveries.', sources.wss),
      criterion('communication', 'Explaining ideas', 20, 'I can discuss complex mathematical or scientific ideas clearly in English.', 'Practice explaining your mathematical thinking to a teacher, mentor, or peer.', sources.wss),
      recommendations(10, sources.wss, 'My parent/guardian and teacher/mentor can complete their required recommendation forms.')]
  },
  summet: {
    type: 'exploration', source: sources.summet,
    note: 'These weights reflect the activities offered. They are an exploration-fit checklist, not published selection weights.',
    gates: [gate('stay', 'I can take part in a full residential week at Mines during the offered dates.', sources.summet)],
    criteria: [interest(50, sources.summet),
      criterion('teamwork', 'Team project interest', 30, 'I want to build and learn with a team, including trying unfamiliar tasks.', 'Think about what you would enjoy learning through a shared engineering project.', sources.summet),
      criterion('college', 'College exploration goals', 20, 'I can describe what I want to learn about engineering study or college life.', 'Write two questions you would like to ask a student or engineer at Mines.', sources.summet)]
  },
  'duke-session': {
    type: 'application', source: sources.duke,
    note: 'Assessment applies to Summer Session, a separate offering from the discontinued STEM Academy.',
    gates: [gate('course', 'My selected course is open to high school students and I meet its prerequisites and format restrictions.', sources.duke)],
    criteria: [academic(40, sources.duke),
      criterion('statement', 'Course-specific goals', 35, 'My personal statement explains why this course supports my academic or personal goals.', 'Connect the specific course to a clear goal in your personal statement.', sources.duke, ['Not started', 'Drafted', 'Reviewed']),
      criterion('documents', 'Application preparation', 25, 'My resume, transcript, and any required English proficiency evidence are ready for the official application.', 'Use Duke’s supporting-document checklist to identify what you still need.', sources.duke, ['Not started', 'Partly ready', 'Ready'])]
  }
};

// Enrollment/exploration programs should never penalize a beginner for lacking research.
for (const [id, source, focus] of [
  ['sally-ride', 'https://extendedstudies.ucsd.edu/sally-ride-science/k12-students/sally-ride-science-academy', 'a grade-appropriate science or STEAM workshop'],
  ['wie-rise', 'https://eng.umd.edu/wie/future-students/6-12-programs/rise', 'an introduction to engineering research online'],
  ['aggie', 'https://aggiestem.tamu.edu/', 'a day or overnight STEM camp for my grade'],
  ['smart', 'https://ultracold.uchicago.edu/SMART2026', 'science exploration and laboratory visits']
]) {
  fitRubrics[id] = {
    type: 'exploration', source,
    note: 'This is a personal exploration-fit checklist, not a competitive admissions assessment. No prior research or awards are scored.',
    gates: [],
    criteria: [
      criterion('interest', 'Interest in the experience', 50, `I am interested in ${focus}.`, 'Review the activities and identify something you would like to try.', source, ['Not for me', 'Some interest', 'Strong interest']),
      criterion('goals', 'Learning goals', 30, 'I can name something I would like to learn or explore through this program.', 'Pick one question or skill you would like to explore; being a beginner is fine.', source),
      criterion('format', 'Learning format', 20, 'The published setting and activities suit the way I want to learn.', 'Compare the setting and activities with what you enjoy. Confirm the next session’s details.', source, ['Not a fit', 'Somewhat', 'Good fit'])]
  };
}

export function rubricFor(program) {
  if (!program || program.status === 'archived' || program.status === 'verify') return null;
  const rubric = fitRubrics[program.id];
  if (!rubric) return null;
  // WSS allows accelerated study and a gap year: do not impose a guessed grade cutoff.
  const schoolStage = program.grades.map(grade=>grade===13?'recent high school graduate':`grade ${grade}`).join(' or ');
  let schoolRule = `At program start I will be in ${schoolStage}${program.minAge ? ` and at least ${program.minAge} years old` : ''}.`;
  if (['sally-ride','aggie'].includes(program.id)) schoolRule = 'My grade matches the published requirements for the specific workshop or camp track I plan to join.';
  if (program.id === 'bwsi') schoolRule = 'I have checked the current high-school eligibility rules for my chosen BWSI course and meet them.';
  const requirements = program.id === 'wss' ? [] : [gate('school', schoolRule, program.url)];
  return {...rubric, gates:[...requirements, ...rubric.gates]};
}

export function assessFit(rubric, answers = {}) {
  if (!rubric) return {state:'unavailable', score:null, breakdown:[], missing:[], unmet:[]};
  const missing = rubric.gates.filter(g => answers[g.id] !== 'yes' && answers[g.id] !== 'no');
  const unmet = rubric.gates.filter(g => answers[g.id] === 'no');
  const breakdown = rubric.criteria.map(c => {
    const value = answers[c.id];
    const answered = value === '0' || value === '1' || value === '2';
    return {...c, answered, value:answered ? Number(value) : null, earned:answered ? c.weight * Number(value) / 2 : null};
  });
  const unknownWeight = breakdown.filter(c=>!c.answered).reduce((sum,c)=>sum+c.weight,0);
  const earned = breakdown.reduce((sum,c)=>sum+(c.earned ?? 0),0);
  const state = unmet.length ? 'ineligible' : missing.length ? 'eligibility-unknown' : unknownWeight ? 'incomplete' : 'complete';
  const score = state === 'complete' ? earned : null;
  return {state, score, breakdown, missing, unmet, answered:breakdown.filter(c=>c.answered).length,
    lower:earned, upper:earned+unknownWeight,
    label:score === null ? '' : score >= 75 ? 'Strong checklist alignment' : score >= 45 ? 'Some checklist alignment' : 'Room to prepare',
    next:breakdown.filter(c=>!c.answered || c.value < 2).sort((a,b)=>(b.weight-(b.earned ?? 0))-(a.weight-(a.earned ?? 0))).slice(0,3)
  };
}
