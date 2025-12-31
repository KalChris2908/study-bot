const UI = (function(){
  const els = {
    topicList: document.getElementById("topicList"),
    totalCount: document.getElementById("totalCount"),
    doneCount: document.getElementById("doneCount"),
    progressBar: document.getElementById("progressBar"),
    card: document.getElementById("card"),
    cardTitle: document.getElementById("cardTitle"),
    cardMeta: document.getElementById("cardMeta"),
    cardNotes: document.getElementById("cardNotes"),
    emptyMsg: document.getElementById("emptyMsg"),
    toast: document.getElementById("toast"),
    quizArea: document.getElementById("quizArea"),
    qText: document.getElementById("qText"),
    choices: document.getElementById("choices"),
    quizResult: document.getElementById("quizResult"),
    shortAnswer: document.getElementById("shortAnswer"),
    shortInput: document.getElementById("shortInput"),
    shortCheck: document.getElementById("shortCheck")
  };

  function toast(msg){
    const t = els.toast;
    t.textContent = msg;
    t.style.opacity = 1;
    setTimeout(()=> t.style.opacity = 0, 2000);
  }

  function clearList(){ els.topicList.innerHTML = ""; }

  function renderTopicList(topics, onSelect, onDelete, onEdit){
    clearList();
    if(!topics || topics.length === 0){
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "No topics — add one above.";
      els.topicList.appendChild(li);
      return;
    }

    topics.forEach(t => {
      const li = document.createElement("li");
      li.className = "topic-item";
      li.innerHTML = `
        <div class="topic-left">
          <div class="topic-title">${escapeHtml(t.title)}</div>
          <div class="topic-meta">${escapeHtml(t.subject)} • ${statusLabel(t.status)}</div>
        </div>
        <div class="topic-actions">
          <button class="small-btn" data-id="${t.id}" data-action="rev">Revise</button>
          <button class="small-btn" data-id="${t.id}" data-action="edit">Edit</button>
          <button class="small-btn" data-id="${t.id}" data-action="del">Delete</button>
        </div>
      `;
      els.topicList.appendChild(li);

      li.querySelectorAll("button").forEach(btn=>{
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        btn.addEventListener("click", e=>{
          if(action === "rev") onSelect(id);
          if(action === "edit") onEdit(id);
          if(action === "del") onDelete(id);
        });
      });
    });
  }

  function statusLabel(s){
    if(s === "done") return "Done";
    if(s === "studying") return "Studying";
    return "Not started";
  }

  function renderCard(topic){
    if(!topic){
      els.card.classList.add("hidden");
      els.emptyMsg.classList.remove("hidden");
      return;
    }
    els.emptyMsg.classList.add("hidden");
    els.card.classList.remove("hidden");
    els.cardTitle.textContent = topic.title;
    els.cardMeta.textContent = `${topic.subject} • ${statusLabel(topic.status)}`;
    els.cardNotes.textContent = topic.notes || "No notes available.";
    hideQuiz();
    els.quizResult.textContent = "";
  }

  function showQuiz(topic){
    const q = topic.quiz;
    if(!q) {
      els.quizArea.classList.add("hidden");
      return;
    }
    els.quizArea.classList.remove("hidden");
    els.qText.textContent = q.question;
    els.quizResult.textContent = "";
    els.choices.innerHTML = "";
    els.shortAnswer.classList.add("hidden");
    if(q.type === "mcq"){
      q.choices.forEach((c,i)=>{
        const b = document.createElement("button");
        b.className = "choice-btn";
        b.textContent = c;
        b.addEventListener("click", ()=>{
          if(i === q.answer) {
            b.classList.add("correct");
            els.quizResult.textContent = "Correct ✅";
          } else {
            b.classList.add("wrong");
            els.quizResult.textContent = `Wrong — correct: ${q.choices[q.answer]}`;
          }
        });
        els.choices.appendChild(b);
      });
    } else if(q.type === "short"){
      els.shortAnswer.classList.remove("hidden");
      els.shortInput.value = "";
      els.shortCheck.onclick = ()=>{
        const user = (els.shortInput.value || "").trim().toLowerCase();
        const ans = (q.answer || "").toString().trim().toLowerCase();
        if(!user) { toast("Type your answer"); return; }
        if(user.includes(ans) || ans.includes(user)) {
          els.quizResult.textContent = "Correct ✅";
        } else {
          els.quizResult.textContent = `Try again — expected: ${q.answer}`;
        }
      };
    }
  }

  function hideQuiz(){
    els.quizArea.classList.add("hidden");
    els.qText.textContent = "";
    els.choices.innerHTML = "";
    els.shortAnswer.classList.add("hidden");
    els.quizResult.textContent = "";
  }

  function updateProgress(topics){
    const total = topics.length || 0;
    const done = topics.filter(t => t.status === "done").length;
    const percent = total === 0 ? 0 : Math.round((done/total)*100);
    document.getElementById("totalCount").textContent = total;
    document.getElementById("doneCount").textContent = done;
    document.getElementById("progressBar").style.width = percent + "%";
  }

  // simple escaper
  function escapeHtml(s){ return String(s || "").replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

  return {
    renderTopicList, renderCard, toast, updateProgress, showQuiz, hideQuiz, escapeHtml
  };
})();
