import Wallet from "./Wallet";
import Transfer from "./Transfer";
import  {Transaction}  from "./transaction";
import "./App.scss";
import { useState } from "react";
import { Sign } from "./Sign";
import server from "./server";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [transaction,setTransaction] = useState(0);
  const [sign,setSign] = useState("");

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      const {
        data: {transaction},
      } = await server.get(`transaction/${address}`);
      setTransaction(transaction);
      setBalance(balance);
    } else {
      setBalance(0);
      setTransaction(0);
    }
  }

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        onChange={onChange}
      />
      <Transaction
        address={address}
        setAddress={setAddress}
        transaction={transaction}
        setTransaction={setTransaction}
        onChange={onChange}
      />
      <Sign
        setSign= {setSign}
        transaction={transaction}
      />
      <Transfer setBalance={setBalance} address={address} sign={sign} setTransaction={setTransaction}/>
    </div>
  );
}

export default App;
