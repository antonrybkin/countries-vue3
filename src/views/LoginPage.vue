<template>
  <div class="login-page">
    <h1 class="login-page__title">Вход</h1>
    <form @submit.prevent="login" class="login-page__form">
      <div class="login-page__form-group">
        <input
          v-model="username"
          placeholder="Имя пользователя"
          required
          class="login-page__input"
        />
      </div>
      <div class="login-page__form-group">
        <input
          type="password"
          v-model="password"
          placeholder="Пароль"
          required
          class="login-page__input"
        />
      </div>
      <p v-if="errorMessage" class="login-page__error-message">
        {{ errorMessage }}
      </p>
      <button type="submit" class="login-page__button">Войти</button>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const username = ref("");
    const password = ref("");
    const errorMessage = ref("");

    function login() {
      if (username.value === "admin" && password.value === "password") {
        authStore.login({ username: username.value });
        router.push("/countries");
      } else {
        errorMessage.value =
          "Неверные данные! Подсказка: логин: admin, пароль: password";
      }
    }

    return { username, password, login, errorMessage };
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;

  &__title {
    margin-bottom: 20px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;

    &-group {
      margin-bottom: 15px;
    }
  }

  &__input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }

  &__button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }

  &__error-message {
    color: red;
    margin-top: 10px;
  }
}
</style>
