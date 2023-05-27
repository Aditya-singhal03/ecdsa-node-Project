import React, { useState } from 'react'
import {keccak256} from "ethereum-cryptography/keccak";
import {utf8ToBytes, toHex} from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";

export const Sign = ({setSign,transaction}) => {
  const [address,setAddress] = useState("");
  const [recipient,setRecipient] = useState("");
  const [amount,setAmount] = useState(0);
  const [pvtKey,setPvtKey] = useState("");
  const [dsign,setDsign] = useState("");
  const setValue = (setter) => (evt) => setter(evt.target.value);
  
 const hashMessage = (msg) =>{
    return keccak256(utf8ToBytes(msg));
 }
 
  const hashMessageGenerator = () =>{
    return hashMessage(JSON.stringify({
        sender: address.toLowerCase(),
        amount: Number(amount),
        id: Number(transaction),
        recipient: recipient.toLowerCase(),
    })
    );
  };
  const generate = (evt) =>{
    evt.preventDefault();
    const nsign=  secp256k1.sign(hashMessageGenerator(),pvtKey);
    setSign(nsign);
    setDsign(nsign.r.toString(16) + nsign.s.toString(16));
    console.log("sign: ",nsign)
    console.log("sign type: ",nsign.type)
    console.log("hash",hashMessageGenerator());
    console.log("isSign: ", secp256k1.verify(nsign, hashMessageGenerator(), "032aae583565bf8b5db84ce2249e8553af7d69bcc813de614f96a75d4c87f6891d"))
    //setRecoverBit(nsign[1].toString());
  };
  console.log(transaction)
  return (
    <div className='container wallet'>
        <form onSubmit={generate}>
        <h1>Sign Transaction</h1>
        <label>
            Public Key or Address
            <input placeholder='Type an address, for example: 0x1' onChange={setValue(setAddress)} ></input>
        </label>
        <label>
            Recipient
            <input placeholder='Type an address, for example: 0x1' onChange={setValue(setRecipient)}></input>
        </label>
        <label>
            Amount
            <input placeholder='Type an amonut 0,1,2...' onChange={setValue(setAmount)}></input>
        </label>
        <label>
            Private Key
            <input placeholder='Type an address, for example: 0x1' type='password' onChange={setValue(setPvtKey)}></input>
        </label>
        <button className='button' type='submit'>Generate Signature</button>
        </form>
        <div className="balance">Sign: {dsign} </div>
    </div>
  )
}
