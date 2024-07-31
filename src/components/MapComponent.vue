<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script>
import { onMounted, ref } from "vue";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

export default {
  props: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const mapContainer = ref(null);

    onMounted(() => {
      new Map({
        target: mapContainer.value,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([props.longitude, props.latitude]),
          zoom: 4,
        }),
      });
    });

    return {
      mapContainer,
    };
  },
};
</script>

<style>
.map {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}
</style>
