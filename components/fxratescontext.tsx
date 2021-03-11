import React, { createContext, useContext, useEffect, useState } from 'react'
import { getFXRates } from "../utils/db";



export interface FXRate {
  id: number;
  symbol: string;
  rate: number;
  currency: string;
}


export interface FXRates {
  [x: string] : FXRate
}


export const FXRateContext = createContext<FXRates>({})


export const useProvideFXRate = () => {
  const [rates, setRates] = useState<FXRates>({})

  useEffect(function(){
    (async () => {
      const ratesArray: FXRate[] = (await getFXRates()).map((rate, idx) => ({
        id: idx,
        symbol: rate.symbol,
        rate: rate.rate,
        currency: rate.id,
      }))
      const _rates: FXRates = {};
      ratesArray.forEach(rate => {
        _rates[rate.currency] = rate}
      )
      console.log("rateArray, rates: ", ratesArray, _rates)
      setRates(_rates)
    })()
  }, [setRates])

  return rates;
}


export const FXRateContextProvider: React.FC = ({ children }) => {
  const rates = useProvideFXRate()

  return (
    <FXRateContext.Provider value={rates}>
      { children }
    </FXRateContext.Provider>
  )
}

export const useFXRate = () => useContext(FXRateContext)
