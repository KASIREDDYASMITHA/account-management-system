
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import supabase from "./config/supabaseClient.js"
import authRoutes from "./routes/authRoutes.js"
import authMiddleware from "./middlewares/authMiddleware.js"
import accountRoutes from "./routes/accountRoutes.js" 

dotenv.config()

const app = express()


app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/account", accountRoutes)

app.get("/api/test", authMiddleware, (req, res) => {

  res.json({
    message: "Protected route accessed",
    user: req.user
  })

})

app.get("/", (req, res) => {
  res.send("Account Management API Running")
})

const PORT = process.env.PORT || 5000

// Function to test database connection
const testDBConnection = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .limit(1)

  if (error) {
    console.log("Database connection failed")
    console.log(error.message)
  } else {
    console.log("DB connected successfully")
  }
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  await testDBConnection()
})