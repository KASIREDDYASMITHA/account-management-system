import bcrypt from "bcryptjs"
import supabase from "../config/supabaseClient.js"
import generateToken from "../utils/generateToken.js"

// Signup Controller
export const signup = async (req, res) => {

  const { name, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        email,
        password: hashedPassword
      }
    ])
    .select()

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  const token = generateToken(data[0].id)

  res.json({
    message: "User created successfully",
    token
  })
}


// Login Controller
export const login = async (req, res) => {

  const { email, password } = req.body

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error || !data) {
    return res.status(400).json({ message: "User not found" })
  }

  const isMatch = await bcrypt.compare(password, data.password)

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" })
  }

  const token = generateToken(data.id)

  res.json({
    message: "Login successful",
    token
  })
}