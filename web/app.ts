import { mount } from "svelte";
import App from "./components/App.svelte";

const target = document.getElementById("app");
if (target) {
  mount(App, { target });
}
