<!-- eslint-disable prettier/prettier -->
<template>
  <div v-if="readOnly">
    <div class="form-control-plaintext">{{ objectRepFn(selectedOject) }}</div>
  </div>
  <div v-else class="d-flex align-items-center form-control p-0 m-0" :class="{ 'error': hasError, 'noError': noError }">
    <div class="position-relative flex-fill d-flex flex-column p-1">
      <div class="btn btn-sm py-2 px-3 m-1" :class="{ 'btn-primary': !disabled, 'btn-light': disabled }"
        v-if="selectedOject" :disabled="disabled">
        {{ objectRepFn(selectedOject) }}
      </div>
      <input @keyup.esc="clear" @blur="delayedClear" v-debounce:300ms="searchObjects" class="col-12 py-1 m-1 me-2"
        style="outline: none; border: none;" placeholder="Rechercher..." v-model="searchString" type="text"
        :disabled="disabled" v-show="!disabled" autofocus>
      <div class="position-absolute top-100 start-0 end-0 mt-2 p-2 border rounded shadow bg-white overflow-auto"
        style="z-index: 1000; max-height: 50vh;" v-show="foundObjects.length > 0">
        <div class="tag-option" v-for="o in foundObjects" :key="o.id" @click="select(o)">
          {{ objectRepFn(o) }}
        </div>
      </div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" class="bi bi-exclamation-circle mx-2"
      v-show="hasError" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path
        d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#198754" class="bi bi-check flex-shrink-0"
      v-show="noError" viewBox="0 0 16 16">
      <path
        d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
    </svg>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapActions } from "pinia";
import { useMessagesStore } from "../stores/messagesStore.js";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import { vue3Debounce } from 'vue-debounce';

export default {
  name: "ObjectFinder",
  emits: ["newSelection"],
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  props: {
    objectType: {
      type: String,
      required: true,
    },
    objectValue: Object,
    objectRepFn: {
      type: Function,
      default(o) {
        return o.toString();
      },
    },
    objectFilterFn: {
      type: Function,
      default() {
        return true;
      },
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    noError: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchString: "",
      selectedOject: this.objectValue ? { ...this.objectValue } : null,
      foundObjects: [],
    };
  },
  watch: {
    objectValue: {
      handler() {
        this.clear();
        this.selectedOject = this.objectValue ? { ...this.objectValue } : null;
      },
      deep: true,
    },
  },
  methods: {
    async searchObjects() {
      let id = this.setLoader();
      try {
        let response = await Service.findObjectBySearchString(this.objectType, this.searchString);
        this.foundObjects = response.data.filter(this.objectFilterFn);
      } catch (error) {
        if (error.response.data?.message) {
          this.setErrorMessage(error.response.data.message);
        }
      } finally {
        this.clearLoader(id);
      }
    },
    clear() {
      this.foundObjects = [];
      this.searchString = "";
    },
    delayedClear() {
      setTimeout(this.clear, 200);
    },
    select(o) {
      this.clear();
      this.selectedOject = o;
      this.$emit("newSelection", o);
    },
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.error {
  border-color: #dc3545;
}

.noError {
  border-color: #198754;
}

.tag-option:hover {
  cursor: pointer;
  background-color: #eeeeee;
}
</style>