import React, { useState, useCallback } from 'react';

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  return (
    <PageLayout>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <RegisterForm />
        </div>
      </Container>
    </PageLayout>
  );
}

const RegisterForm = ()=>{
  const [submitting, setSubmitting] = useState(false)
  const [fname, setFName] = useState('')
  const [lname, setLName] = useState('')
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [errors, setErrors] = useState<Record<string, string|null>>({})

  const classes = useStyles();
  const auth = useAuth()
  const router = useRouter()

  const onSubmit = useCallback(async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setSubmitting(true)

    Promise.resolve(auth.signup(email, pwd))
    .then((usr:any) => {
      setSubmitting(false)
      if (usr && usr.updateProfile) {
        usr.updateProfile({displayName: `${fname} ${lname}`})
        router.push('/dash')
      }
    })
    .catch((e:any)=>{
      setSubmitting(false)
      if (e.code && e.message){
        let newErrors:Record<string, string> = {};
        if (e.code.indexOf('password') != -1) {
          newErrors.pwd = e.message
        } else if (e.code.indexOf('email') != -1){
          newErrors.email = e.message
        } else if (e.code.indexOf('user') != -1){
          newErrors.email = e.message
        }
        setErrors(errors => ({...errors, ...newErrors}))
      }
    })
  }, [fname, lname, email, pwd, setErrors])

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

  const fieldExtra = useCallback(
    (value:any, field:string, func:(...args:any)=>void)=>{
      return {
        disabled:submitting,
        value:value,
        onChange: onChange(func, field),
        helperText: errors[field],
        error: errors[field] ? true : false
      }
    },
    [submitting, errors]
  )

  const common = {
    variant: "outlined" as "outlined",
    required: true,
    fullWidth: true
  }

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="fname"
            name="firstName"
            id="firstName"
            label="First Name"
            autoFocus
            {...common}
            {...fieldExtra(fname, 'fname', setFName)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            {...common}
            {...fieldExtra(lname, 'lname', setLName)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            {...common}
            {...fieldExtra(email, 'email', setEmail)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...common}
            {...fieldExtra(pwd, 'pwd', setPwd)}
          />
        </Grid>
      </Grid>
      <Button
        disabled={submitting}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign Up
      </Button>
      <Grid container justify="flex-end">
        <Grid item>
          <LinkTo href='/login' passHref>
            <Link variant="body2">
              Already have an account? Sign in
            </Link>
          </LinkTo>
        </Grid>
      </Grid>
    </form>
  )
}
