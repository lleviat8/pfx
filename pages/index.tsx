import React, { useContext, useEffect } from "react"
import { PageLayout } from "../components/layout"
import LinkTo from "next/link"

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Grid from "@material-ui/core/Grid";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flexGrow: 1,
  },
  gridbreak: {
    [theme.breakpoints.down('md')]: {
      marginLeft: '10%',
      marginRight: '10%',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '5%',
      marginRight: '5%',
    },
  }
}));


export default function IndexWrapper() {
  const classes = useStyles();

  return (
    <PageLayout>
      <Box className={classes.root}>
        <Grid container spacing={3}>
          <Grid item md></Grid>
          <Grid item xs={12} md={8} className={classes.gridbreak}>
            <Typography variant="h2">
              <Box fontWeight="fontWeightBold" ml={0.5}>
                Paulina's
              </Box>
            </Typography>
            <Typography variant="h1" gutterBottom>
              <Box fontWeight="fontWeightBold">
                Bereau De Change
              </Box>
            </Typography>
            <Box
              display='flex'
              flexDirection='row'
              my={1}
              py={1}
            >
              <LinkTo href='/login'>
                <Box mr={3} ml={1.2}>
                  <Button variant="contained" color="primary">
                    Login
                  </Button>
                </Box>
              </LinkTo>
              <LinkTo href='/register'>
                <Button variant="outlined" color="primary">
                  Register
                </Button>
              </LinkTo>
            </Box>
          </Grid>
          <Grid item md></Grid>
        </Grid>
      </Box>
    </PageLayout>
  )
}
