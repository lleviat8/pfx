import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import "@fontsource/roboto"
import LinkTo from 'next/link'
import { useRouter } from 'next/router'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Typography } from "@material-ui/core"

import { useAuth } from "../utils/useAuth";
import { Fragment } from "react"


const useStyles = makeStyles({
  root: {
    listStyle: 'none',
  },
});


interface NavItem {
  label: string;
  component?: React.ReactNode;
  link?: string;
}

interface NavContext {
  leftItems?: NavItem[];
  rightItems?: NavItem[];
  setLeftItems?(x: NavItem[]): void;
  setLeftItems?(x: (x: NavItem[])=>NavItem[]): void;
  setRightItems?(x: NavItem[]): void;
  setRightItems?(x: (x: NavItem[])=>NavItem[]): void;
}

interface NavGroupProps {
  items: NavItem[];
  align: ("flex-start"|"flex-end"|"center") & string;
}

interface NavItemProps {
  item: NavItem;
}


export const navContext = createContext<NavContext>({});

export const authNavItems = [
  {label: 'Register', link:'/register'},
  {label: 'Login', link:'/login'},
]

export const NavBarWrapper:React.FC = ({ children }) => {
  return (
    <ProvideNavItems>
      <RenderNavBar />
      <NavBarHookWrapper>
        {children}
      </NavBarHookWrapper>
    </ProvideNavItems>
  )
}

export const NavBarHookWrapper:React.FC = ({ children }) => {
  useHomeBrand()
  useUserActions()
  return <Fragment>{ children }</Fragment>
}

export const ProvideNavItems:React.FC = ({ children }) => {
  const [leftItems, setLeftItems] = useState<NavItem[]>([])
  const [rightItems, setRightItems] = useState<NavItem[]>(authNavItems)
  const navCtx = {leftItems, rightItems, setLeftItems, setRightItems};
  
  return (
    <navContext.Provider value={navCtx}>
      {children}
    </navContext.Provider>
  )
}

export const RenderNavBar:React.FC = () => {
  const {leftItems, rightItems} = useNav()

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      component='header'
    >
      {
        [leftItems, rightItems].map((links, idx)=>{
          const align = idx ? 'flex-end' : 'flex-start';
          if (!(links && links.length)) return;

          return <NavGroup align={align} items={links} key={idx} />
        })
      }
    </Box>
  )
}

export const NavGroup:React.FC<NavGroupProps> = (props) => {
  const styles = useStyles()

  return (
    <Box
      pl={0}
      my={0}
      flex={1}
      display='flex'
      bgcolor='inherit'
      flexDirection='row'
      justifyContent={props.align}
      className={styles.root}
      component='ul'
    >
      {
        props.items.map((item, idx)=><NavItem item={item} key={idx} />)
      }
    </Box>
  )
}

export const NavItem:React.FC<NavItemProps> = (props) => {
  return (
    <Box component='li'>
      {
        props.item.component ?
        props.item.component :
        <LinkTo href={props.item.link || '#'} passHref>
          <Link>
            <Box p={2} fontWeight="fontWeightBold">
              {props.item.label}
            </Box>
          </Link>
        </LinkTo>
      }
    </Box>
  )
}

export const useHomeBrand = ()=>{
  const {setLeftItems} = useContext(navContext)
  const router = useRouter()
  const ref = useRef(0)

  useEffect(()=>{
    const currentVal = ref.current;

    setTimeout(()=>{
      if (currentVal == ref.current) {
        if (setLeftItems && router.pathname != '/'){
          setLeftItems([
            {label:'Home', component: <HomeBrand/>}
          ])
        }
      } else {
        console.log('cancel useHomeBrand')
      }
    }, 100)

    return ()=>{
      ref.current += 1
    }
  }, [setLeftItems])
  return null;
}

export const HomeBrand = ()=>{
  return (
    <LinkTo href='/' passHref>
      <Link>
        <Box p={1}>
          <Typography variant='subtitle2'>
            <Box fontWeight="fontWeightBold">
              Paulina's
            </Box>
          </Typography>
          <Typography variant='h6'>
            <Box mt={-1}>
              Bereau De Change
            </Box>
          </Typography>
        </Box>
      </Link>
    </LinkTo>
  )
}

export const useUserActions = () => {
  const ref = useRef(0)
  const [added, setAdded] = useState(false)
  const { setRightItems } = useContext(navContext)
  const { user } = useAuth()

  useEffect(()=>{
    const currentVal = ref.current
    if (user && !added && setRightItems) {
      setTimeout(()=>{
        if (currentVal == ref.current) {
          setRightItems([{label:'User', component: <UserIconMenu />}])
          setAdded(true)
        } else {
          console.log('changed: ', currentVal, ref.current)
        }
      }, 100)
    } else if (!user && added) {
      setTimeout(()=>{
        if (currentVal == ref.current) {
          if (setRightItems) setRightItems(authNavItems)
          setAdded(false)
        } else {
          console.log('changed 2: ', currentVal, ref.current)
        }
      }, 100)
    }
    return ()=>{
      ref.current += 1
    }
  }, [user])

  return null
}

export default function UserIconMenu() {
  const auth = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDash = () => {
    setAnchorEl(null)
    router.push('/dash')
  }

  const logout = () => {
    setAnchorEl(null)
    auth.signout && auth.signout()
    router.push('/')
  }

  return (
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <AccountCircle  color='primary'/>
      </IconButton>
      <Menu
        keepMounted
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null} 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {
          !router.pathname.startsWith('/dash') &&
          <MenuItem onClick={openDash}>Dashboard</MenuItem>
        }
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export const useNav = () => {
  return useContext(navContext)
}
