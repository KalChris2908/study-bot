const Storage = (function(){
  const TOPIC_KEY = "studybot_topics_v1";
  const THEME_KEY = "studybot_theme_v1";

  function loadTopics(){
    try{
      const raw = localStorage.getItem(TOPIC_KEY);
      if(!raw) {
        // initialize with defaults
        localStorage.setItem(TOPIC_KEY, JSON.stringify(window.DEFAULT_TOPICS || []));
        return JSON.parse(localStorage.getItem(TOPIC_KEY));
      }
      return JSON.parse(raw);
    } catch(e){
      console.error("Failed to load topics", e);
      return [];
    }
  }

  function saveTopics(topics){
    localStorage.setItem(TOPIC_KEY, JSON.stringify(topics));
  }

  function saveTheme(mode){ localStorage.setItem(THEME_KEY, mode); }
  function loadTheme(){ return localStorage.getItem(THEME_KEY) || "light"; }

  return { loadTopics, saveTopics, saveTheme, loadTheme };
})();
