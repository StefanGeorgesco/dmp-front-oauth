<!-- eslint-disable prettier/prettier -->
<template>
    <div class="d-flex align-items-center form-control p-0 m-0" :class="{ 'error': hasError, 'noError': noError }">
        <div class="position-relative d-flex flex-wrap flex-fill m-0 p-0 ps-1">
            <div class="btn btn-sm btn-primary d-inline-flex align-items-center py-1 px-1 my-1 me-1" v-for="o in selectedOptions" :key="o.id">
                {{ o.id }} - {{ o.description }}
                <span class="btn btn-close btn-close-white ms-1" @click="remove(o)"></span>
            </div>
            <input @keyup.esc="clear" @blur="delayedClear" ref="input" v-model="searchString" type="text"
                class="flex-fill py-1 m-1" style="outline: none; border: none;" placeholder="Ajouter...">
            <div class="position-absolute top-100 start-0 mt-2 p-2 border rounded shadow bg-white overflow-auto"
                style="z-index: 1000; max-height: 50vh;" v-show="filteredOptions.length > 0">
                <div class="tag-option" v-for="o in filteredOptions" :key="o.id" @click="add(o)">
                    {{ o.id }} - {{ o.description }}
                </div>
            </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545"
            class="bi bi-exclamation-circle mx-2" v-show="hasError" viewBox="0 0 16 16">
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
export default {
    name: "TagSelector",
    emits: ["newSelection"],
    props: {
        options: {
            type: Array,
            required: true,
        },
        hasError: {
            type: Boolean,
            default: false,
        },
        noError: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            searchString: "",
            selectedOptions: [],
        };
    },
    computed: {
        filteredOptions() {
            return this.searchString === "" ? [] : this.options.filter(o =>
                o.description.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1
                && !this.selectedOptions.map(so => so.id).includes(o.id)
            );
        }
    },
    methods: {
        clear() {
            this.searchString = "";
        },
        delayedClear() {
            setTimeout(this.clear, 200);
        },
        add(o) {
            this.selectedOptions.push(o);
            this.searchString = "";
            this.$emit("newSelection", this.selectedOptions);
            this.$refs.input.focus();
        },
        remove(o) {
            this.selectedOptions = this.selectedOptions.filter(option => option.id !== o.id);
            this.$emit("newSelection", this.selectedOptions);
        }
    }
};
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
