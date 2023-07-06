const express = require("express");
const cors = require('cors');

const app = express();
const PORT = 5000;

const postsRouter = require("./routes/posts.router");

app.use(cors());
app.use(express.json());
app.use("/api/v1/posts", postsRouter)


app.listen(PORT, () => {
    console.log(`SERVER: http://localhost:${PORT}`);
});
