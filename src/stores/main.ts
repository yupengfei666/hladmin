import { defineStore } from "pinia"

export const mainStore = defineStore({
  id: "main",
  state: () => ({
    pageSize: 10,
  }),
  getters: {},
  actions: {},
})
