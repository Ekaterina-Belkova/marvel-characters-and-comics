<template>
  <div class="characters-container">
    <h2>Marvel Characters</h2>
    <div class="input-container">
      <input
        type="text"
        v-model="searchQuery"
        @input="onInputChange"
        placeholder="Search characters"
        class="search-input"
      />
    </div>
    <div v-if="loading" class="loader"></div>
    <div v-else-if="characters.length === 0" class="no-results">
      No results found
    </div>

    <ul v-else class="character-list">
      <router-link
        v-for="character in characters"
        :key="character.id"
        :to="{ name: 'CharacterDetail', params: { id: character.id } }"
        class="comic-item-link"
      >
        <li class="character-item">
          <img
          :src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
          alt="Character Image"
          class="character-image"
          />
          <h3 class="character-name">
            {{ character.name }}
          </h3>
          <p class="character-description">
            {{ character.description || 'No description available.' }}
          </p>
        </li>
      </router-link>
    </ul>

    <!-- Пагинация -->
    <div class="pagination" v-if="!loading">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'

export default {
  name: 'CharacterList',
  data () {
    return {
      characters: [],
      loading: true,
      searchQuery: '',
      currentPage: 1,
      totalPages: 0,
      limit: 18 // Количество персонажей на странице
    }
  },
  created () {
    this.fetchCharacters()
  },
  methods: {
    onInputChange () {
      this.currentPage = 1 // сбрасываем на первую страницу при новом поиске
      this.loading = true // Показать лоадер при вводе текста в инпут
      this.fetchCharacters()
    },
    fetchCharacters () {
      this.loading = true // Показываем лоадер перед началом запроса
      const publicKey = '84e0bdd76764689eef178b5523ac50e6'
      const ts = new Date().getTime() // используем для генерации хеша. Переменная ts сохраняет значение времени в миллисекундах (для создания уникальной временной метки)
      const hash = md5(ts + 'd78e4b3a638026d18e28d6b68bbfa5abd99fb595' + publicKey)
      const searchQuery = this.searchQuery.trim() ? `&nameStartsWith=${this.searchQuery.trim()}` : ''
      const offset = (this.currentPage - 1) * this.limit // используем для расчета смещения (offset) при пагинации данных, то есть при разделении данных на страницы. (this.currentPage - 1) вычисляет, сколько страниц нужно пропустить, чтобы получить данные для текущей страницы. *this.limit: Умножение количества пропущенных страниц на количество элементов на странице дает общее количество элементов

      axios.get(`https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&offset=${offset}&limit=${this.limit}${searchQuery}`)
        .then(response => {
          this.characters = response.data.data.results
          this.totalPages = Math.ceil(response.data.data.total / this.limit)
          this.loading = false // Скрываем лоадер после получения данных
        })
        .catch(error => {
          console.error(error)
          this.loading = false // Скрываем лоадер даже при ошибке
        })
    },
    goToPage (page) {
      this.currentPage = page
      this.fetchCharacters()
    }
  }
}
</script>

<style scoped>
.characters-container {
  /* padding: 10px; */
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  width: 50%;
  padding: 10px;
  font-size: 1.2em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid;
  border-color: #ED1D24 transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  margin-top: 10vh;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-results {
  text-align: center;
  font-size: 1.5em;
  color: #ED1D24;
  margin-top: 20px;
}

.character-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.comic-item-link {
  text-decoration: none;
  color: inherit;
  flex: 1 1 calc(33.333% - 20px); /* 4 карточки в строку */
}

.character-item {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}

.character-item:hover {
  transform: translateY(-5px);
}

.character-image {
  width: 100%;
  height: 200px;
  object-fit: cover; /* Масштабирует изображение и обрезает его, чтобы заполнить контейнер */
}

.character-name {
  font-size: 1.5em;
  margin: 10px;
}

.character-description {
  font-size: 1em;
  margin: 10px;
}

@media (max-width: 768px) {
  .character-item {
    flex: 1 1 calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .character-item {
    flex: 1 1 100%;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px 0;
  gap: 5px;
}

.pagination button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 8px 12px;
  font-size: 14px;
  margin: 0 2px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.pagination button.active {
  background-color: #ed1d24;
  color: white;
  border-color: #ed1d24;
}

.pagination button:hover {
  background-color: #d8d8d8;
}

@media (min-width: 768px) {
  .pagination button {
    padding: 10px 15px;
    font-size: 16px;
    margin: 0 5px;
  }
}
</style>
