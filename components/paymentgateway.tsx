import React, { useCallback, useEffect, useRef } from 'react';


interface GatewayProps {
  data: Record<string, any>;
  onClose(data?: Record<string, any>): void;
}


export const Gateway: React.FC<GatewayProps> = ({data, onClose}) => {
  const mounted = useRef(0)

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = initGateway;
    return () => {
      document.body.removeChild(script);
      setTimeout(() => {
        document.querySelectorAll("iframe[name^=paystack]").forEach(n=>{
          n.parentNode?.removeChild(n)
        })
      }, 1000)
      mounted.current += 1;
    };
  }, [onClose]);

  const handleClose = (resp: Record<string, any> | undefined) => {
    if (mounted.current != 0) return
    onClose(resp)
  }

  const initGateway = () => {
    const PaystackPop = (window as any).PaystackPop;

    const options = {
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: data.email,
      amount: data.amount * 100,
      channels: ['card'],
      metadata: {
        custom_fields: [
           {
              user_id: data.userId,
              account: `${data.bankCode}|${data.accountNo}`,
              recipient: `${data.email}|${data.fullName}`,
              amount: `${data.currency}|${data.convertedAmount}`
           }
        ]
      },
      onClose: handleClose,
      callback: handleClose
    }
    console.log('options: ', options)
    PaystackPop.setup(options).openIframe();
  }
 
  return null
}
