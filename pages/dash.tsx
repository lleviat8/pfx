import React, { forwardRef, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { PageLayout } from "../components/layout"
import LinkTo from "next/link"

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Grid from "@material-ui/core/Grid";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'

import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select, { SelectProps } from '@material-ui/core/Select';

import InputAdornment from '@material-ui/core/InputAdornment';

import { useAuth } from "../utils/useAuth";
import { useRouter } from "next/router";
import { useAdmin, getFXRates } from "../utils/db";

import firebase from '../utils/firebase'
import { Gateway } from '../components/paymentgateway'
import { FXRate, FXRateContextProvider, useFXRate } from "../components/fxratescontext";
import { useTxns, TxnRow } from "../components/usetxns";



type ValType = number | string;
type FieldEvent = 
  React.ChangeEvent<HTMLInputElement |HTMLTextAreaElement> |
  React.ChangeEvent<{name?: string; value: unknown;}>

interface SelectFieldProps extends React.ComponentPropsWithRef<typeof Select> {
  options: (ValType | [ValType, React.ReactNode])[];
}

interface TxnDialogProps {
  open: boolean;
  onClose(): void;
  onSubmit(e: React.FormEvent<HTMLFormElement>): void;
}

interface NewTxnFormProps {
  onSubmit(x: Record<string, any>): void;
  // rates: Record<string, any>
}


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
    console.log('isAdmin: ', isAdmin, {getFXRates})
  }, [isAdmin])

  return (
    (user || null) &&
    <FXRateContextProvider>
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
    </FXRateContextProvider>
  )
}




export const CenteredTabs:React.FC = () => {
  const classes = useStyles();
  const [tabIdx, setTabIdx] = React.useState(0);

  const txns = useTxns()

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIdx(newValue);
  };

  return (
    <Box className={classes.flexGrow}>
      <Tabs
        value={tabIdx}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Transactions" />
        <Tab label="Exchange Rate" />
      </Tabs>
      <Box mt={3}>
        { tabIdx == 0 ? <Txns txns={txns} /> : <Rates /> }
      </Box>
    </Box>
  );
}


