import axios from 'axios'
import React, { useState } from 'react'

export default function Otp() {
    const [otp, setOtp] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.post("http://localhost:5000/otp/check-otp", { checkOTP: otp })
        if (response.data.success) {
            alert(response.data.message)
        }
        else {
            alert(response.data.message)
        }
        console.log('response', response);

    }
    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="">Enter OTP</label>
                <input type='text' onChange={(e) => setOtp(e.target.value)} />
                <input type="submit" />
            </form>
        </div>
    )
}
