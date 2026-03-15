import { useState, useContext } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const { login } = useContext(AuthContext)

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      })

      login(res.data.token)

      navigate("/dashboard")

    } catch (error) {

      alert(error.response?.data?.message || "Login failed")

    }

  }

  return (

//    <div className="container">
    <div className="card">

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>

      </form>

    </div>

  )

}

export default Login