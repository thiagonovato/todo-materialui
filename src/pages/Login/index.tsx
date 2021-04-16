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
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email é obrigatório').email('Digite um email válido'),
  password: Yup.string().required('Senha é obrigatória')
});

export default function SignIn() {
  const auth = useAuth();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleFormik = async (values: Values, formikHelpers: FormikHelpers<Values>) => {
    setLoading(true)
    try {
      const result = await auth.login(values.email, values.password);
      if (result === undefined) setHasError(true);
      setLoading(false)
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
          Login
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
              <ErrorMessage
                open={hasError}
                handleClose={handleClose}
                title='Erro'
                severity="error"
                message={
                  <>
                    Verifique se seu{' '}
                    <strong>email</strong>{' '}
                    e/ou <strong>senha</strong>{' '}
                    estão corretos
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
                {loading ? 'Aguarde...' : 'Entrar'}
              </Button>
              <Grid container>
                <Grid item>
                  <Link to='/register'>
                    {"Não tem conta? Cadastre-se"}
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