<!-- eslint-disable prettier/prettier -->
<template>
    <div class="form-control position-relative d-flex flex-column m-0 p-0 ps-1">
        <div class="btn btn-sm btn-primary py-2 px-3 m-1" v-if="selectedOject">
            {{ objectRepFn(selectedOject) }}
        </div>
        <input @keyup.esc="clear" @blur="delayedClear" v-debounce:300ms="searchObjects" class="py-1 m-1"
            style="outline: none; border: none;" placeholder="Rechercher..." v-model="searchString" type="text"
            :disabled="disabled" v-show="!disabled">
        <div class="position-absolute top-100 start-0 end-0 mt-2 p-2 border rounded shadow bg-white overflow-auto"
            style="z-index: 1000; max-height: 50vh;" v-show="foundObjects.length > 0">
            <div class="tag-option" v-for="o in foundObjects" :key="o.id" @click="select(o)">
                {{ objectRepFn(o) }}
            </div>
        </div>
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
        disabled: Boolean,
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
.tag-option:hover {
    cursor: pointer;
    background-color: #eeeeee;
}
</style>