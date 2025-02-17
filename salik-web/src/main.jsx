import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import MainLayout from "./layout/MainLayout";
import { store } from "../src/redux/store";
import "./styles/App.css";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <MainLayout />
  </Provider>
);
