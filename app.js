
const input    = document.getElementById('taskInput');
const addBtn   = document.getElementById('addTaskBtn');
const list     = document.getElementById('taskList');
const filters  = document.querySelector('.filters');
const emptyMsg = document.getElementById('emptyMsg');
const clearBtn = document.getElementById('clearCompleted');
const counter  = document.getElementById('counter');
const trashBox   = document.getElementById('trashBox');
const trashList  = document.getElementById('trashList');
const emptyTrash = document.getElementById('emptyTrash');




function createTodoItem(text, completed = false, createdAt = Date.now()) {

  const li   = document.createElement('li');
  const span = document.createElement('span');
  const date = document.createElement('span');
  const del  = document.createElement('button');

  span.className = 'text';
  span.textContent = text;

  date.className = 'date';
  date.textContent = formatDate(createdAt);
  date.title = `Eklenme: ${new Date(Number(createdAt)).toLocaleString('tr-TR')}`;

  del.textContent = 'Sil';

  if (completed) li.classList.add('completed');

  li.appendChild(span);
  li.appendChild(date);
  li.appendChild(del);

  li.dataset.createdAt = createdAt;
  return li;

}




function updateEmptyState() {

  const hasItems = !!list.querySelector('li');

  if (emptyMsg) emptyMsg.classList.toggle('hidden', hasItems);
  
}



function formatDate(ts) {

  const d = new Date(Number(ts));

  return d.toLocaleString('tr-TR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

}



function updateCounter() {

  if (!counter) return;

  const active = list.querySelectorAll('li:not(.completed)').length;

  counter.textContent = active === 0
    ? 'Aktif görev yok'
    : `${active} aktif görev kaldı`;
        
    counter.classList.remove('bump');
   
    void counter.offsetWidth;
    counter.classList.add('bump');

}




function saveTasks() {

  const tasks = [];
  list.querySelectorAll('li').forEach(li => {
    tasks.push({
      text: li.querySelector('.text').textContent,
      completed: li.classList.contains('completed'),
      createdAt: Number(li.dataset.createdAt) || Date.now(),
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));

}




function loadTrash() {
  try { return JSON.parse(localStorage.getItem('tasks.trash') || '[]'); }
  catch { return []; }
}


function saveTrash(arr) {
  localStorage.setItem('tasks.trash', JSON.stringify(arr));
}

let trash = loadTrash();



function renderTrash() {
  if (!trashList) return;
  trashList.innerHTML = '';

  trash.forEach((t, i) => {

    const row = document.createElement('li');
    row.innerHTML = `
      <span class="text">${t.text}</span>
      <span class="date" title="Silinme: ${new Date(t.deletedAt).toLocaleString('tr-TR')}">
        ${formatDate(t.deletedAt)}
      </span>
      <div class="actions">
        <button class="restore" data-i="${i}">Geri Al</button>
        <button class="purge" data-i="${i}">Kalıcı Sil</button>
      </div>
    `;
    trashList.appendChild(row);

  });

if (trashBox) trashBox.open = trash.length > 0;

if (emptyTrash) emptyTrash.disabled = trash.length === 0;
const c = document.getElementById('trashCount');

if (c) c.textContent = trash.length ? `(${trash.length})` : '';

}



function loadTasks() {

  const saved = localStorage.getItem('tasks');
  if (!saved) return;
  JSON.parse(saved).forEach(t => {
    const created = t.createdAt ?? Date.now();
    list.appendChild(createTodoItem(t.text, t.completed, created));
  });

}



function addTask() {
  const text = input.value.trim();
  if (!text) { 
    input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
    input.focus(); return; 
    }



  const li = createTodoItem(text, false, Date.now());
  list.appendChild(li);
  li.classList.add('added');


  input.value = '';
  input.focus();
  saveTasks();
  updateEmptyState();
  updateCounter();
}



list.addEventListener('click', (e) => {

  const li = e.target.closest('li');
  if (!li) return;


  if (li.classList.contains('editing')) return;


  if (e.target.tagName === 'BUTTON') {
    const index = [...list.children].indexOf(li);
    const item = {
      text: li.querySelector('.text').textContent,
      completed: li.classList.contains('completed'),
      createdAt: Number(li.dataset.createdAt) || Date.now(),
      originalIndex: index,
      deletedAt: Date.now(),
    };


    trash.unshift(item);
    saveTrash(trash);
    renderTrash();


    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      li.remove();
      saveTasks();
      updateEmptyState();
      updateCounter();
      if (typeof updateRelativeTimes === 'function') updateRelativeTimes();
    }, { once: true });
    return;
  }


  if (e.target.classList.contains('text') || e.target === li) {
    li.classList.toggle('completed');
    saveTasks();
    updateCounter();
  }
});



if (trashList) {
  trashList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const i = Number(btn.dataset.i);
    if (Number.isNaN(i)) return;


    if (btn.classList.contains('restore')) {
      const t = trash.splice(i, 1)[0];


      const li = createTodoItem(t.text, t.completed, t.createdAt);
      const children = [...list.children];
      const targetIndex = Math.min(t.originalIndex ?? children.length, children.length);

      if (children.length === 0 || targetIndex >= children.length) {
        list.appendChild(li);
      } else {
        list.insertBefore(li, children[targetIndex]);
      }

      saveTasks();
      saveTrash(trash);
      renderTrash();
      updateEmptyState();
      updateCounter();
      if (typeof updateRelativeTimes === 'function') updateRelativeTimes();


      li.classList.add('added');
      return;
    }


    if (btn.classList.contains('purge')) {
      trash.splice(i, 1);
      saveTrash(trash);
      renderTrash();
    }
  });
}



