<template>
  <GoBackButton />
  <div class="comic-detail-container" v-if="comic">
    <img
      :src="`${comic.thumbnail.path}.${comic.thumbnail.extension}`"
      alt="Comic Image"
      class="comic-detail-image"
    />
    <h2>
      {{ comic.title }}
    </h2>
    <p>
      {{ comic.description || 'No description available.' }}
    </p>

    <h3>
      Characters in this comic:
    </h3>
    <ul>
      <li v-for="character in comic.characters.items" :key="character.resourceURI">
        <router-link :to="{ name: 'CharacterDetail', params: { id: getCharacterId(character.resourceURI) }}">
          {{ character.name }}
        </router-link>
      </li>
    </ul>
  </div>

  <div v-else class="loader">
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
import GoBackButton from '../components/ui/GoBackButton.vue'

export default {
  name: 'ComicDetail',
  components: {
    GoBackButton
  },
  data () {
    return {
      comic: null,
      loading: true
    }
  },
  created () {
    this.fetchComic()
  },
  methods: {
    fetchComic () {
      this.loading = true
      const publicKey = '84e0bdd76764689eef178b5523ac50e6'
      const ts = new Date().getTime()
      const hash = md5(ts + 'd78e4b3a638026d18e28d6b68bbfa5abd99fb595' + publicKey)

      axios.get(`https://gateway.marvel.com/v1/public/comics/${this.$route.params.id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
        .then(response => {
          this.comic = response.data.data.results[0]
          this.loading = false
        })
        .catch(error => {
          console.error(error)
          this.loading = false
        })
    },
    getCharacterId (resourceURI) {
      return resourceURI.split('/').pop() // Извлечь ID персонажа из resourceURI
    }
  }
}
</script>

<style scoped>
.comic-detail-container {
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
  .comic-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    text-align: center;
  }
}

.comic-detail-image {
  grid-area: 1 / 1 / 3 / 2;
  max-width: 300px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

@media (max-width: 430px) {
  .comic-detail-image {
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
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  font-size: 1.2em;
  margin-bottom: 5px;
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
