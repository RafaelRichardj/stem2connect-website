import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {programs} from '../../opportunities-data.mjs';
import {fitRubrics, rubricFor, assessFit} from '../../opportunities-fit-data.mjs';

const ready = rubric => Object.fromEntries([
  ...rubric.gates.map(g=>[g.id,'yes']), ...rubric.criteria.map(c=>[c.id,'2'])
]);
let supported = 0;
for (const program of programs) {
  const rubric = rubricFor(program);
  if (!rubric) {
    assert(['verify','archived'].includes(program.status), `Missing rubric for ${program.id}`);
    assert.equal(assessFit(rubric).score,null);
    continue;
  }
  supported++;
  const ids = [...rubric.gates,...rubric.criteria].map(q=>q.id);
  assert.equal(new Set(ids).size, ids.length, `Conflicting question IDs: ${program.id}`);
  assert.equal(rubric.criteria.reduce((n,c)=>n+c.weight,0),100);
  assert(rubric.criteria.every(c=>c.weight>0 && c.levels.length===3 && c.next));
  for (const question of [...rubric.gates,...rubric.criteria]) assert.equal(new URL(question.source).protocol,'https:');
  assert.equal(assessFit(rubric,ready(rubric)).score,100);
  const zero = {...ready(rubric),...Object.fromEntries(rubric.criteria.map(c=>[c.id,'0']))};
  assert.equal(assessFit(rubric,zero).score,0,'Zero is a valid answer, not missing');
  const half = {...ready(rubric),...Object.fromEntries(rubric.criteria.map(c=>[c.id,'1']))};
  assert.equal(assessFit(rubric,half).score,50);
  const blocked = {...ready(rubric),[rubric.gates[0].id]:'no'};
  assert.equal(assessFit(rubric,blocked).state,'ineligible');
  assert.equal(assessFit(rubric,blocked).score,null,'High points must not override an unmet requirement');
  const unconfirmed = {...ready(rubric),[rubric.gates[0].id]:'unknown'};
  assert.equal(assessFit(rubric,unconfirmed).state,'eligibility-unknown');
  assert.equal(assessFit(rubric,unconfirmed).score,null);
  for (const criterion of rubric.criteria) {
    for (const missing of ['', 'unknown', '3', '-1', 'NaN', 'yes', null, undefined]) {
      const result = assessFit(rubric,{...ready(rubric),[criterion.id]:missing});
      assert.equal(result.score,null);
      assert.equal(result.lower,100-criterion.weight);
      assert.equal(result.upper,100);
      assert.equal(result.state,'incomplete');
      assert.equal(result.next[0].id,criterion.id);
    }
    let previous = -1;
    for (const answer of ['0','1','2']) {
      const score = assessFit(rubric,{...zero,[criterion.id]:answer}).score;
      assert(score>=previous && score<=100);
      previous=score;
    }
  }
}
assert.equal(supported,13);
assert.deepEqual(programs.filter(p=>!rubricFor(p)).map(p=>p.id).sort(),['dsap','duke-stem','okstate-robotics','ualr']);
assert.equal(fitRubrics.mites.criteria.find(c=>c.id==='interest').weight,35);
assert.equal(fitRubrics.sams.criteria.find(c=>c.id==='community').weight,30);
assert.equal(fitRubrics.wss.criteria.find(c=>c.id==='mathematics').weight,45);
for (const id of ['smart','sally-ride','aggie','wie-rise']) {
  assert.equal(fitRubrics[id].type,'exploration');
  assert(!fitRubrics[id].criteria.some(c=>['academic','activities','references'].includes(c.id)));
}
const root = new URL('../../',import.meta.url);
const js = await readFile(new URL('opportunities.js',root),'utf8');
const html = await readFile(new URL('opportunities.html',root),'utf8');
assert(js.includes("import('./opportunities-fit.js?v=1')"));
assert(!/^import .*opportunities-fit/m.test(js));
assert(!html.includes('src="opportunities-fit'));
let bytes = 0;
for (const file of ['opportunities-fit.js','opportunities-fit-data.mjs','opportunities-fit.css']) bytes+=(await stat(new URL(file,root))).size;
assert(bytes < 65000,`On-demand assessment exceeded 65 KB: ${bytes}`);
console.log(`Application fit: ${supported} rubrics; weighted totals, unknown answers, eligibility gates, beginner checks and ${bytes}-byte on-demand budget passed.`);
