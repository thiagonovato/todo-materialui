import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';

import { useAuth } from '../../contexts/auth';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Copyright from '../../components/Copyright';
import ErrorMessage from '../../components/ErrorMessage';
import { Link } from 'react-router-dom'

import useStyles from './styled'

interface Values {
  email: string,
  password: string,
  confirmPassword: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email é obrigatório').email('Digite um email válido'),
  password: Yup.string().required('Senha é obrigatória'),
  confirmPassword: Yup.string().required('Senha é obrigatória')
});

export default function Register() {
  const auth = useAuth();
  const [hasError, setHasError] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [messageError, setMessageError] = useState('Erro ao efetuar o cadastro')
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleFormik = async (values: Values, formikHelpers: FormikHelpers<Values>) => {
    setLoading(true)
    try {
      const result = await auth.register(values.email, values.password, values.confirmPassword);
      if (result.error) {
        setMessageError(result.message)
        setHasError(true)
      }
      if (result === undefined) setHasError(true);
      setLoading(false)
      setHasSuccess(true)
    } catch (error) {
      setHasError(true);
      setLoading(false)
    }
    formikHelpers.setSubmitting(false);
  };

  const handleClose = () => {
    setHasError(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Criar conta
        </Typography>
        <Formik initialValues={{} as Values} validationSchema={validationSchema} onSubmit={handleFormik}>
          {({ isSubmitting, values, handleChange, touched, errors }) => (
            <Form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                autoComplete="email"
                id="email"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
              />
              <ErrorMessage
                open={hasError || hasSuccess}
                handleClose={handleClose}
                title={hasError ? "Erro" : "Sucesso"}
                severity={hasError ? "error" : "success"}
                message={hasError ?
                  <>
                    {messageError}
                  </> :
                  <>
                    Cadastro efetuado com sucesso. Volte e faça login.
                  </>
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}
              >
                {loading ? 'Aguarde...' : 'Criar conta'}
              </Button>
              <Grid container>
                <Grid item>
                  <Link to='/'>
                    {"Já tem conta? Faça login"}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}