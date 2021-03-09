import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import "@fontsource/roboto"

import { Container, CssBaseline } from "@material-ui/core"

import { ProvideAuth } from "../utils/useAuth";
import { NavBarWrapper } from "./navbar"
import { ProvideAdmin } from "../utils/db";



export const Layout:React.FC = ({ children }) => {
  return (
    <ProvideAuth>
      <ProvideAdmin>
        {children}
      </ProvideAdmin>
    </ProvideAuth>
  )
}


export const PageLayout:React.FC = ({ children }) => {
  return (
    <Layout>
      <CssBaseline />
      <Container maxWidth='md'>
        <NavBarWrapper>
            {children}
        </NavBarWrapper>
      </Container>
    </Layout>
  )
}
