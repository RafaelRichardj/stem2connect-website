// Edit this directory to update programs. Dates and claims link to primary sources.
// Campus coordinates are approximate host locations, not check-in directions.
export const reviewedOn = '2026-09-16';
export const programs = [
  {
    id: 'bwsi', name: 'Beaver Works Summer Institute', short: 'BWSI', organization: 'Massachusetts Institute of Technology',
    topics: ['engineering', 'coding', 'robotics'], kind: 'Engineering', icon: 'robot',
    description: 'Build, code, and solve real engineering challenges in a rigorous, team-based summer experience.',
    location: 'Cambridge, Massachusetts', region: 'northeast', coordinates: [42.3601, -71.0942],
    modes: ['campus', 'online'], season: 'summer', duration: '4 weeks', weeks: 4, grades: [12], minAge: null,
    cost: 'Income-based · up to $2,400', tuitionFree: false, aid: true, price: 2400,
    costNote: '2026: free for qualifying families below the published $200,000 income and asset threshold; otherwise $2,400. Housing is not provided.',
    eligibility: 'Primarily rising seniors in the US. Required online coursework and course-specific prerequisites apply.',
    status: 'closed', cycle: '2026 cycle finished', deadline: '2027 application dates have not been confirmed here.',
    goals: ['build', 'explore'], experience: 'advanced',
    url: 'https://bwsi.mit.edu/', sources: ['https://bwsi.mit.edu/faq/'],
    admissions: 'Selective application with prerequisite coursework. No verified acceptance-rate figure is included.'
  },
  {
    id: 'sams', name: 'Summer Academy for Math & Science', short: 'SAMS', organization: 'Carnegie Mellon University',
    topics: ['science', 'mathematics', 'research', 'coding'], kind: 'Research & discovery', icon: 'atom',
    description: 'Six weeks of college-level STEM, hands-on projects, and mentorship in a fully funded residential program.',
    location: 'Pittsburgh, Pennsylvania', region: 'northeast', coordinates: [40.4433, -79.9436],
    modes: ['campus'], season: 'summer', duration: '6 weeks + virtual preparation', weeks: 6, grades: [12], minAge: 16,
    cost: 'No program fee', tuitionFree: true, aid: false, price: 0,
    costNote: 'SAMS is fully funded. Students cover travel. Financial documentation is required with the application; students cannot buy a place.',
    eligibility: 'Apply in grade 11; age 16+ by the start. US citizenship or permanent residency is required. Review the full academic requirements.',
    status: 'closed', cycle: '2026 cycle finished', deadline: 'The 2026 deadline was February 1. Check the official site for the next cycle.',
    goals: ['research', 'explore', 'college'], experience: 'advanced',
    url: 'https://www.cmu.edu/pre-college/academic-programs/sams.html', sources: ['https://www.cmu.edu/pre-college/cost-financial-aid/index.html', 'https://www.cmu.edu/pre-college/admission/'],
    admissions: 'Holistic, selective review. Financial documentation forms part of the application.'
  },
  {
    id: 'mites', name: 'MITES Summer', short: 'MITES', organization: 'Massachusetts Institute of Technology',
    topics: ['science', 'engineering', 'mathematics'], kind: 'STEM immersion', icon: 'orbit',
    description: 'Explore challenging STEM courses, visit laboratories, and experience life at MIT with a community of curious students.',
    location: 'Cambridge, Massachusetts', region: 'northeast', coordinates: [42.3601, -71.0942],
    modes: ['campus'], season: 'summer', duration: '6 weeks', weeks: 6, grades: [12], minAge: null,
    cost: 'Tuition, housing & meals covered', tuitionFree: true, aid: false, price: 0,
    costNote: 'All program-related costs are covered. Students are responsible for travel to and from MIT.',
    eligibility: 'Apply during grade 11. Applicants must be US citizens or permanent residents; all eligible students may apply.',
    status: 'closed', cycle: 'Watch for the next cycle', deadline: 'Applications typically open in November and close February 1. Confirm the next cycle with MITES.',
    goals: ['explore', 'college'], experience: 'advanced',
    url: 'https://mites.mit.edu/discover-mites/mites-summer/', sources: ['https://mites.mit.edu/discover-mites/apply-to-mites/prepare-your-application-mites-summer-and-mites-semester/'],
    admissions: 'Holistic application review; no personal admission probability can be inferred from this finder.'
  },
  {
    id: 'summet', name: 'Summer Mines Engineering & Training', short: 'SUMMET', organization: 'Colorado School of Mines',
    topics: ['engineering', 'science', 'coding', 'design'], kind: 'Engineering', icon: 'compass',
    description: 'Try engineering projects and campus life during a residential week designed to help you picture your future in STEM.',
    location: 'Golden, Colorado', region: 'west', coordinates: [39.7511, -105.2226],
    modes: ['campus'], season: 'summer', duration: '1 week', weeks: 1, grades: [12], minAge: null,
    cost: '$50 confirmation fee', tuitionFree: true, aid: false, price: 50,
    costNote: 'Tuition, housing, and meals are covered. Accepted students pay a $50 confirmation fee and arrange their own travel.',
    eligibility: 'Apply in grade 11 for the summer before grade 12. The provider lists no residency restrictions. Prospective first-generation students are encouraged to apply.',
    status: 'upcoming', cycle: '2027 dates announced', opens: '2026-10-12', deadline: 'Applications open October 12, 2026. Three one-week sessions run in June–July 2027.',
    goals: ['build', 'explore', 'college'], experience: 'beginner',
    url: 'https://undergraduate-admissions.mines.edu/summer-mines-engineering-and-training-summet/', sources: [],
    admissions: 'Application required. Check the provider for the complete selection process.'
  },
  {
    id: 'wss', name: 'World Science Scholars', short: 'WSS', organization: 'World Science Festival',
    topics: ['mathematics', 'science', 'research'], kind: 'Global learning', icon: 'orbit',
    description: 'Connect advanced mathematical thinking with frontier science through a global, online learning community.',
    location: 'Online · worldwide', region: 'online', coordinates: null,
    modes: ['online'], season: 'year-round', duration: '1 academic year · about 2 hours/week', weeks: 36, grades: [7, 8, 9, 10, 11, 12], minAge: null,
    cost: 'Free for selected scholars', tuitionFree: true, aid: false, price: 0,
    costNote: 'The program is free. Students need a computer and reliable internet.',
    eligibility: 'High school or accelerated middle school students with exceptional mathematical ability, worldwide. Complete the program before university.',
    status: 'upcoming', cycle: '2027 cycle planned', deadline: 'The provider says 2027 applications will open in fall 2026. The previous deadline was April 15, 2026.',
    goals: ['research', 'explore'], experience: 'advanced',
    url: 'https://worldsciencescholars.com/application-details/', sources: [],
    admissions: 'Student application plus parent/guardian and teacher/mentor recommendations. No verified acceptance rate is included.'
  },
  {
    id: 'clark', name: 'Anson L. Clark Scholars Program', short: 'CLARK', organization: 'Texas Tech University',
    topics: ['research', 'science', 'engineering', 'mathematics'], kind: 'Research', icon: 'atom',
    description: 'Work closely with faculty on a substantial research project in a small, seven-week residential cohort.',
    location: 'Lubbock, Texas', region: 'south', coordinates: [33.5843, -101.8783],
    modes: ['campus'], season: 'summer', duration: '7 weeks', weeks: 7, grades: [12, 13], minAge: 17,
    cost: 'No tuition · $25 application fee', tuitionFree: true, aid: false, price: 25,
    costNote: 'Housing and meals are included. A $25 application fee and travel are not covered. A $750 stipend follows successful completion of the research report.',
    eligibility: 'Age 17+ by the start; rising seniors or recent high school graduates. US citizens or permanent residents only.',
    status: 'closed', cycle: '2026 cycle finished', deadline: 'The 2026 deadline was February 16. A January 2 opening for the next cycle has not been confirmed.',
    goals: ['research', 'college'], experience: 'advanced',
    url: 'https://www.depts.ttu.edu/clarkscholars/', sources: ['https://www.depts.ttu.edu/clarkscholars/ProgramDetails.php', 'https://www.depts.ttu.edu/clarkscholars/ApplicationDetails.php'],
    admissions: 'The university describes a cohort of 12 scholars. Cohort size is not an acceptance rate.'
  },
  {
    id: 'esteem', name: 'ESTEEM / SER-Quest', short: 'ESTEEM', organization: 'University of Maryland',
    topics: ['engineering', 'research', 'science'], kind: 'Research', icon: 'atom',
    description: 'Develop an engineering research project while learning how researchers ask questions and communicate their findings.',
    location: 'College Park, Maryland', region: 'south', coordinates: [38.9897, -76.9378],
    modes: ['campus'], season: 'summer', duration: '4 weeks · commuter', weeks: 4, grades: [12], minAge: null,
    cost: 'No program fee', tuitionFree: true, aid: false, price: 0,
    costNote: 'Free for selected participants. The 2026 program was commuter-only, without housing.',
    eligibility: 'Rising seniors; minimum 3.2 GPA and specified math/science coursework. Full-time availability and interest in engineering at Maryland are required.',
    status: 'closed', cycle: '2026 cycle finished', deadline: 'The 2026 application deadline was March 29; the program ran July 7–31. Next-cycle dates need confirmation.',
    goals: ['research', 'college'], experience: 'advanced',
    url: 'https://eng.umd.edu/cmse/pre-college-programs/esteem-ser-quest', sources: [],
    admissions: 'Application, recommendations, academic records, and a student/guardian interview are part of the process.'
  },
  {
    id: 'esp', name: 'Engineering Summer Program', short: 'ESP', organization: 'University of Wisconsin–Madison',
    topics: ['engineering', 'mathematics', 'science', 'design'], kind: 'Engineering', icon: 'compass',
    description: 'Study engineering, physics, chemistry, and mathematics, with design workshops and faculty mentoring on campus.',
    location: 'Madison, Wisconsin', region: 'midwest', coordinates: [43.0715, -89.4125],
    modes: ['campus'], season: 'summer', duration: '3 weeks', weeks: 3, grades: [11, 12], minAge: null,
    cost: 'Free · housing & meals included', tuitionFree: true, aid: false, price: 0,
    costNote: 'The residential program, housing, and meals are free. Confirm travel and personal expenses with the provider.',
    eligibility: 'Current sophomores or juniors at application; US citizens or permanent residents; 3.0 unweighted GPA and algebra/geometry prerequisites.',
    status: 'closed', cycle: '2026 cycle finished', deadline: '2026 applications are closed. The program ran July 11–31; a January opening for the next cycle is not yet confirmed here.',
    goals: ['build', 'explore', 'college'], experience: 'exploring',
    url: 'https://engineering.wisc.edu/engineering-summer-program/', sources: [],
    admissions: 'Selective, holistic review. The provider does not select on a single metric.'
  },
  {
    id: 'sally-ride', name: 'Sally Ride Science Academy', short: 'SALLY RIDE', organization: 'UC San Diego Extended Studies',
    topics: ['science', 'coding', 'robotics', 'design'], kind: 'STEAM workshops', icon: 'rocket',
    description: 'Step into the role of a scientist, coder, or space explorer through hands-on workshops for school-age learners.',
    location: 'San Diego, California · venues vary by grade', region: 'west', coordinates: [32.8704, -117.2311],
    modes: ['campus'], season: 'summer', duration: 'Varies by workshop', weeks: null, grades: [1,2,3,4,5,6,7,8,9,10,11,12], minAge: null,
    cost: 'Varies by workshop', tuitionFree: false, aid: false, price: null,
    costNote: 'Check the selected workshop for tuition and any funding options. The next course catalogue may change.',
    eligibility: 'Elementary, middle, and high school tracks. Check grade requirements and the exact venue for your workshop.',
    status: 'upcoming', cycle: 'Enrollment returns January 2027', deadline: 'The provider lists January 2027 for next summer’s enrollment, without an exact opening day. Courses may fill before their deadlines.',
    goals: ['build', 'explore'], experience: 'beginner',
    url: 'https://extendedstudies.ucsd.edu/sally-ride-science/k12-students/sally-ride-science-academy', sources: [],
    admissions: 'Workshop enrollment is rolling and capacity-limited. Check individual course requirements.'
  },
  {
    id: 'wie-rise', name: 'WIE RISE!', short: 'WIE RISE', organization: 'University of Maryland',
    topics: ['engineering', 'research', 'science'], kind: 'Virtual discovery', icon: 'orbit',
    description: 'Visit engineering labs virtually, meet student researchers, and try at-home activities across engineering disciplines.',
    location: 'Online · hosted from College Park, Maryland', region: 'online', coordinates: null,
    modes: ['online'], season: 'summer', duration: '1 week · 2 hours/day in 2026', weeks: 1, grades: [9,10,11,12], minAge: null,
    cost: '$25 in 2026', tuitionFree: false, aid: false, price: 25,
    costNote: 'The published 2026 fee was $25. Confirm the 2027 price when the next programme details are released.',
    eligibility: 'Rising grades 9–12. Open to all students. This is an introduction to research, not an internship or credit-bearing course.',
    status: 'upcoming', cycle: 'Applications return January 2027', deadline: '2027 information and applications are planned for January; the provider has not given an exact day.',
    goals: ['explore', 'research'], experience: 'beginner',
    url: 'https://eng.umd.edu/wie/future-students/6-12-programs/rise', sources: [],
    admissions: 'Capacity-limited program; 2026 registration closed when full.'
  },
  {
    id: 'okstate-robotics', name: 'Automation & Robotics Discovery', short: 'OSU', organization: 'Oklahoma State University',
    topics: ['robotics', 'engineering', 'coding'], kind: 'Robotics', icon: 'robot',
    description: 'Explore electrical engineering, automation, and mechatronics through an immersive hands-on camp.',
    location: 'Stillwater, Oklahoma', region: 'south', coordinates: [36.1235, -97.0715],
    modes: ['campus'], season: 'summer', duration: '1 week (published format)', weeks: 1, grades: [9,10,11,12], minAge: null,
    cost: '$499 on the existing listing', tuitionFree: false, aid: false, price: null,
    costNote: 'The existing page lists $499 including accommodation and meals, but still references 2025. Confirm the current offering and price before planning.',
    eligibility: 'The published listing is for grades 9–12. Current dates and enrollment need confirmation with OSU.',
    status: 'verify', cycle: 'Current offering unconfirmed', deadline: 'The official page has no confirmed 2026/2027 dates. Contact the provider before applying.',
    goals: ['build', 'explore'], experience: 'beginner',
    url: 'https://ceat.okstate.edu/stem/summer-camps/automation-and-robotics-discovery', sources: ['https://ceat.okstate.edu/stem/summer-programs'],
    admissions: 'Current availability needs confirmation. This listing is retained for research, not presented as open enrollment.'
  },
  {
    id: 'aggie', name: 'Aggie STEM Summer Camps', short: 'AGGIE STEM', organization: 'Texas A&M University',
    topics: ['engineering', 'science', 'robotics', 'mathematics'], kind: 'STEM camps', icon: 'robot',
    description: 'Tackle practical STEM projects with day camps for younger students and overnight experiences for older learners.',
    location: 'College Station, Texas', region: 'south', coordinates: [30.6187, -96.3365],
    modes: ['campus'], season: 'summer', duration: '1 week', weeks: 1, grades: [3,4,5,6,7,8,9,10,11,12], minAge: null,
    cost: '2026 day camp: $425', tuitionFree: false, aid: false, price: null,
    costNote: 'The 2026 day camp lists $425; overnight fees differ. The provider states no full scholarships for 2026. Confirm your grade-specific option and next-cycle fees.',
    eligibility: 'Day camps: incoming grades 3–5. Overnight camps: incoming grades 6–12. Match your student to the correct track.',
    status: 'closed', cycle: 'Check the next camp season', deadline: 'Check the official camp catalogue for new dates and registration. Prices shown refer to 2026.',
    goals: ['build', 'explore'], experience: 'beginner',
    url: 'https://aggiestem.tamu.edu/', sources: [],
    admissions: 'Camp registration and age-specific tracks; availability varies by session.'
  },
  {
    id: 'ualr', name: 'Nanotechnology Summer Mentorships', short: 'UA LITTLE ROCK', organization: 'University of Arkansas at Little Rock',
    topics: ['science', 'research', 'engineering'], kind: 'Research', icon: 'atom',
    description: 'Investigate nanotechnology with staff and student researchers at the Center for Integrative Nanotechnology Sciences.',
    location: 'Little Rock, Arkansas', region: 'south', coordinates: [34.7251, -92.3409],
    modes: ['campus'], season: 'summer', duration: 'Confirm with the center', weeks: null, grades: [9,10,11,12], minAge: null,
    cost: 'Confirm with the center', tuitionFree: false, aid: false, price: null,
    costNote: 'A current program fee or stipend is not published on the linked overview.',
    eligibility: 'High school students. Mentorships are competitive and depend on mentor availability; contact CINS for specific requirements.',
    status: 'verify', cycle: 'Ask about mentor availability', deadline: 'No current application window is published. Ask the center whether a place is available for your intended summer.',
    goals: ['research'], experience: 'exploring',
    url: 'https://ualr.edu/nanotechnology/programs/', sources: [],
    admissions: 'Competitive, subject to mentor availability. No verified acceptance rate is included.'
  },
  {
    id: 'dsap', name: 'Discovering STEM in ACES', short: 'DSAP', organization: 'University of Illinois Urbana-Champaign',
    topics: ['science', 'environment', 'research'], kind: 'STEM discovery', icon: 'leaf',
    description: 'A listed ACES pre-college pathway exploring STEM in food, agriculture, and environmental systems.',
    location: 'Urbana, Illinois', region: 'midwest', coordinates: [40.1031, -88.2253],
    modes: ['campus'], season: 'summer', duration: 'Current format unconfirmed', weeks: null, grades: [10,11,12], minAge: null,
    cost: 'Current fees unconfirmed', tuitionFree: false, aid: false, price: null,
    costNote: 'Older material mentions a program fee. A current fee, schedule, and application were not confirmed on the official listing.',
    eligibility: 'Historically rising grades 10–12. Confirm current eligibility and whether the program is running with ACES.',
    status: 'verify', cycle: 'Current offering unconfirmed', deadline: 'The official listing does not confirm a 2026/2027 offering. Check with ACES before making plans.',
    goals: ['explore', 'research'], experience: 'exploring',
    url: 'https://aces.illinois.edu/discovering-stem-aces-program-dsap', sources: ['https://aces.illinois.edu/news/high-school-students-get-taste-campus-life-aces-summer-programs'],
    admissions: 'Current application and selection details need confirmation from ACES.'
  },
  {
    id: 'smart', name: 'Science, Mathematics & Research Training', short: 'SMART', organization: 'University of Chicago · Chin Lab',
    topics: ['science', 'mathematics', 'research', 'engineering'], kind: 'Science discovery', icon: 'atom',
    description: 'Explore research laboratories, quantum science, and astronomy with university scientists and students.',
    location: 'Chicago, Illinois', region: 'midwest', coordinates: [41.7918, -87.6012],
    modes: ['campus'], season: 'summer', duration: 'About 1 week in the 2026 listing', weeks: 1, grades: [9,10,11,12], minAge: null,
    cost: 'Confirm with the organizer', tuitionFree: false, aid: false, price: null,
    costNote: 'The official overview does not specify a program fee. Students must arrange their own transportation.',
    eligibility: 'High school students interested in science. No previous experience is required.',
    status: 'closed', cycle: '2026 dates have passed', deadline: 'The official 2026 page lists July 16–21 as tentative dates. The next offering has not been confirmed here.',
    goals: ['explore', 'research'], experience: 'beginner',
    url: 'https://ultracold.uchicago.edu/SMART2026', sources: [],
    admissions: 'The provider welcomes high school students without prior experience; confirm next-cycle availability.'
  },
  {
    id: 'duke-session', name: 'Duke Summer Session for High School Students', short: 'DUKE', organization: 'Duke University',
    topics: ['science', 'mathematics', 'coding'], kind: 'College courses', icon: 'compass',
    description: 'Explore selected undergraduate courses through a separate Duke summer offering with commuter and online options.',
    location: 'Durham, North Carolina', region: 'south', coordinates: [36.0014, -78.9382],
    modes: ['campus', 'online'], season: 'summer', duration: '6 weeks', weeks: 6, grades: [11,12], minAge: 16,
    cost: 'Tuition varies by enrollment', tuitionFree: false, aid: false, price: null,
    costNote: 'Check the Summer Session tuition schedule for the selected courses. This is a separate program from the discontinued STEM Academy.',
    eligibility: 'For 2026: students in grades 10 or 11 during 2025–26, age 16+ by the start. Local commuter or eligible online courses; check course restrictions.',
    status: 'closed', cycle: '2026 cycle finished', deadline: '2026 applications opened March 1 and closed June 15. Confirm the next summer’s calendar.',
    goals: ['college', 'explore'], experience: 'advanced',
    url: 'https://summersession.duke.edu/', sources: ['https://summersession.duke.edu/how-apply'],
    admissions: 'Application review and course-specific enrollment requirements apply.'
  },
  {
    id: 'duke-stem', name: 'Duke Summer STEM Academy', short: 'DUKE ARCHIVE', organization: 'Duke University',
    topics: ['engineering', 'design', 'coding'], kind: 'Archived program', icon: 'compass',
    description: 'The engineering design academy named in the original list is no longer offered. Its official archive is retained here for clarity.',
    location: 'Durham, North Carolina · former host', region: 'south', coordinates: [36.0014, -78.9382],
    modes: ['campus'], season: 'summer', duration: 'Discontinued', weeks: null, grades: [], minAge: null,
    cost: 'Not accepting students', tuitionFree: false, aid: false, price: null,
    costNote: 'There is no current enrollment for this academy. Duke Summer Session is a separate alternative, with its own fees and requirements.',
    eligibility: 'Discontinued. Do not apply or pay through an outdated listing.',
    status: 'archived', cycle: 'No longer offered', deadline: 'The official application page states that this program is no longer offered.',
    goals: [], experience: 'exploring', alternative: 'duke-session',
    url: 'https://sites.duke.edu/summerstem/?p=27', sources: ['https://summersession.duke.edu/'],
    admissions: 'Not accepting applications.'
  }
];

