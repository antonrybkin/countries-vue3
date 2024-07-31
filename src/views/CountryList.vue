<template>
  <div class="container">
    <h1>Страны</h1>
    <div class="controls">
      <input
        v-model="search"
        @input="applyFilters"
        placeholder="Поиск стран..."
        class="input"
      />
      <div class="filter">
        <label for="areaFilter">Площадь (минимум, км²):</label>
        <input
          type="number"
          id="areaFilter"
          v-model.number="minLandArea"
          @input="applyFilters"
          class="input"
          placeholder="0"
        />
      </div>
      <button @click="confirmDelete" class="button button--delete">
        Удалить
      </button>
    </div>
    <div v-if="countryStore.loading" class="loading">Загрузка...</div>
    <div @scroll="handleScroll" ref="scrollContainer" class="country-list">
      <draggable v-model="draggableCountries" @end="onDragEnd">
        <div
          v-for="country in draggableCountries"
          :key="country.id"
          class="country-list__card"
          @click="viewCountryDetails(country.id)"
        >
          <input
            type="checkbox"
            v-model="selectedCountries"
            :value="country.id"
            class="checkbox"
            @click.stop
          />
          <img
            :src="country.flag"
            :alt="country.name"
            class="country-list__flag"
          />
          <p class="country-list__name">
            {{ country.name }}
          </p>
        </div>
      </draggable>
    </div>

    <ModalComponent
      v-if="showModal"
      title="Вы действительно хотите удалить эти страны?"
      :selectedCountries="selectedCountries"
      :getCountryNameById="getCountryNameById"
      @deleteCountries="deleteCountries"
      @closeModal="() => (showModal = false)"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, toRaw, watch } from "vue";
import { useRouter } from "vue-router";
import { VueDraggableNext } from "vue-draggable-next";
import { useCountryStore } from "../store/countryStore";
import { getTransformedFlagUrl } from "../services/countryService";
import ModalComponent from "../components/ModalComponent.vue";

export default {
  components: {
    Draggable: VueDraggableNext,
    ModalComponent,
  },
  setup() {
    const countryStore = useCountryStore();
    const { fetchCountries, resetCountries, deleteSelectedCountries } =
      countryStore;

    const search = ref("");
    const page = ref(1);
    const limit = ref(10);
    const selectedCountries = ref([]);
    const showModal = ref(false);
    const minLandArea = ref(null);
    const router = useRouter();
    const scrollContainer = ref(null);
    const draggableCountries = ref([]);

    const filteredCountries = computed(() => {
      return toRaw(countryStore.countries)
        .filter((country) => {
          const matchesSearch = country.name
            .toLowerCase()
            .includes(search.value.toLowerCase());
          const matchesArea = country.land_area > minLandArea.value;
          return matchesSearch && matchesArea;
        })
        .map((country) => ({
          ...country,
          flag: getTransformedFlagUrl(country.flag),
        }));
    });

    watch(
      filteredCountries,
      (newCountries) => {
        draggableCountries.value = newCountries;
      },
      { immediate: true }
    );

    const fetchMore = async () => {
      page.value += 1;
      limit.value += 10;
      await fetchCountries(page.value, limit.value, search.value, "");
    };

    const handleScroll = () => {
      const container = scrollContainer.value;
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        fetchMore();
      }
    };

    const viewCountryDetails = (id) => {
      router.push(`/countries/${id}`);
    };

    const confirmDelete = () => {
      showModal.value = true;
    };

    const deleteCountries = () => {
      deleteSelectedCountries(selectedCountries.value);
      selectedCountries.value = [];
      showModal.value = false;
    };

    const getCountryNameById = (id) => {
      const country = countryStore.countries
        ? countryStore.countries.find((country) => country.id === id)
        : null;
      return country ? country.name : "";
    };

    const applyFilters = () => {
      page.value = 1;
      resetCountries();
      fetchCountries(page.value, limit.value, search.value, "");
    };

    const onDragEnd = (evt) => {
      const movedCountry = draggableCountries.value.splice(evt.oldIndex, 1)[0];
      draggableCountries.value.splice(evt.newIndex, 0, movedCountry);
    };

    onMounted(() => {
      setTimeout(() => {
        fetchCountries(page.value, limit.value, search.value, "");
      }, 0);
    });

    return {
      countryStore,
      search,
      selectedCountries,
      confirmDelete,
      deleteCountries,
      getCountryNameById,
      showModal,
      filteredCountries,
      applyFilters,
      minLandArea,
      onDragEnd,
      viewCountryDetails,
      handleScroll,
      scrollContainer,
      draggableCountries,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
}

.filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading {
  text-align: center;
  font-size: 1.5em;
}

.country-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  height: 90vh;

  &__card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 30px;
    margin: 30px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: background-color 0.3s;
    cursor: pointer;

    &:hover {
      background-color: #f8f9fa;
    }
  }

  &__name {
    margin: 0;
    flex-grow: 1;
  }

  &__flag {
    width: 100px;
    height: auto;
    border-radius: 3px;
    margin: 0 10px;
  }
}

.checkbox {
  cursor: pointer;
}
</style>
