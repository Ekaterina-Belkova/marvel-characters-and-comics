<template>
  <button @click="goBack" class="back-button">
    &#8592;
  </button>
</template>

<script>
export default {
  name: 'GoBackButton',
  methods: {
    goBack () {
      this.$router.go(-1) // Возвращает на предыдущую страницу
    }
  }
}
</script>

<style scoped>
.back-button {
  position: sticky;
  top: 1rem;
  background-color: #ed1d24;
  border: none;
  color: white;
  font-size: 24px;
  width: 50px;
  height: 50px;
  margin-left: 10px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

.back-button:hover {
  background-color: #c71522;
  transform: scale(1.1);
}

.back-button:active {
  background-color: #a6141d;
}
</style>
