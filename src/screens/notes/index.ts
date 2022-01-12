import createDeckScreen from "../../features/deck/createDeckScreen";
import Notes from "./Notes";

const screen = createDeckScreen(Notes, {
  id: "notes",
  title: "Notes",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
});

export default screen;
