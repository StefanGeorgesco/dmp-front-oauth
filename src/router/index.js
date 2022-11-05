import { createRouter, createWebHistory } from "vue-router";
import { useAuthUserStore } from "../stores/authUserStore.js";

const HomeComponent = () => import("../components/HomeComponent.vue");
const MainComponent = () => import("../components/MainComponent.vue");
const SignUp = () => import("../components/SignUp.vue");
const PersonalData = () => import("../components/PersonalData.vue");
const AddFile = () => import("../components/AddFile.vue");
const ManageFiles = () => import("../components/ManageFiles.vue");
const PatientFile = () => import("../components/PatientFile.vue");

const authGuard = (roles) => {
  return () => {
    const store = useAuthUserStore();
    if (!store.isAuthenticated) {
      store.login();
    } else if (roles && !roles.includes(store.role)) {
      return { path: "/main" };
    } else {
      return true;
    }
  };
};

const redirectToMainIfLoggedIn = () => {
  const store = useAuthUserStore();
  if (store.isAuthenticated) {
    return { path: "/main" };
  } else {
    return true;
  }
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeComponent,
      beforeEnter: redirectToMainIfLoggedIn,
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: SignUp,
    },
    {
      path: "/main",
      name: "main",
      component: MainComponent,
      beforeEnter: authGuard(),
    },
    {
      path: "/personal-data",
      name: "personal-data",
      component: PersonalData,
      beforeEnter: authGuard(["DOCTOR", "PATIENT"]),
    },
    {
      path: "/add-doctor",
      name: "add-doctor",
      component: AddFile,
      props: { type: "doctor" },
      beforeEnter: authGuard(["ADMIN"]),
    },
    {
      path: "/add-patient-file",
      name: "add-patient-file",
      component: AddFile,
      props: { type: "patientFile" },
      beforeEnter: authGuard(["DOCTOR"]),
    },
    {
      path: "/manage-doctors",
      name: "manage-doctors",
      component: ManageFiles,
      props: { type: "doctor" },
      beforeEnter: authGuard(["ADMIN"]),
    },
    {
      path: "/manage-patient-files",
      name: "manage-patient-files",
      component: ManageFiles,
      props: { type: "patientFile" },
      beforeEnter: authGuard(["ADMIN", "DOCTOR"]),
    },
    {
      path: "/view-patient-file/:id",
      name: "view-patient-file",
      component: PatientFile,
      beforeEnter: authGuard(["DOCTOR"]),
    },
  ],
});

export default router;
