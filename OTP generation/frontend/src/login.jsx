import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const handleLogin = async (e) => {
        e.preventDefault()
        const response = await axios.post("http://localhost:5000/otp/send-otp", { email })
        alert(response.data.message)
        navigate('otp')
    }
    return (
        <div class="container">
            <div class="screen">
                <div class="screen__content">
                    <form class="login">
                        <div class="login__field">
                            <label htmlFor="">Email</label>
                            <input type="text" class="login__input" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
                        </div>
                        <button class="button login__submit" onClick={handleLogin}>
                            <span class="button__text">Log In Now</span>
                            <i class="button__icon fas fa-chevron-right"></i>
                        </button>
                    </form>

                </div>
                <div class="screen__background">
                    <span class="screen__background__shape screen__background__shape4"></span>
                    <span class="screen__background__shape screen__background__shape3"></span>
                    <span class="screen__background__shape screen__background__shape2"></span>
                    <span class="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    )
}
