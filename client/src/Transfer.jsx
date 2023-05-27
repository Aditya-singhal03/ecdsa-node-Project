import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, sign, setTransaction}) {
  const [sendAmount, setSendAmount] = useState(0);
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  

  async function transfer(evt) {
    evt.preventDefault();

    try {
      console.log("eneterd")
      const signatureString = {
        r: sign.r.toString(),
        s: sign.s.toString(),
        recovery: sign.recovery.toString(),
      };
      const {
        data: { balance,transaction},
      } = await server.post(`send`, {
        sender: address,
        amount: Number(sendAmount),
        signatureString: signatureString,
        recipient,
      });
      setBalance(balance);
      setTransaction(transaction);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
