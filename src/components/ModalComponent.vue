<template>
  <div class="modal">
    <div class="modal__content">
      <b>{{ title }}</b>
      <ul>
        <li v-for="id in selectedCountries" :key="id">
          {{ getCountryNameById(id) }}
        </li>
      </ul>
      <div class="modal__buttons">
        <button @click="deleteCountries" class="button button--delete">
          Да
        </button>
        <button @click="closeModal" class="button">Нет</button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    selectedCountries: {
      type: Array,
      required: true,
    },
    getCountryNameById: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  emits: ["deleteCountries", "closeModal"],
  setup(props, { emit }) {
    const deleteCountries = () => {
      emit("deleteCountries");
    };

    const closeModal = () => {
      emit("closeModal");
    };

    return {
      deleteCountries,
      closeModal,
    };
  },
});
</script>

<style lang="scss">
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);

  &__content {
    background-color: #fefefe;
    padding: 20px;
    border: 1px solid #888;
    border-radius: 5px;
    width: 300px;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &--delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
}
</style>
