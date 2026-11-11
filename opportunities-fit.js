import {rubricFor, assessFit, fitVersion, fitReviewedOn} from './opportunities-fit-data.mjs?v=1';

const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const link = (url, label) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const sessionAnswers = new Map();
let dialog, returnFocus;

export function openAssessment(program, opener) {
  returnFocus = opener;
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'fit-dialog'; dialog.className = 'opp-dialog fit-dialog';
    dialog.setAttribute('aria-labelledby', 'fit-title');
    dialog.addEventListener('close',()=>{if (returnFocus?.isConnected && !returnFocus.disabled) returnFocus.focus({preventScroll:true});});
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
    document.body.append(dialog);
  }
  const rubric = rubricFor(program);
  const answers = sessionAnswers.get(program.id) || {};
  sessionAnswers.set(program.id, answers);
  dialog.innerHTML = `<div class="fit-heading"><p class="opp-kicker">YOUR NEXT STEP / ${e(program.short)}</p><button class="dialog-close" type="button" aria-label="Close application assessment">×</button></div>
    <h2 id="fit-title" tabindex="-1">${rubric?.type === 'exploration' ? 'Explore your fit.' : 'Your application, clearer.'}</h2>
    <p class="fit-program-name">${e(program.name)}</p>
    ${rubric ? assessmentMarkup(program, rubric, answers) : `<div class="fit-unavailable"><h3>${program.status === 'archived' ? 'This program is discontinued.' : 'Check the current offering first.'}</h3><p>${e(program.deadline)}</p><p>There is not enough confirmed current information to offer a useful score. Keep this program in your shortlist and ask the provider about its next offering.</p>${link(program.url,'Check with the provider')}</div>`}`;
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  if (rubric) {
    const form = dialog.querySelector('#fit-form');
    let assessed = false;
    const readAnswers = () => {for (const item of [...rubric.gates,...rubric.criteria]) answers[item.id] = new FormData(form).get(item.id) || '';};
    const renderResult = () => {
      const result = assessFit(rubric, answers);
      dialog.querySelector('#fit-result').innerHTML = resultMarkup(result, rubric);
      dialog.querySelector('#fit-announcement').textContent = result.score === null ? ({ineligible:'A listed requirement is not met.', 'eligibility-unknown':'Confirm eligibility to finish your assessment.', incomplete:`${result.answered} of ${rubric.criteria.length} scoring questions answered.`})[result.state] : `${result.score} out of 100. ${result.label}. This is not an admission probability.`;
    };
    form.addEventListener('submit', event => {
      event.preventDefault(); readAnswers(); assessed = true; renderResult();
      const result = dialog.querySelector('#fit-result'); result.focus({preventScroll:true});
      result.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
    form.addEventListener('change', () => {readAnswers(); if (assessed) renderResult();});
    dialog.querySelector('#fit-reset').addEventListener('click', () => {
      form.reset(); for (const key of Object.keys(answers)) delete answers[key];
      // Clear restored controls too: form.reset() would restore their HTML defaults.
      form.querySelectorAll('input[type=radio]').forEach(input=>{input.checked=false;});
      form.querySelectorAll('select').forEach(select=>{select.value='';});
      assessed = false; dialog.querySelector('#fit-result').innerHTML = emptyResult(rubric);
      dialog.querySelector('#fit-announcement').textContent = 'Assessment answers cleared for this program.';
      form.querySelector('select,input')?.focus();
    });
  }
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0; dialog.querySelector('#fit-title').focus({preventScroll:true});
}

function emptyResult(rubric) {
  return `<span class="fit-result-star" aria-hidden="true">✳</span><h3>A little clarity.<br>A next step.</h3><p>Answer ${rubric.criteria.length} short scoring questions and check the requirements. Your result will explain every point.</p><p class="fit-score-note">A self-assessment out of 100. Not an acceptance percentage.</p>`;
}

function assessmentMarkup(program, rubric, answers) {
  return `<p class="fit-intro">${rubric.type === 'exploration' ? 'See how the experience fits your interests and learning goals.' : 'Reflect on your preparation using this program’s published criteria.'} No account, uploads, or personal details needed.</p>
    <div class="fit-cycle"><strong>${e(program.cycle)}</strong><span>${e(program.deadline)}</span></div>
    <div class="fit-layout"><form id="fit-form" class="fit-form">
      <details class="fit-eligibility" open><summary><span class="opp-kicker">01 / REQUIREMENTS</span> Check the basics</summary><p>For the cycle you plan to attend. These answers are checked separately from your score.</p>
      ${rubric.gates.map(g=>`<label class="fit-gate"><span>${e(g.text)}</span><select name="${g.id}"><option value="">Not answered</option>${[['yes','Yes'],['no','No'],['unknown','Not sure']].map(([value,label])=>`<option value="${value}" ${answers[g.id]===value?'selected':''}>${label}</option>`).join('')}</select></label>`).join('')}</details>
      <p class="opp-kicker fit-section-label">02 / ${rubric.type === 'exploration' ? 'YOUR INTERESTS' : 'YOUR PREPARATION'}</p>
      ${rubric.criteria.map((c,index)=>`<fieldset class="fit-question"><legend><span class="fit-question-number">${String(index+1).padStart(2,'0')}</span>${e(c.title)}<span class="fit-weight">${c.weight} pts</span></legend><p>${e(c.prompt)}</p><div class="fit-choices">${[...c.levels,'Not sure'].map((label,i)=>`<label><input type="radio" name="${c.id}" value="${i===3?'unknown':i}" ${answers[c.id]===(i===3?'unknown':String(i))?'checked':''}><span>${e(label)}<small>${i===3?'Unscored':`${c.weight*i/2} pts`}</small></span></label>`).join('')}</div></fieldset>`).join('')}
      <div class="fit-form-actions"><button type="submit" class="opp-button primary">See my assessment ↗</button><button id="fit-reset" type="button" class="opp-text-button">Clear answers</button></div>
      <p class="fit-privacy">Answers stay in this tab’s memory and disappear when you reload. No answers are sent to STEM2Connect or program providers.</p>
    </form><aside id="fit-result" class="fit-result" tabindex="-1" aria-label="Your assessment result">${emptyResult(rubric)}</aside></div>
    <details class="fit-method"><summary>How the formula works & sources <span aria-hidden="true">+</span></summary><p>${e(rubric.note)}</p><p>The questions are informed by official program pages. <strong>STEM2Connect chose the weights and score bands; they are not the provider’s admissions formula and have not been validated against admissions outcomes.</strong></p><p>Each answer earns 0, half, or all of the question’s points. The weights total 100. Unanswered or “Not sure” answers remain unscored. A final score appears only when every scoring question is answered and every listed requirement is marked Yes.</p><p>75–100: strong checklist alignment. 45 to below 75: some alignment. Below 45: room to prepare. These bands describe this checklist only; scores are not comparable across programs and do not estimate admission chances. Other requirements and contextual factors may apply.</p><p class="fit-source-links">${[...new Set([rubric.source,...rubric.gates.map(g=>g.source),...rubric.criteria.map(c=>c.source)])].map((url,i)=>link(url,`Provider source ${i+1}`)).join('')}</p><small>Method ${fitVersion} · Sources reviewed ${fitReviewedOn}</small></details><p id="fit-announcement" class="sr-only" role="status" aria-live="polite"></p>`;
}

function resultMarkup(result, rubric) {
  const title = rubric.type === 'exploration' ? 'EXPLORATION FIT' : 'APPLICATION FIT';
  let headline;
  if (result.state === 'complete') headline = `<p class="opp-kicker">${title}</p><p class="fit-score"><strong>${result.score}</strong><span>/ 100</span></p><h3>${e(result.label)}</h3><p class="fit-score-note">Based on your answers. Not an admission probability.</p><p class="fit-eligibility-ok">✓ Listed requirements marked Yes</p>`;
  else if (result.state === 'ineligible') headline = `<p class="opp-kicker">REQUIREMENT CHECK</p><h3>A requirement needs attention.</h3><p>You marked No for a listed requirement. A high preparation score cannot override it.</p><ul>${result.unmet.map(g=>`<li>${e(g.text)}</li>`).join('')}</ul>`;
  else if (result.state === 'eligibility-unknown') headline = `<p class="opp-kicker">ONE STEP AT A TIME</p><h3>Check your eligibility.</h3><p>${result.missing.length} requirement ${result.missing.length===1?'answer is':'answers are'} still unconfirmed. No final score yet.</p>`;
  else headline = `<p class="opp-kicker">ASSESSMENT IN PROGRESS</p><h3>${result.answered} of ${rubric.criteria.length} answered.</h3><p>${result.lower} points recorded; the final total could be ${result.lower}–${result.upper} depending on your remaining answers. This is a possible score range, not a probability or confidence interval.</p>`;
  return `${headline}<div class="fit-breakdown"><h4>Your point breakdown</h4>${result.breakdown.map(c=>`<div class="fit-breakdown-row"><span>${e(c.title)}</span><strong>${c.answered?c.earned:'—'} / ${c.weight}</strong><div class="fit-bar" aria-hidden="true"><span style="width:${c.answered?c.value*50:0}%"></span></div></div>`).join('')}</div>
    <div class="fit-next"><h4>${result.next.length?'Where to focus next':'Keep your momentum'}</h4>${result.next.length?`<ul>${result.next.map(c=>`<li>${e(c.next)}</li>`).join('')}</ul>`:'<p>Review the provider’s current requirements and dates, and keep your examples specific and honest. A complete checklist does not guarantee a place.</p>'}</div>`;
}
