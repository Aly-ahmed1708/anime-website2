// Data for defaults (main character per anime) and 5 episodes per anime with summaries in English and Arabic

const defaults = {
  "Naruto": {
    main: {
      name: "Naruto Uzumaki",
      img: "images/naruto.webp",
      bio: "Energetic ninja with a dream to become Hokage."
    },
    episodes: {
      1: { en: "Naruto becomes ninja.", ar: "ناروتو يصبح نينجا." },
      2: { en: "Team 7 is formed.", ar: "تشكيل الفريق 7." },
      3: { en: "Training starts.", ar: "يبدأ التدريب." },
      4: { en: "Mission begins.", ar: "تبدأ المهمة." },
      5: { en: "Zabuza appears.", ar: "ظهور زابوزا." }
    }
  },
  "One Piece": {
    main: {
      name: "Monkey D. Luffy",
      img: "images/luffy.png",
      bio: "Rubber-powered pirate aiming to be Pirate King."
    },
    episodes: {
      1: { en: "Luffy sets sail.", ar: "لوفي يبدأ رحلته." },
      2: { en: "Meet Zoro.", ar: "لقاء زورو." },
      3: { en: "Nami joins crew.", ar: "انضمام نامي." },
      4: { en: "Battle at Baratie.", ar: "معركة في باراتي." },
      5: { en: "Captain fights Mihawk.", ar: "الكابتن يقاتل ميهوك." }
    }
  },
  "Death Note": {
    main: {
      name: "Light Yagami",
      img: "images/light yagami.webp",
      bio: "High school genius who wields the Death Note."
    },
    episodes: {
      1: { en: "Light finds Death Note.", ar: "يجد لايت دفتر الموت." },
      2: { en: "Kira appears.", ar: "ظهور كيرا." },
      3: { en: "L starts investigation.", ar: "إل يبدأ التحقيق." },
      4: { en: "Light confronts L.", ar: "لايت يواجه إل." },
      5: { en: "Near joins case.", ar: "انضمام نير للقضية." }
    }
  },
  "Demon Slayer": {
    main: {
      name: "Tanjiro Kamado",
      img: "images/demon-slayer-paint-by-numbers.jpg",
      bio: "Determined demon slayer protecting his sister."
    },
    episodes: {
      1: { en: "Tanjiro's family attacked.", ar: "عائلة تانجيرو تتعرض لهجوم." },
      2: { en: "Tanjiro begins training.", ar: "تانجيرو يبدأ التدريب." },
      3: { en: "Meet Nezuko.", ar: "لقاء نيزيكو." },
      4: { en: "Fight with demons.", ar: "القتال مع الشياطين." },
      5: { en: "Hashira introduced.", ar: "تعريف الهاشيرا." }
    }
  },
  "Attack on Titan": {
    main: {
      name: "Eren Yeager",
      img: "images/Eren.webp",
      bio: "Vengeful warrior fighting Titans to save humanity."
    },
    episodes: {
      1: { en: "Wall breached by Titans.", ar: "اختراق الجدار من قبل العمالقة." },
      2: { en: "Eren joins Survey Corps.", ar: "إرين ينضم لفيلق الاستطلاع." },
      3: { en: "Battle inside Trost.", ar: "المعركة داخل تروست." },
      4: { en: "Eren transforms.", ar: "إرين يتحول." },
      5: { en: "Titans retreat.", ar: "انسحاب العمالقة." }
    }
  }
};

// LocalStorage keys
const CHARACTERS_KEY = 'animeCharacters';
const COMMENTS_KEY = 'episodeComments';

// Elements
const characterContainer = document.getElementById('character-container');
const episodesSection = document.getElementById('episodes-section');
const episodeList = document.getElementById('episode-list');
const toggleEpisodesBtn = document.getElementById('toggle-episodes-btn');
const addCharacterBtn = document.getElementById('add-character-btn');
const characterFormSection = document.getElementById('character-form-section');
const characterForm = document.getElementById('character-form');
const searchInput = document.getElementById('search-input');

// Load data from localStorage or use defaults for main characters
let characters = JSON.parse(localStorage.getItem(CHARACTERS_KEY)) || {};
// Initialize main characters if not exist
for (const anime in defaults) {
  if (!characters[anime]) {
    characters[anime] = [defaults[anime].main];
  }
}

// Comments stored by anime > episode number > array of comments
let comments = JSON.parse(localStorage.getItem(COMMENTS_KEY)) || {};

// Render functions

function saveCharacters() {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
}

