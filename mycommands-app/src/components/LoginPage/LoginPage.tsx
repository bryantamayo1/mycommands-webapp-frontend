import './LoginPage.css';
import { TextField }    from "@mui/material";
import { useFormik }    from 'formik';
import { useContext }   from 'react';
import * as Yup         from 'yup';
import { AuthContext } from '../../auth/AuthContext';

export const LoginPage = () => {
  ////////
  // Hooks
  ////////
  const {errorMessage, login, status} = useContext(AuthContext);

  // Define form with formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Debe introducir un email válido').required('Email requerido'),
      password: Yup.string().required('Contraseña requerida')
    }),
    onSubmit: values => {
      console.log(values);
      login(values);
    }
  });

  return (
    <div className="login-container">
      <p className="title">My Commands</p>
      <form onSubmit={formik.handleSubmit}>
        <div className="container-form">

          <div className="container-form-row">
            <TextField id="standard-basic" color="warning" fullWidth label="Email" variant="standard"
              name="email" type="email" 
              onChange={formik.handleChange} value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className='error-formik'>{formik.errors.email}</p>
            )}
          </div>

          <div>
            <TextField id="standard-basic" color="warning" fullWidth label="Contraseña" variant="standard"
              name="password"  type="password"
              onChange={formik.handleChange} value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className='error-formik'>{formik.errors.password}</p>
            )}
          </div>

          {status === "error" && (
            <p className='error-formik error-msg'>{errorMessage}</p>
          )}

          <div className="container-form__container-btn-login">
            <button type='submit'>Login</button>
          </div>

        </div>
      </form>
    </div>
  )
}