export const Txns = ({ txns }: {txns: TxnRow[]}) => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [pay, setPay] = useState(false)
  const [payResp, setPayResp] = useState<Record<string, any>>({})
  const [data, setData] = useState<Record<string, any>>({})


  const onClose = useCallback(() => setOpen(false), [setOpen])

  const onPayClosed = useCallback((data: Record<string, any> | undefined) => {
    console.log('modal closed with data: ', data)
    setPay(false)
  }, [setPay, setPayResp])

  const onSubmit = useCallback((data: Record<string, any>) => {
    onClose()
    data.userId = user?.uid
    setData(data)
    setPay(true)
  }, [onClose, setData, setPay, user])

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      width: 120,
    },
    {
      field: 'amountPaid',
      headerName: 'Amount Paid',
      type: 'number',
      width: 90,
      align: 'right' as 'right',
    },
    {
      field: 'currency',
      headerName: 'Currency',
      width: 90,
      align: 'right' as 'right',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 90,
      align: 'right' as 'right',
    },
  ];
  
  // const rows = [
  //   { id: 1, date:'2021-03-09', amountPaid: 100000.0, currency:'USD', amount: 1000},
  //   { id: 2, date:'2021-03-09', amountPaid: 100000.0, currency:'USD', amount: 1000},
  //   { id: 3, date:'2021-03-09', amountPaid: 100000.0, currency:'USD', amount: 1000},
  //   { id: 4, date:'2021-03-09', amountPaid: 100000.0, currency:'USD', amount: 1000},
  //   { id: 5, date:'2021-03-09', amountPaid: 100000.0, currency:'USD', amount: 1000},
  // ];

  return (
    <Box>
      <Box justifyContent='flex-end' display='flex' m={1}>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => setOpen(true)}
        >
          + New Transaction
        </Button>
        { pay && <Gateway data={data} onClose={onPayClosed} /> }
        <TxnDialog {...{open, onClose, onSubmit}} />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx} align={col.align}>{col.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {txns.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">{row.amountPaid}</TableCell>
                <TableCell align="right">{row.currency}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export const Rates:React.FC = () => {
  const rates = useFXRate();

  const ratesArray: FXRate[] = useMemo(()=>{
    const ratesArr: FXRate[] = [];
    for (const currency in rates) {
      ratesArr.push(rates[currency])
    }

    return ratesArr;
  }, [rates])

  const columns = [
    {
      field: 'currency',
      headerName: 'currency',
      width: 120,
    },
    {
      field: 'symbol',
      headerName: ' ',
      width: 120,
    },
    {
      field: 'rate',
      headerName: 'Rate',
      type: 'number',
      width: 90,
    },
  ];

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Box m={2}>
        <Typography variant='subtitle2' color='textSecondary'>
          Rates as at:
        </Typography>
        <Typography variant='body1' component='div'>
          <Box fontWeight='fontWeightBold' color='text.secondary'>
            {new Date().toDateString()}
          </Box>
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx}>{col.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ratesArray.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.currency}
                </TableCell>
                <TableCell align="right">{row.symbol}</TableCell>
                <TableCell align="right">{row.rate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export const TxnDialog:React.FC<TxnDialogProps> = ({open, onClose, onSubmit}) => {
  const ref = useRef<HTMLFormElement>(null)
  const submitForm = () => {
    const form = ref.current;
    if (form) {
      const btn: HTMLButtonElement|null = form.querySelector('input[type="submit"]')
      if (btn) btn.click()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Transaction</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText>
        <NewTxnForm ref={ref} onSubmit={onSubmit} />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" variant='outlined' onClick={submitForm}>
            Submit
          </Button>
        </DialogActions>
    </Dialog>
  );
}


export const SelectField: React.FC<SelectFieldProps> = (props) => {
  const { options, ...SelectProps } = props;

  return (
    <FormControl fullWidth={props.fullWidth}>
      <InputLabel id={props.labelId}>{props.label}</InputLabel>
      <Select {...SelectProps}>
        {
          options.map((opt, idx) => {
            let label: React.ReactNode;
            let value: ValType;
            if (Array.isArray(opt) && opt[0] != null) {
              value = opt[0]
              label = opt[1]
            } else if (!Array.isArray(opt) && opt != null) {
              value = opt
              label = value
            } else {
              return
            }
            return <MenuItem key={idx} value={value}>{label}</MenuItem>
          })
        }
      </Select>
    </FormControl>
  )
}


export const NewTxnForm = forwardRef<HTMLFormElement, NewTxnFormProps>(({ onSubmit }, ref) => {
  const rates = useFXRate()

  const [amount, setAmount] = useState(0)
  const [currency, setCurrency] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [bankCode, setBankCode] = useState('')
  const [accountNo, setAccountNo] = useState('')

  const common = (value:any, setField:(...x:any)=>void) => {
    const margin = "dense" as "dense"
    const onChange = (e: FieldEvent) => setField(e.target.value)
    return {fullWidth: true, required: true, margin, value, onChange}
  }

  const convertedAmount:number = useMemo(()=>{
    const rate = rates[currency]
    if (!rate) return 0
    return Math.round((amount / rate.rate) * 100) / 100;
  }, [currency, amount, rates])

  const convertedAmountStr = useMemo(()=>{
    const symbol = rates[currency]?.symbol || '';
    return `${symbol} ${convertedAmount}`
  }, [currency, rates, convertedAmount])

  const options = useMemo(()=> ['', ...Object.keys(rates)], [rates])

  const submitHandler = useCallback((e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    onSubmit({ amount, currency, email, fullName,
               convertedAmount, bankCode, accountNo })
  }, [amount, currency, email, fullName, convertedAmount,
      bankCode, accountNo, onSubmit])


  return (
    <form  onSubmit={submitHandler} ref={ref}>
      <TextField
        autoFocus
        id="amount"
        label="Amount"
        type="number"
        {...common(amount, setAmount)}
      />
      <Box display='flex' justifyContent='space-between'>
        <Box width='47%'>
          <SelectField
            id="currency"
            label="Currency"
            options={ options }
            {...common(currency, setCurrency)}
          />
        </Box>
        <Box width='47%'>
          <TextField
            disabled
            fullWidth
            id="convertedAmount"
            label={`Amount in ${currency}`}
            value={ convertedAmountStr }
          />
        </Box>
      </Box>
      <TextField
        id="email"
        label="Recipient Email Address"
        type="email"
        {...common(email, setEmail)}
      />
      <TextField
        id="fullName"
        label="Recipient Full Name"
        {...common(fullName, setFullName)}
      />
      <TextField
        id="bankCode"
        label="Recipient Bank Code"
        {...common(bankCode, setBankCode)}
      />
      <TextField
        id="accountNo"
        label="Recipient Account Number"
        {...common(accountNo, setAccountNo)}
      />
      <input name='submitBtn' type='submit' style={{display:'none'}} value='submit' />
    </form>
  )
})
