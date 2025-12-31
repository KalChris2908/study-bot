// quick theme init so CSS variables apply before paint
(function initTheme(){
  if(Storage.loadTheme() === "dark") document.documentElement.classList.add("dark");
})();

const topicForm = document.getElementById("topicForm");
const subjectSelect = document.getElementById("subjectSelect");
const titleInput = document.getElementById("titleInput");
const notesInput = document.getElementById("notesInput");
const statusSelect = document.getElementById("statusSelect");
const addTopicBtn = document.getElementById("addTopicBtn");
const searchInput = document.getElementById("searchInput");
const filterSubject = document.getElementById("filterSubject");
const revSubject = document.getElementById("revSubject");
const revButton = document.getElementById("revButton");
const quizButton = document.getElementById("quizButton");
const themeToggle = document.getElementById("themeToggle");
const markStudying = document.getElementById("markStudying");
const markDone = document.getElementById("markDone");
const card = document.getElementById("card");

let topics = Storage.loadTopics();
let editingId = null;
let currentShown = null;

// initial render
UI.renderTopicList(topics, (id)=> selectTopic(id), deleteTopic, editTopic);
UI.updateProgress(topics);

// theme toggle
themeToggle.addEventListener("click", ()=>{
  const isDark = document.documentElement.classList.toggle("dark");
  Storage.saveTheme(isDark ? "dark" : "light");
});

// add/update topic
topicForm.addEventListener("submit", e=>{
  e.preventDefault();
  const subject = subjectSelect.value;
  const title = titleInput.value.trim();
  const notes = notesInput.value.trim();
  const status = statusSelect.value;

  if(!title) { UI.toast("Title required"); return; }

  if(editingId){
    // update existing
    const idx = topics.findIndex(t=>t.id===editingId);
    if(idx>-1){
      topics[idx].subject = subject;
      topics[idx].title = title;
      topics[idx].notes = notes;
      topics[idx].status = status;
      UI.toast("Topic updated");
    }
    editingId = null;
  } else {
    const id = subject.slice(0,3).toLowerCase() + "_" + Date.now();
    topics.push({ id, subject, title, notes, status, quiz: null });
    UI.toast("Topic added");
  }

  Storage.saveTopics(topics);
  UI.renderTopicList(topics, (id)=> selectTopic(id), deleteTopic, editTopic);
  UI.updateProgress(topics);
  topicForm.reset();
});

// delete
function deleteTopic(id){
  if(!confirm("Delete this topic?")) return;
  topics = topics.filter(t=>t.id !== id);
  Storage.saveTopics(topics);
  UI.renderTopicList(topics, (id)=> selectTopic(id), deleteTopic, editTopic);
  UI.updateProgress(topics);
  UI.toast("Deleted");
  if(currentShown && currentShown.id === id) { currentShown = null; UI.renderCard(null); }
}

// edit
function editTopic(id){
  const t = topics.find(x=>x.id===id);
  if(!t) return;
  editingId = t.id;
  subjectSelect.value = t.subject;
  titleInput.value = t.title;
  notesInput.value = t.notes;
  statusSelect.value = t.status;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// select / revise single
function selectTopic(id){
  const t = topics.find(x=>x.id===id);
  currentShown = t;
  UI.renderCard(t);
  if(t && t.quiz) UI.showQuiz(t);
  else UI.hideQuiz();
}

// random revise
revButton.addEventListener("click", ()=> {
  const subj = revSubject.value;
  const pool = topics.filter(t => (subj==="all" || t.subject === subj));
  if(pool.length === 0) { UI.toast("No topics for chosen subject"); return; }
  const pick = pool[Math.floor(Math.random()*pool.length)];
  selectTopic(pick.id);
});

// quick quiz: pick a random topic that has a quiz
quizButton.addEventListener("click", ()=>{
  const subj = revSubject.value;
  const pool = topics.filter(t => t.quiz && (subj==="all" || t.subject === subj));
  if(pool.length===0){ UI.toast("No quiz-ready topics"); return; }
  const pick = pool[Math.floor(Math.random()*pool.length)];
  selectTopic(pick.id);
  UI.showQuiz(pick);
});

// mark studying / done
markStudying.addEventListener("click", ()=>{
  if(!currentShown) return UI.toast("No topic selected");
  const t = topics.find(x=>x.id===currentShown.id);
  if(!t) return;
  t.status = "studying";
  Storage.saveTopics(topics);
  UI.updateProgress(topics);
  UI.renderTopicList(topics, (id)=> selectTopic(id), deleteTopic, editTopic);
  UI.renderCard(t);
});

markDone.addEventListener("click", ()=>{
  if(!currentShown) return UI.toast("No topic selected");
  const t = topics.find(x=>x.id===currentShown.id);
  if(!t) return;
  t.status = "done";
  Storage.saveTopics(topics);
  UI.updateProgress(topics);
  UI.renderTopicList(topics, (id)=> selectTopic(id), deleteTopic, editTopic);
  UI.renderCard(t);
});

// search & filter behaviour
searchInput.addEventListener("input", ()=>{
  const q = searchInput.value.trim().toLowerCase();
  const subj = filterSubject.value;
  const out = topics.filter(t=>{
    const matchSubj = subj === "all" || t.subject === subj;
    const matchQuery = t.title.toLowerCase().includes(q) || (t.notes || "").toLowerCase().includes(q);
    return matchSubj && matchQuery;
  });
  UI.renderTopicList(out, (id)=> selectTopic(id), deleteTopic, editTopic);
});

filterSubject.addEventListener("change", ()=>{
  searchInput.dispatchEvent(new Event('input'));
});

// load defaults into storage if empty (only first run)
(function ensureDefaultContent(){
  if(!topics || topics.length === 0){
    topics = window.DEFAULT_TOPICS || [];
    Storage.saveTopics(topics);
    UI.renderTopicList(topics, (id)=> selectTopic(id), deleteTopic, editTopic);
    UI.updateProgress(topics);
  }
})();

// initial selection if any
if(topics.length) {
  UI.updateProgress(topics);
}
