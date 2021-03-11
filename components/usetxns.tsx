import React, { useState, useEffect, useRef } from 'react'
import { useAdmin, get_db } from '../utils/db'
import { useAuth } from '../utils/useAuth'



export interface TxnRow {
  accountNo: string;
  amount: number;
  amountPaid: number;
  bankCode: string;
  currency: string;
  date: string;
  email: string;
  fullName: string;
  userId: string;
}

export const useTxns = () => {
  const [txns, setTxns] = useState<TxnRow[]>([])
  const { user } = useAuth()
  const { isAdmin } = useAdmin()
  const count = useRef(0)


  useEffect(function(){
    let unsub = ()=>{};
    const _count = count.current;
    
    if ( isAdmin !== null ) {
      const query = isAdmin
        ? get_db().collection("txns")
        : get_db().collection("txns").where("user_id", "==", user?.uid)

      const u = query.orderBy("date", "desc").onSnapshot((querySnapshot) => {
          const _txns: TxnRow[] = [];
          querySnapshot.forEach((doc) => {
              _txns.push(doc.data() as TxnRow);
          });
          console.log("Txns: ", _txns, _count, count.current);
          console.log('Quwey: ', query, isAdmin)
          if (count.current == _count) {
            setTxns(_txns)
          }
      }, error => {
        console.log('snapshpt error: ', error)
      });
      unsub = u
    }

    return () => {
      unsub()
      count.current += 1;
    }
  }, [setTxns, user, isAdmin])

  return txns;
}
