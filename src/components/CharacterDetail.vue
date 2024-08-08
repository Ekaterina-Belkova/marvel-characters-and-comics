<template>
  <GoBackButton />
  <div class="character-detail-container" v-if="character">
    <img
      :src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
      alt="Character Image"
      class="character-detail-image"
    />
    <h2>
      {{ character.name }}
    </h2>
    <p>
      {{ character.description || 'No description available.' }}
    </p>

    <h3>
      Comics with this character:
    </h3>
    <ul>
      <li v-for="comic in character.comics.items" :key="comic.resourceURI">
        <router-link :to="{ name: 'ComicDetail', params: { id: getComicId(comic.resourceURI) }}">
          {{ comic.name }}
        </router-link>
      </li>
    </ul>

    <!-- Ссылки на внешние ресурсы -->
      <h4>
        Get more information about this character:
      </h4>
      <div class="external-links" v-if="character.urls && character.urls.length">
      <ul>
        <li v-for="url in character.urls" :key="url.type">
          <a :href="url.url" target="_blank" rel="noopener noreferrer">
            {{ getLinkLabel(url.type) }}
          </a>
        </li>
      </ul>
    </div>
  </div>

  <div v-else class="loader">
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
import GoBackButton from '../components/ui/GoBackButton.vue'

export default {
  name: 'CharacterDetail',
  components: {
    GoBackButton
  },
  data () {
    return {
      character: null,
      loading: true
    }
  },
  created () {
    this.fetchCharacter()
  },
  methods: {
    fetchCharacter () {
      this.loading = true
      const publicKey = '84e0bdd76764689eef178b5523ac50e6'
      const ts = new Date().getTime()
      const hash = md5(ts + 'd78e4b3a638026d18e28d6b68bbfa5abd99fb595' + publicKey)

      axios.get(`https://gateway.marvel.com/v1/public/characters/${this.$route.params.id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
        .then(response => {
          this.character = response.data.data.results[0]
          this.loading = false
        })
        .catch(error => {
          console.error(error)
          this.loading = false
        })
    },
    getComicId (resourceURI) {
      return resourceURI.split('/').pop() // Извлечь ID комикса из resourceURI
    },
    getLinkLabel (type) {
      // Определение метки ссылки в зависимости от типа
      switch (type) {
        case 'wiki':
          return 'Wiki'
        case 'comiclink':
          return 'Comic Link'
        default:
          return 'More Info'
      }
    }
  }
}
</script>

<style scoped>
.character-detail-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .character-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    text-align: center;
  }
}

.character-detail-image {
  grid-area: 1 / 1 / 3 / 2;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

@media (max-width: 430px) {
  .character-detail-image {
    max-width: 150px;
  }
}

h2 {
  grid-area: 1 / 2 / 2 / 3;
  font-size: 2em;
  margin-bottom: 10px;
}

p {
  grid-area: 2 / 2 / 3 / 3;
  font-size: 1.2em;
  margin-bottom: 20px;
}

h3 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 10px;
  width: 100%;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  font-size: 1.2em;
  margin-bottom: 5px;
}

.external-links {
  margin-top: 20px;
}

h4 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

a {
  color: #ED1D24;
  text-decoration: none;
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
</style>
