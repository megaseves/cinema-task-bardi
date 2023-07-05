const express = require("express");

const app = express();
const PORT = 5000;

const postsRouter = require("./routes/posts.router");

app.use(express.json());
app.use("/api/v1/posts", postsRouter)

app.listen(PORT, () => {
    console.log(`SERVER: http://localhost:${PORT}`);
});
