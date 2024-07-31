<template>
  <div v-if="loading">Загрузка...</div>
  <div v-else-if="error">
    {{ error }}
  </div>
  <div v-else class="country-detail__container">
    <h1>{{ country.name }}</h1>
    <img
      :src="flagUrl"
      :alt="country.name"
      class="country-detail__container__flag"
    />
    <p>Столица: {{ country.capital }}</p>
    <p>Население: {{ country.population }}</p>
    <p>Площадь: {{ country.land_area }} км²</p>
    <MapComponent
      v-if="coordinates"
      :latitude="coordinates.lat"
      :longitude="coordinates.lng"
    />
    <button @click="goBack" class="country-detail__container__button">
      Назад к списку
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCountryStore } from "../store/countryStore";
import { getTransformedFlagUrl } from "../services/countryService";
import MapComponent from "../components/MapComponent.vue";

export default {
  components: {
    MapComponent,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const countryStore = useCountryStore();
    const { fetchCountryById, getCoordinatesByCountryName } = countryStore;
    const country = ref(null);
    const coordinates = ref({});
    const loading = ref(true);
    const error = ref(null);
    const flagUrl = ref("");

    const fetchCountryDetails = async () => {
      try {
        const countryId = route.params.id;
        const response = await fetchCountryById(countryId);
        country.value = response;
        flagUrl.value = getTransformedFlagUrl(response.flag, 250, 150);
        const coords = await getCoordinatesByCountryName(response.name);
        coordinates.value = coords;
      } catch (err) {
        error.value = "Ошибка загрузки страны или координат: " + err.message;
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push("/countries");
    };

    onMounted(() => {
      fetchCountryDetails();
    });

    return {
      country,
      coordinates,
      loading,
      error,
      goBack,
      flagUrl,
    };
  },
};
</script>

<style lang="scss">
.country-detail {
  &__container {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f8f9fa;
    max-width: 600px;
    margin: 20px auto;
    text-align: center;

    h1 {
      font-size: 2em;
    }

    &__flag {
      width: 250px;
      height: 150px;
      object-fit: cover;
    }

    p {
      margin: 5px 0;
    }

    &__button {
      padding: 10px 20px;
      background-color: #007bff;
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}

.map-container {
  width: 100%;
  height: 300px;
  margin-bottom: 1em;
}
</style>
