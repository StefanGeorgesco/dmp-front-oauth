<!-- eslint-disable prettier/prettier -->
<template>
    <div class="p-2 col-md-12" style="min-height: 20rem;">
        <div class="card h-100 shadow-sm">
            <div class="card-header">
                <div class="d-inline-flex align-items-center w-100">
                    <img :src="imgurl" alt="" height="20" width="20" />
                    <h6 class="m-0 ms-2">{{ types.filter((t) => t.value === item['@type'])[0]?.name }}</h6>
                    <a role="button" data-bs-toggle="modal" :data-bs-target="'#deleteModal-' + item.id" class="ms-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red"
                            class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path
                                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                        </svg>
                    </a>
                </div>
            </div>
            <div class="card-body">
                <div ref="item" :class="{ highlighted: item.editing }" style="padding: 0 1rem;">
                    <form @submit.prevent="submitSaveItem" @input="checkForm" class="row g-3 needs-validation"
                        novalidate>
                        <div class="col-md-5">
                            <div class="mb-3 row">
                                <label for="item_type" class="col-sm-4 col-form-label">
                                    <span v-show="item.editing && !item.id">* </span>Type
                                </label>
                                <div class="col-sm-6">
                                    <select @change="checkForm" v-model="item['@type']" :disabled="item.id"
                                        id="item_type" class="form-control">
                                        <option v-for="t in types" :key="t.value" :value="t.value" v-text="t.name"
                                            :disabled="!t.value">
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="error" :class="{ fieldError: typeError }">
                                Le type est obligatoire.
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="mb-3 row">
                                <label for="item_date" class="col-sm-3 col-form-label"><span
                                        v-show="item.editing && !item.id">*
                                    </span>Date</label>
                                <div class="col-sm-7">
                                    <input @change="($event) => $event.target.blur()" v-model="item.date" type="date"
                                        class="form-control" id="item_date" :readonly="item.id" />
                                </div>
                            </div>
                            <div class="error" :class="{ fieldError: datePresentError }">
                                La date est obligatoire.
                            </div>
                            <div class="error" :class="{ fieldError: datePastOrPresentError }">
                                La date ne peut pas être dans le futur.
                            </div>
                        </div>
                        <template v-if="item.id">
                            <i class="author">
                                Créé par {{ item.authoringDoctorFirstname }}
                                {{ item.authoringDoctorLastname }}
                                ({{ item.authoringDoctorId }})
                                - Spécialité{{ item.authoringDoctorSpecialties.length > 1 ? "s" : "" }} :
                                {{ item.authoringDoctorSpecialties.join(", ") }}
                            </i>
                        </template>
                        <div class="col-md-12">
                            <label for="item_comments" class="form-label">Commentaires</label>
                            <textarea v-model.trim="item.comments" id="item_comments" class="form-control"
                                :readonly="!item.editing"></textarea>
                        </div>
                        <template v-if="item['@type'] === 'act'">
                            <label class="form-label"><span v-show="item.editing">* </span>Acte dispensé</label>
                            <ObjectFinder object-type="medical-act" :object-value="item.medicalAct"
                                :object-rep-fn="(o) => `${o.id} - ${o.description}`" :object-filter-fn="(o) => true"
                                :disabled="!item.editing" @new-selection="selectMedicalAct" />
                            <div class="error" :class="{ fieldError: medicalActError }">
                                L'acte médical dispensé est obligatoire.
                            </div>
                        </template>
                        <template v-if="item['@type'] === 'diagnosis'">
                            <label class="form-label"><span v-show="item.editing">* </span>Maladie diagnostiquée</label>
                            <ObjectFinder object-type="disease" :object-value="item.disease"
                                :object-rep-fn="(o) => `${o.id} - ${o.description}`" :object-filter-fn="(o) => true"
                                :disabled="!item.editing" @new-selection="selectDisease" />
                            <div class="error" :class="{ fieldError: diseaseError }">
                                La maladie diagnostiquée est obligatoire.
                            </div>
                        </template>
                        <template v-if="item['@type'] === 'mail'">
                            <label class="form-label"><span v-show="item.editing">* </span>Destinataire</label>
                            <ObjectFinder object-type="doctor" :object-value="item.recipientDoctorId ? {
    id: item.recipientDoctorId,
    firstname: item.recipientDoctorFirstname,
    lastname: item.recipientDoctorLastname,
    specialties: item.recipientDoctorSpecialties,
} : null" :objectRepFn="(o) => `${o.firstname} ${o.lastname} (${o.id}) - ${o.specialties.map(s => s.description ? s.description : s).join(', ')}`"
                                :objectFilterFn="(o) => o.id !== userId" :disabled="!item.editing"
                                @new-selection="selectRecipientDoctor" />
                            <div class="error" :class="{ fieldError: recipientDoctorIdError }">
                                Le médecin destinataire est obligatoire.
                            </div>
                            <div class="col-md-12">
                                <label for="mail_text" class="form-label"><span v-show="item.editing">*
                                    </span>Texte</label>
                                <textarea v-model.trim="item.text" id="mail_text" class="form-control"
                                    :readonly="!item.editing"></textarea>
                                <div class="error" :class="{ fieldError: textError }">
                                    Le texte du courrier est obligatoire.
                                </div>
                            </div>
                        </template>
                        <template v-if="item['@type'] === 'prescription' || item['@type'] === 'symptom'">
                            <label for="description" class="form-label"><span v-show="item.editing">*
                                </span>Description</label>
                            <textarea v-model.trim="item.description" id="description" class="form-control"
                                :readonly="!item.editing"></textarea>
                            <div class="error" :class="{ fieldError: descriptionError }">
                                La description
                                <span v-if="item['@type'] === 'prescription'">de la prescription</span>
                                <span v-else-if="item['@type'] === 'symptom'">du symptôme</span>
                                est obligatoire.
                            </div>
                        </template>
                        <div class="col-12">
                            <button v-show="item.editing" class="btn btn-primary" type="submit">
                                <i class="fa-solid fa-floppy-disk"></i> {{ item.id ? "Enregistrer" : "Créer" }}
                            </button>
                        </div>
                    </form>
                    <template v-if="!globalEditing && !item.editing && isAuthor">
                        <button type="button" class="btn btn-primary" @click="startEditing">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal"
                            :data-bs-target="'#deleteModal-' + item.id">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </template>
                    <template v-if="item.editing">
                        <br>
                        <button type="button" class="btn btn-light" @click="cancelEditing">
                            <i class="fa-solid fa-xmark"></i> Annuler
                        </button>
                        <br><br>
                    </template>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" :id="'deleteModal-' + item.id" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Suppression</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        ref="modalClose"></button>
                </div>
                <div class="modal-body">
                    <p>
                        Confirmez-vous la suppression de l'élément
                        {{ item["@type"] }} du {{ new Date(item.date).toLocaleDateString() }} ?
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button @click="submitDeleteItem" type="button" class="btn btn-primary"
                        ref="confirm">Confirmer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { nextTick } from 'vue';
