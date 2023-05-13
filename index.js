const app = require("./app");
const CONFIG = require("./src/config");

app.listen(CONFIG.PORT, () => {
  console.log(`server listening on port ${CONFIG.PORT}`);
});
