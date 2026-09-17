import { createApp } from "vue"
import App from "@/App.vue"
import "@/assets/styles/main.css"

export function bootstrap() {
  createApp(App).mount("#app")
}
