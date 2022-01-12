if (process.env.NODE_ENV === "production") {
  module.exports = require("./make-store.prod");
} else {
  module.exports = require("./make-store.dev");
}
