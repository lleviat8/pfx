import React, { useContext, useEffect } from "react"
import { PageLayout } from "../components/layout"
import LinkTo from "next/link"

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';

import { useAuth } from "../utils/useAuth";
import { useRouter } from "next/router";
import { useAdmin } from "../utils/db";

import firebase from '../utils/firebase'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    borderTop: '2px solid #eee',
    '&$flexGrow': {
      flexGrow: 1,
    }
  },
  flexGrow: {},
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


export default function DashWrapper() {
  return (
    <PageLayout>
      <Dashboard />
    </PageLayout>
  )
}


const Dashboard = ()=>{
  const classes = useStyles();
  const router = useRouter()
  const { user } = useAuth()
  const { isAdmin } = useAdmin()

  useEffect(() => {
    console.log('dashboard user is: ', user)
    if (user === null) {
      router.push('/login')
    }
  }, [user])

  useEffect(()=>{
    console.log('isAdmin: ', isAdmin)
  }, [isAdmin])

  return (
    (user || null) &&
    <Box className={classes.root} my={2} pt={1}>
      <Grid container>
        <Grid item md></Grid>
        <Grid item xs={12} md={8} className={classes.gridbreak}>
          <Box color='text.secondary'>
            <Typography variant="subtitle2">
              <Box>Signed in as:</Box>
            </Typography>
            <Typography variant="subtitle1">
              <Box fontWeight="fontWeightBold">
                {user ? user.displayName : ''}
              </Box>
            </Typography>
          </Box>
        </Grid>
        <Grid item md></Grid>
      </Grid>
      <CenteredTabs />
    </Box>
  )
}




export const CenteredTabs = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.flexGrow}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Transactions" />
        <Tab label="Exchange Rate" />
      </Tabs>
    </Box>
  );
}


// export const Txns = () => {
//   <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
// }


// const columns: ColDef[] = [
//   {
//     field: 'amount',
//     headerName: 'Amount',
//     type: 'number',
//     width: 90,
//   },
//   { field: 'currency', headerName: 'Currency', width: 90 },
//   {
//     field: 'date',
//     headerName: 'Date',
//     type: 'date',
//     width: 120,
//   }
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];
