const dotenv = require("dotenv");
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

require("./db/mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const ApiRouter = require("./routes/Api");

app.use(compression());
app.use(cors());
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/api", ApiRouter);

app.use("/", express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "dist", "index.html"));
});

app.use((err, req, res, _next) => {
  return res.status(err.statusCode || 500).json({
    code: err.statusCode || 500,
    status: err.status || "error",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
