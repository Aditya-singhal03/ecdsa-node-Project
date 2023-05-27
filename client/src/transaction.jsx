import React from 'react'

export const Transaction = ({address, setAddress, transaction, setTransaction,onChange}) => {
    
  return (
    <div className='container transaction'>
    <h1>Transactions</h1>
    <label >
        Public Key or Address
        <input placeholder='Type an address, for example: 0x1'  value={address} onChange={onChange} />
    </label>
    <div className="balance">Transactions:{transaction}</div>
    </div>
  )
}