function saveComments() {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

function createCharacterCard(character, anime) {
  const card = document.createElement('div');
  card.classList.add('character-card');

  const img = document.createElement('img');
  img.src = character.img;
  img.alt = character.name;
  img.onerror = () => { img.src = 'images/placeholder.png'; };

  const h3 = document.createElement('h3');
  h3.textContent = character.name;

  const pAnime = document.createElement('p');
  pAnime.style.fontWeight = 'bold';
  pAnime.textContent = `Anime: ${anime}`;

  const pBio = document.createElement('p');
  pBio.textContent = character.bio;

  const delBtn = document.createElement('button');
  delBtn.classList.add('delete-char');
  delBtn.innerHTML = '✖';
  delBtn.title = `Delete ${character.name}`;
  delBtn.addEventListener('click', () => {
    if (confirm(`Delete character ${character.name} from ${anime}?`)) {
      characters[anime] = characters[anime].filter(c => c.name !== character.name);
      if (characters[anime].length === 0) {
        // Remove anime key if empty
        delete characters[anime];
      }
      saveCharacters();
      renderCharacters();
    }
  });

  card.appendChild(img);
  card.appendChild(h3);
  card.appendChild(pAnime);
  card.appendChild(pBio);
  card.appendChild(delBtn);

  return card;
}

function renderCharacters(filter = '') {
  characterContainer.innerHTML = '';
  for (const anime in characters) {
    characters[anime].forEach(character => {
      if (character.name.toLowerCase().includes(filter.toLowerCase())) {
        const card = createCharacterCard(character, anime);
        characterContainer.appendChild(card);
      }
    });
  }
}

function createEpisodeElement(anime, epNum, summaries) {
  const epDiv = document.createElement('div');
  epDiv.classList.add('episode');

  const title = document.createElement('h3');
  title.textContent = `${anime} - Episode ${epNum}`;
  epDiv.appendChild(title);

  const summaryP = document.createElement('p');
  summaryP.textContent = summaries.en;
  summaryP.classList.add('episode-summary');
  epDiv.appendChild(summaryP);

  const toggleLangBtn = document.createElement('button');
  toggleLangBtn.textContent = 'Show Arabic';
  toggleLangBtn.classList.add('lang-toggle');
  toggleLangBtn.addEventListener('click', () => {
    if (summaryP.textContent === summaries.en) {
      summaryP.textContent = summaries.ar;
      toggleLangBtn.textContent = 'Show English';
    } else {
      summaryP.textContent = summaries.en;
      toggleLangBtn.textContent = 'Show Arabic';
    }
  });
  epDiv.appendChild(toggleLangBtn);

  // Comments section
  const commentSection = document.createElement('div');
  commentSection.classList.add('comment-section');

  // Existing comments container
  const commentsContainer = document.createElement('div');
  commentsContainer.classList.add('comments-container');

  const epKey = `${anime}-${epNum}`;
  if (!comments[epKey]) comments[epKey] = [];

  function renderComments() {
    commentsContainer.innerHTML = '';
    comments[epKey].forEach((commentText, idx) => {
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('comment');
      commentDiv.textContent = commentText;

      const delCommentBtn = document.createElement('button');
      delCommentBtn.classList.add('delete-comment');
      delCommentBtn.textContent = '✖';
      delCommentBtn.title = 'Delete comment';
      delCommentBtn.addEventListener('click', () => {
        comments[epKey].splice(idx, 1);
        saveComments();
        renderComments();
      });

      commentDiv.appendChild(delCommentBtn);
      commentsContainer.appendChild(commentDiv);
    });
  }
  renderComments();

  commentSection.appendChild(commentsContainer);

  // Comment form
  const commentForm = document.createElement('form');
  commentForm.classList.add('comment-form');

  const commentInput = document.createElement('input');
  commentInput.type = 'text';
  commentInput.placeholder = 'Add a comment...';
  commentInput.required = true;

  const commentSubmit = document.createElement('button');
  commentSubmit.type = 'submit';
  commentSubmit.textContent = 'Add';

  commentForm.appendChild(commentInput);
  commentForm.appendChild(commentSubmit);

  commentForm.addEventListener('submit', e => {
    e.preventDefault();
    comments[epKey].push(commentInput.value.trim());
    saveComments();
    commentInput.value = '';
    renderComments();
  });

  commentSection.appendChild(commentForm);

  epDiv.appendChild(commentSection);

  return epDiv;
}

function renderEpisodes() {
  episodeList.innerHTML = '';
  for (const anime in defaults) {
    const eps = defaults[anime].episodes;
    for (const epNum in eps) {
      const epEl = createEpisodeElement(anime, epNum, eps[epNum]);
      episodeList.appendChild(epEl);
    }
  }
}

// Event listeners

toggleEpisodesBtn.addEventListener('click', () => {
  if (episodesSection.style.display === 'none') {
    episodesSection.style.display = 'block';
    toggleEpisodesBtn.textContent = 'Hide Episode Conclusions';
    characterFormSection.style.display = 'none';
  } else {
    episodesSection.style.display = 'none';
    toggleEpisodesBtn.textContent = 'Show Episode Conclusions';
  }
});

addCharacterBtn.addEventListener('click', () => {
  if (characterFormSection.style.display === 'none') {
    characterFormSection.style.display = 'block';
    episodesSection.style.display = 'none';
    toggleEpisodesBtn.textContent = 'Show Episode Conclusions';
  } else {
    characterFormSection.style.display = 'none';
  }
});

characterForm.addEventListener('submit', e => {
  e.preventDefault();
  const anime = document.getElementById('anime-name').value;
  const name = document.getElementById('character-name').value.trim();
  const img = document.getElementById('image-link').value.trim();
  const bio = document.getElementById('character-bio').value.trim();

  if (!characters[anime]) characters[anime] = [];

  // Prevent duplicate character names within the same anime
  if (characters[anime].some(c => c.name.toLowerCase() === name.toLowerCase())) {
    alert('Character with this name already exists in this anime.');
    return;
  }

  const newChar = { name, img, bio };
  characters[anime].push(newChar);
  saveCharacters();
  renderCharacters();

  characterForm.reset();
  characterFormSection.style.display = 'none';
});

searchInput.addEventListener('input', e => {
  renderCharacters(e.target.value);
});

// Initial renders
renderCharacters();
renderEpisodes();
