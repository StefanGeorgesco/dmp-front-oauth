import axios from "axios";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

axios.interceptors.request.use((request) => {
  const authStore = useAuthUserStore();
  if (authStore.token) {
    request.headers.common.Authorization = "bearer " + authStore.token;
  }
  if (["post", "put"].includes(request.method)) {
    request.headers["Content-Type"] = "application/json";
  }
  request.headers["X-Requested-With"] = "XMLHttpRequest";

  return request;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const msgStore = useMessagesStore();
    let status = error.response.status;

    if (status >= 500) {
      msgStore.addErrorMessage(
        "Impossible de se connecter au serveur. Veuillez réessayer ultérieurement."
      );
      return Promise.reject(null);
    }

    if (status === 401) {
      msgStore.addErrorMessage("Non autorisé.");
      return Promise.reject(null);
    }

    if (status === 406) {
      msgStore.addErrorMessage(Object.values(error.response.data).join(", "));
      return Promise.reject(null);
    }

    return Promise.reject(error);
  }
);

export class Service {
  static signUp(user) {
    return axios.post(`${apiBaseUrl}/user`, user);
  }

  static addPatientFile(patientFile) {
    return axios.post(`${apiBaseUrl}/patient-file`, patientFile);
  }

  static addDoctor(doctor) {
    return axios.post(`${apiBaseUrl}/doctor`, doctor);
  }

  static getSpecialties() {
    return axios.get(`${apiBaseUrl}/specialty`);
  }

  static getDoctorDetails() {
    return axios.get(`${apiBaseUrl}/doctor/details`);
  }

  static getPatientFileDetails() {
    return axios.get(`${apiBaseUrl}/patient-file/details`);
  }

  static updateDoctorDetails(doctor) {
    return axios.put(`${apiBaseUrl}/doctor/details`, doctor);
  }

  static updatePatientFileDetails(patientFile) {
    return axios.put(`${apiBaseUrl}/patient-file/details`, patientFile);
  }

  static findDoctorsByIdOrFirstnameOrLastname(q) {
    let uri = encodeURI(`${apiBaseUrl}/doctor?q=${q}`);
    return axios.get(uri);
  }

  static findPatientFilesByIdOrFirstnameOrLastname(q) {
    let uri = encodeURI(`${apiBaseUrl}/patient-file?q=${q}`);
    return axios.get(uri);
  }

  static findObjectBySearchString(objectType, q) {
    let uri = encodeURI(`${apiBaseUrl}/${objectType}?q=${q}`);
    return axios.get(uri);
  }

  static getDoctor(id) {
    let uri = encodeURI(`${apiBaseUrl}/doctor/${id}`);
    return axios.get(uri);
  }

  static deleteDoctor(id) {
    let uri = encodeURI(`${apiBaseUrl}/doctor/${id}`);
    return axios.delete(uri);
  }

  static deletePatientFile(id) {
    let uri = encodeURI(`${apiBaseUrl}/patient-file/${id}`);
    return axios.delete(uri);
  }

  static getPatientFile(id) {
    let uri;
    if (id) {
      uri = encodeURI(`${apiBaseUrl}/patient-file/${id}`);
    } else {
      uri = encodeURI(`${apiBaseUrl}/patient-file/details`);
    }
    return axios.get(uri);
  }

  static getCorrespondences(patientFileId) {
    let uri;
    if (patientFileId) {
      uri = encodeURI(
        `${apiBaseUrl}/patient-file/${patientFileId}/correspondence`
      );
    } else {
      uri = encodeURI(`${apiBaseUrl}/patient-file/details/correspondence`);
    }
    return axios.get(uri);
  }

  static getItems(patientFileId) {
    let uri;
    if (patientFileId) {
      uri = encodeURI(`${apiBaseUrl}/patient-file/${patientFileId}/item`);
    } else {
      uri = encodeURI(`${apiBaseUrl}/patient-file/details/item`);
    }
    return axios.get(uri);
  }

  static addCorrespondence(correspondence) {
    let uri = encodeURI(
      `${apiBaseUrl}/patient-file/${correspondence.patientFileId}/correspondence`
    );
    return axios.post(uri, correspondence);
  }

  static deleteCorrespondence(correspondence) {
    let uri = encodeURI(
      `${apiBaseUrl}/patient-file/${correspondence.patientFileId}/correspondence/${correspondence.id}`
    );
    return axios.delete(uri);
  }

  static addItem(item) {
    let uri = encodeURI(
      `${apiBaseUrl}/patient-file/${item.patientFileId}/item`
    );
    return axios.post(uri, item);
  }

  static updateItem(item) {
    let uri = encodeURI(
      `${apiBaseUrl}/patient-file/${item.patientFileId}/item/${item.id}`
    );
    return axios.put(uri, item);
  }

  static deleteItem(item) {
    let uri = encodeURI(
      `${apiBaseUrl}/patient-file/${item.patientFileId}/item/${item.id}`
    );
    return axios.delete(uri, item);
  }

  static updateReferringDoctor(patientFileId, referringDoctor) {
    let uri = encodeURI(
      `${apiBaseUrl}/patient-file/${patientFileId}/referring-doctor`
    );
    return axios.put(uri, referringDoctor);
  }
}
