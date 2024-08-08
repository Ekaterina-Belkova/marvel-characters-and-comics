<template>
  <div class="comics-container">
    <h2>Marvel Comics</h2>
    <div class="input-container">
      <input
        type="text"
        v-model="searchQuery"
        @input="onInputChange"
        placeholder="Search comics"
        class="search-input"
      />
    </div>
    <div v-if="loading" class="loader"></div>
    <div v-else-if="comics.length === 0" class="no-results">
      No results found
    </div>

    <ul v-else class="comics-list">
      <router-link
        v-for="comic in comics"
        :key="comic.id"
        :to="{ name: 'ComicDetail', params: { id: comic.id } }"
        class="comic-item-link"
      >
        <li class="comic-item">
          <img
            :src="`${comic.thumbnail.path}.${comic.thumbnail.extension}`"
            alt="Comic Image"
            class="comic-image"
          />
          <h3 class="comic-title">
            {{ comic.title }}
          </h3>
          <p class="comic-description">
            {{ comic.description || 'No description available.' }}
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
  name: 'ComicsList',
  data () {
    return {
      comics: [],
      loading: true,
      searchQuery: '',
      currentPage: 1,
      totalPages: 0,
      limit: 20 // Количество комиксов на странице
    }
  },
  created () {
    this.fetchComics()
  },
  methods: {
    onInputChange () {
      this.currentPage = 1 // Сбрасываем на первую страницу при новом поиске
      this.loading = true // Показать лоадер при вводе текста в инпут
      this.fetchComics()
    },
    fetchComics () {
      this.loading = true // Показываем лоадер перед началом запроса
      const publicKey = '84e0bdd76764689eef178b5523ac50e6'
      const ts = new Date().getTime() // Временная метка для генерации хеша
      const hash = md5(ts + 'd78e4b3a638026d18e28d6b68bbfa5abd99fb595' + publicKey)
      const searchQuery = this.searchQuery.trim() ? `&titleStartsWith=${this.searchQuery.trim()}` : ''
      const offset = (this.currentPage - 1) * this.limit // Смещение для пагинации

      axios.get(`https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&offset=${offset}&limit=${this.limit}${searchQuery}`)
        .then(response => {
          this.comics = response.data.data.results
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
      this.loading = true // Показываем лоадер при переходе на другую страницу
      this.fetchComics()
    }
  }
}
</script>

<style scoped>
.comics-container {
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

.comics-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.comic-item-link {
  text-decoration: none;
  color: inherit;
  flex: 1 1 calc(20% - 10px); /* 5 карточек в строку */
}

.comic-item {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
  padding: 10px;
  text-align: center;
}

.comic-item:hover {
  transform: translateY(-5px);
}

.comic-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}

.comic-title {
  font-size: 1em;
  margin: 10px 0 0;
  font-weight: bold;
}

@media (max-width: 768px) {
  .comic-item {
    flex: 1 1 calc(33.333% - 10px); /* 3 карточки в строку на планшетах */
  }
}

@media (max-width: 480px) {
  .comic-item {
    flex: 1 1 calc(50% - 10px); /* 2 карточки в строку на мобильных */
  }
}

.pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 10px 0;
  gap: 2px;
}

.pagination button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 4px 6px;
  font-size: 7px;
  margin: 0 2px;
  cursor: pointer;
  border-radius: 3px;
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