export const topicLabels = { engineering: 'Engineering', science: 'Science', coding: 'Coding & AI', robotics: 'Robotics', mathematics: 'Mathematics', research: 'Research', design: 'Design & making', environment: 'Environment' };

export function filterPrograms(items, filters = {}, saved = []) {
  const query = (filters.query || '').trim().toLowerCase();
  return items.filter(p => {
    if (filters.savedOnly && !saved.includes(p.id)) return false;
    if (query && !`${p.name} ${p.short} ${p.organization} ${p.location} ${p.description} ${p.topics.join(' ')}`.toLowerCase().includes(query)) return false;
    if (filters.topics?.length && !filters.topics.some(t => p.topics.includes(t))) return false;
    if (filters.grade && !p.grades.includes(Number(filters.grade))) return false;
    if (filters.age && p.minAge && Number(filters.age) < p.minAge) return false;
    if (filters.mode && !p.modes.includes(filters.mode)) return false;
    if (filters.region && p.region !== filters.region) return false;
    if (filters.budget === 'free' && !p.tuitionFree) return false;
    if (filters.budget === 'aid' && !p.aid && !p.tuitionFree) return false;
    if (filters.budget === '500' && (p.price === null || p.price > 500)) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.season && p.season !== filters.season) return false;
    if (filters.duration === 'short' && (p.weeks === null || p.weeks > 2)) return false;
    if (filters.duration === 'long' && (p.weeks === null || p.weeks <= 2)) return false;
    if (filters.finder && p.status === 'archived') return false;
    return true;
  });
}

export function matchReasons(p, preferences = {}) {
  const reasons = [];
  const topics = (preferences.topics || []).filter(t => p.topics.includes(t));
  if (topics.length) reasons.push(topics.map(t => topicLabels[t]).join(' + '));
  if (preferences.goal && p.goals.includes(preferences.goal)) reasons.push({build:'Hands-on projects', research:'Research experience', explore:'Explore your interests', college:'College preparation'}[preferences.goal]);
  if (preferences.experience && p.experience === preferences.experience) reasons.push({beginner:'Beginner-friendly', exploring:'Build on your experience', advanced:'An academic challenge'}[preferences.experience]);
  if (preferences.mode && p.modes.includes(preferences.mode)) reasons.push(preferences.mode === 'online' ? 'Online option' : 'Campus experience');
  if (preferences.budget && p.tuitionFree) reasons.push('Tuition covered');
  return reasons;
}

export function rankPrograms(items, preferences = {}) {
  return [...items].sort((a, b) => {
    if (a.status === 'archived' || b.status === 'archived') return Number(a.status === 'archived') - Number(b.status === 'archived');
    return matchReasons(b, preferences).length - matchReasons(a, preferences).length;
  });
}
