import { createRouter, createWebHistory } from "vue-router";
import { useAuthUserStore } from "../stores/authUserStore.js";

const HomeComponent = () => import("../components/HomeComponent.vue");
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
    }
    if (roles && !roles.includes(store.role)) {
      return { path: "/" };
    } else {
      return true;
    }
  };
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeComponent,
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: SignUp,
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

router.beforeEach(async (to, from, next) => {
  const store = useAuthUserStore();
  if (to.name !== "sign-up" && !store.isAuthenticated) {
    await store.login();
    next({ name: to.name });
  } else {
    next();
  }
});

export default router;
