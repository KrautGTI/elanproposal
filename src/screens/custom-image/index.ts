import createDeckScreen from "../../features/deck/createDeckScreen";

import CustomImage from "./CustomImage";

const screen = createDeckScreen(CustomImage, {
  id: "custom-image",
  title: "Custom", // Placeholder, will get replaced once screen is initialized
});

export default screen;
