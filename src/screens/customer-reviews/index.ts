import createDeckScreen from "../../features/deck/createDeckScreen";
import CustomerReviews from "./CustomerReviews";

const screen = createDeckScreen(CustomerReviews, {
  id: "customer-reviews",
  title: "Customer Reviews",
});

export default screen;