if (emptyTrash) {
  emptyTrash.addEventListener('click', () => {
    if (!trash.length) return;
    trash = [];
    saveTrash(trash);
    renderTrash();
  });
}




list.addEventListener('dblclick', (e) => {
  const span = e.target.closest('.text');
  if (!span) return;

  const li = span.closest('li');
  if (!li) return;

  li.classList.add('editing');

  const edit = document.createElement('input');
  edit.type = 'text';
  edit.value = span.textContent;
  edit.className = 'edit';

  span.replaceWith(edit);
  edit.focus();
  edit.select();

  const finish = (commit) => {
    
    if (!li.classList.contains('editing')) return;

    const newSpan = document.createElement('span');
    newSpan.className = 'text';

    if (commit) {
      const val = edit.value.trim();
      newSpan.textContent = val || span.textContent;
    } else {
      newSpan.textContent = span.textContent;
    }

    edit.replaceWith(newSpan);
    li.classList.remove('editing');
    saveTasks();
  };

  edit.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') finish(true);
    if (ev.key === 'Escape') finish(false);
  });
  edit.addEventListener('blur', () => finish(true));
});




addBtn.addEventListener('click', addTask);

input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });



if (filters) {
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;

    filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    list.setAttribute('data-filter', btn.dataset.filter);
    localStorage.setItem('tasks.filter', btn.dataset.filter);
  });
}



if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    list.querySelectorAll('li.completed').forEach(li => {
      const index = [...list.children].indexOf(li);
      const item = {
        text: li.querySelector('.text').textContent,
        completed: true,
        createdAt: Number(li.dataset.createdAt) || Date.now(),
        originalIndex: index,
        deletedAt: Date.now(),
      };

      
      trash.unshift(item);

    
      li.remove();
    });

    saveTasks();
    saveTrash(trash);
    renderTrash();
    updateEmptyState();
    updateCounter();
  });
}



window.addEventListener('load', () => {
    loadTasks();
    updateEmptyState();
    updateCounter();
    renderTrash();


  const lastFilter = localStorage.getItem('tasks.filter') || 'all';
  list.setAttribute('data-filter', lastFilter);
  const btn = document.querySelector(`.filters button[data-filter="${lastFilter}"]`);
  if (btn) {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
});



const rocket = document.getElementById('rocket');



if (rocket) {
  rocket.addEventListener('click', () => {

    rocket.classList.remove('live','resetting');
    void rocket.offsetWidth;
    rocket.classList.add('live');
  });


  rocket.addEventListener('animationend', (e) => {
    if (e.animationName === 'rocketFlyLive') {

      rocket.classList.remove('live');
      rocket.classList.add('resetting');

      setTimeout(() => rocket.classList.remove('resetting'), 180);
    }
  });
}



const container = document.querySelector('.container');
if (container) {
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    container.style.setProperty('--x', `${x}%`);
    container.style.setProperty('--y', `${y}%`);
  });
}



new Sortable(document.getElementById('taskList'), {
  animation: 150,
  ghostClass: 'dragging',
  onEnd() {
    saveTasks();
  }
});






