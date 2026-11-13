const container = document.querySelector('#judges');
const notice = document.querySelector('#notice');
try {
  const response = await fetch('./judges.json');
  if (!response.ok) throw new Error('Judge list unavailable');
  const people = await response.json();
  if (!Array.isArray(people) || !people.length) throw new Error('Judge list empty');
  for (const [index, person] of people.entries()) {
    const card = document.createElement('article'); card.className = 'card';
    const portrait = document.createElement('div'); portrait.className = 'portrait';
    if (person.photo && /^assets\/[a-zA-Z0-9._-]+$/.test(person.photo)) {
      const img = document.createElement('img'); img.src = person.photo; img.alt = `Portrait of ${person.name}`; img.loading = 'lazy'; portrait.append(img);
    } else { const initials = document.createElement('span'); initials.className = 'initials'; initials.setAttribute('aria-hidden','true'); initials.textContent = person.name.split(/\s+/).slice(0,2).map(x=>x[0]).join(''); portrait.append(initials); }
    const details = document.createElement('div'); details.className='detail';
    const number = document.createElement('span'); number.className='number'; number.textContent=String(index+1).padStart(2,'0');
    const name = document.createElement('h3'); name.textContent=person.name;
    details.append(number,name);
    if (person.title) { const title = document.createElement('p'); title.textContent=person.title; details.append(title); }
    card.append(portrait,details); container.append(card);
  }
} catch { notice.hidden=false; }
