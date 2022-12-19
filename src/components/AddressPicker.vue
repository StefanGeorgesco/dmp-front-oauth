<!-- eslint-disable prettier/prettier -->

<template>
    <div class="position-relative">
        <input class="form-control" type="text" v-model="searchString" @keyup.esc="clear" @blur="delayedClear"
            v-debounce:500ms="findAddresses" placeholder="Recherche...">
        <div class="position-absolute top-100 start-0 mt-2 p-2 border rounded shadow bg-white" style="z-index: 1000;"
            v-show="foundAddresses.length > 0">
            <div class="option-item" v-for="address in foundAddresses" :key="address.properties.id"
                @click="select(address)">
                {{ address.properties.label }}
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { vue3Debounce } from 'vue-debounce';

const baseUrl = "https://api-adresse.data.gouv.fr/search";

export default {
    name: "AddressPicker",
    props: {
        errorMessageService: {
            type: Function,
            default(m) {
                console.error(m);
            },
        },
        setLoaderService: {
            type: Function,
            default() {
            },
        },
        clearLoaderService: {
            type: Function,
            defaut() {
            }
        }
    },
    emits: ["newSelection"],
    directives: {
        debounce: vue3Debounce({ lock: true }),
    },
    data() {
        return {
            longitude: "2.349",     // Notre-Dame de Paris
            latitude: "48.854499",  //
            searchString: "",
            foundAddresses: [],
        }
    },
    created() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.longitude = position.coords.longitude;
                this.latitude = position.coords.latitude;
            }, () => console.error("Client geolocation failed"), { enableHighAccuracy: true });
        }
    },
    methods: {
        clear() {
            this.searchString = "";
            this.foundAddresses = [];
        },
        delayedClear() {
            setTimeout(this.clear, 200);
        },
        findAddresses() {
            if (this.searchString.trim()) {
                if (this.searchString.trim().length > 2) {
                    let url = encodeURI(`${baseUrl}?type=housenumber&lon=${this.longitude}&lat=${this.latitude}&limit=15&q=${this.searchString}`);
                    let id = this.setLoaderService();
                    fetch(url)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                return Promise.reject(`erreur ${response.status}${response.statusText ? ": " + response.statusText : ""}`);
                            }
                        })
                        .then(data => {
                            this.foundAddresses = data.features;
                        })
                        .catch(error => {
                            this.errorMessageService(`Le service d'adresse est injoignable (${error}).`);
                        })
                        .finally(
                            () => { this.clearLoaderService(id); }
                        );
                }
            } else {
                this.clear();
            }
        },
        select(a) {
            this.clear();
            this.$emit("newSelection", {
                street1: a.properties.name,
                street2: "",
                city: a.properties.city,
                state: a.properties.context,
                zipcode: a.properties.postcode,
                country: "France",
            });
        },
    },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.option-item:hover {
    cursor: pointer;
    background-color: #eeeeee;
}
</style>