import { mapActions, mapState } from "pinia";
import { useMessagesStore } from "../stores/messagesStore.js";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import ObjectFinder from "./ObjectFinder.vue";

export default {
    name: "ItemComponent",
    props: {
        itemValue: {
            type: Object,
            required: true,
        },
        globalEditing: {
            type: Boolean,
            required: true,
        },
        types: {
            type: Array,
            required: true,
        }
    },
    emits: ["editingStart", "editingCanceled", "editingEnd"],
    components: {
        ObjectFinder,
    },
    data() {
        return {
            item: { ...this.itemValue },
            mustCheck: false,
            typeError: false,
            datePresentError: false,
            datePastOrPresentError: false,
            medicalActError: false,
            diseaseError: false,
            recipientDoctorIdError: false,
            textError: false,
            descriptionError: false,
        };
    },
    mounted() {
        if (!this.itemValue.id) this.$refs.item.scrollIntoView();
    },
    computed: {
        imgurl() {
            return this.types.filter((t) => t.value === this.item['@type'])[0]?.imgurl;
        },
        isAuthor() {
            return this.item.authoringDoctorId === this.userId;
        },
        ...mapState(useAuthUserStore, ["userId"]),
    },
    watch: {
        itemValue() {
            this.resetItem();
        },
    },
    methods: {
        resetItem() {
            this.item = { ...this.itemValue };
            this.checkForm();
            this.mustCheck = false;
        },
        startEditing() {
            this.item.editing = true;
            this.$emit('editingStart');
        },
        cancelEditing() {
            this.item.editing = false;
            this.$emit('editingCanceled');
        },
        selectMedicalAct(selection) {
            this.item.medicalAct = selection;
            this.checkForm();
        },
        selectDisease(selection) {
            this.item.disease = selection;
            this.checkForm();
        },
        selectRecipientDoctor(selection) {
            this.item.recipientDoctorId = selection?.id;
            this.item.recipientDoctorFirstname = selection?.firstname;
            this.item.recipientDoctorLastname = selection?.lastname;
            this.item.recipientDoctorSpecialties = selection?.specialties.map((s) => s.description);
            this.checkForm();
        },
        checkForm() {
            if (this.mustCheck) {
                this.typeError = !this.item["@type"];
                this.datePresentError = !this.item.date;
                this.datePastOrPresentError = this.item.date && new Date(this.item.date) > new Date();
                this.medicalActError = this.item["@type"] === "act" && !this.item.medicalAct?.id;
                this.diseaseError = this.item["@type"] === "diagnosis" && !this.item.disease?.id;
                this.recipientDoctorIdError = this.item["@type"] === "mail" && !this.item.recipientDoctorId;
                this.textError = this.item["@type"] === "mail" && !this.item.text;
                this.descriptionError = ["prescription", "symptom"].includes(this.item["@type"]) && !this.item.description;
            }

            return (
                !this.typeError &&
                !this.datePresentError &&
                !this.datePastOrPresentError &&
                !this.medicalActError &&
                !this.diseaseError &&
                !this.recipientDoctorIdError &&
                !this.textError &&
                !this.descriptionError);
        },
        async submitSaveItem() {
            this.mustCheck = true;

            if (this.checkForm()) {
                let service;
                let action;

                if (this.item.id) {
                    service = Service.updateItem;
                    action = "modifié";
                } else {
                    service = Service.addItem;
                    action = "créé"
                }

                let id = this.setLoader();

                try {
                    await service(this.item);
                    this.item.editing = false;
                    this.$emit("editingEnd");
                    this.setSuccessMessage(`L'élément a bien été ${action}.`);
                } catch (error) {
                    if (error.response.data?.message) {
                        this.setErrorMessage(error.response.data.message);
                    }
                } finally {
                    this.clearLoader(id);
                }
            } else {
                this.setErrorMessage("Les données saisies sont incorrectes.");
                nextTick(() => { document.querySelector(".fieldError")?.scrollIntoView(false); });
            }
        },
        async submitDeleteItem() {
            this.$refs.modalClose.click();
            let id = this.setLoader();
            try {
                await Service.deleteItem(this.item);
                this.item.editing = false;
                this.$emit("editingEnd");
                this.setSuccessMessage(`L'élément a bien été supprimé.`);
            } catch (error) {
                if (error.response.data?.message) {
                    this.setErrorMessage(error.response.data.message);
                }
            } finally {
                this.clearLoader(id);
            }

        },
        ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
        ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
    },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>