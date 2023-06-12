import { TextField } from "@mui/material"
import './LoginPage.css';

export const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-container__box">
        <TextField id="standard-basic" label="Standard" variant="standard" />

      </div>
    </div>
  )
}
