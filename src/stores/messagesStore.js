import { defineStore } from "pinia";

export const useMessagesStore = defineStore({
  id: "messages",
  state: () => ({
    messages: [],
    id: 0,
  }),
  actions: {
    incrementId() {
      this.id++;
    },
    addErrorMessage(message) {
      let id = this.id;
      this.messages.push({
        id,
        type: "danger",
        text: message,
      });
      setTimeout(() => {
        this.deleteMessage(id);
      }, 3000);
      this.incrementId();
    },
    addSuccessMessage(message) {
      let id = this.id;
      this.messages.push({
        id,
        type: "success",
        text: message,
      });
      setTimeout(() => {
        this.deleteMessage(id);
      }, 3000);
      this.incrementId();
    },
    addInfoMessage(message) {
      let id = this.id;
      this.messages.push({
        id,
        type: "info",
        text: message,
      });
      setTimeout(() => {
        this.deleteMessage(id);
      }, 3000);
      this.incrementId();
    },
    deleteMessage(id) {
      let i = this.messages.map((m) => m.id).indexOf(id);
      if (i > -1) this.messages.splice(i, 1);
    },
  },
});
