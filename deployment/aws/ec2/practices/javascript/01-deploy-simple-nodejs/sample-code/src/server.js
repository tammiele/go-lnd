import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("API is running"));

app.get("/health", (req, res) => res.send("Ok!"));

app.post("/hello", (req, res) =>
  res.status(200).json({
    data: `Hello, ${req?.body?.name || "Noname"}`,
  })
);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
