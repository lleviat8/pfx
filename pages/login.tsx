import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useAuth } from '../utils/useAuth'
import { PageLayout } from '../components/layout'
import LinkTo from 'next/link'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { useRouter } from 'next/router';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function SignIn() {
  const classes = useStyles();

  return (
    <PageLayout>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <SignInForm />
        </div>
      </Container>
    </PageLayout>
  );
}

const SignInForm = () => {
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [errors, setErrors] = useState<Record<string, string|null>>({})

  const classes = useStyles();
  const auth = useAuth()
  const router = useRouter()

  const onSubmit = useCallback(async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setSubmitting(true)
    Promise.resolve(auth.signin(email, pwd))
    .then((usr:any) => {
      setSubmitting(false)
      if (usr) router.push('/dash')
    }).catch((e:any)=>{
      setSubmitting(false)
      if (e.message) {
        setErrors(errors => ({...errors, 'email':e.message}))
      }
    })
  }, [email, pwd, setErrors])

  const onChange = useCallback(
    (handler: (...args:any)=>void, field:string)=>{
      return (e:React.ChangeEvent<HTMLInputElement>)=>{
        handler(e.currentTarget.value)
        setErrors(errors => {
          return {...errors, [field]:null}
        })
      }
    },
    [setErrors]
  )



  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <TextField
        autoFocus
        fullWidth
        disabled={submitting}
        variant="outlined"
        margin="normal"
        required
        type='email'
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={email}
        onChange={onChange(setEmail, 'email')}
        helperText={errors.email}
        error={errors.email ? true : false}
      />
      <TextField
        disabled={submitting}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={pwd}
        onChange={onChange(setPwd, 'pwd')}
        autoComplete="current-password"
        helperText={errors.pwd}
        error={errors.pwd ? true : false}
      />
      <Button
        disabled={submitting}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item xs />
        <Grid item>
          <LinkTo href='/register' passHref>
            <Link variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </LinkTo>
        </Grid>
      </Grid>
    </form>
  )
}
