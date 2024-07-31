import { defineStore } from "pinia";
import axios from "axios";

const API_BASE_URL = "https://freetestapi.com/api/v1";

export const useCountryStore = defineStore("country", {
  state: () => ({
    countries: [],
    loading: false,
  }),
  actions: {
    async fetchCountries(page = 1, limit = 10, search = "", sort = "") {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/countries`, {
          params: { page, limit, search, sort },
        });
        this.countries = response.data;
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCountryById(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/countries/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching country by ID:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    resetCountries() {
      console.log('Resetting countries');
      this.countries = [];
    },
    deleteSelectedCountries(selectedIds) {
      this.loading = true;
      setTimeout(() => {
        this.countries = this.countries.filter(
          (country) => !selectedIds.includes(country.id)
        );
        this.loading = false;
      }, 2000);
    },
    async getCoordinatesByCountryName(name) {
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json`,
          {
            params: {
              q: name,
              key: 'ec1fde23be7f41e7bbcbf09a2d84769d',
            },
          }
        );
        const { lat, lng } = response.data.results[0].geometry;
        return { lat, lng };
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        throw error;
      }
    }
  },
});
