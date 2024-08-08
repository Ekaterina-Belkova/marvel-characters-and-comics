<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/characters">Characters</router-link> |
    <router-link to="/comics">Comics</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 20px;

  a {
    font-weight: bold;
    font-size: 1.5em;
    color: #2c3e50;
    text-decoration: none;
    margin-right: 15px;
    margin-left: 15px;

    &.router-link-exact-active {
      color: #ED1D24;
    }

    &:last-child {
      margin-right: 0; // Убирает отступ для последнего элемента
    }
  }
}
</style>
