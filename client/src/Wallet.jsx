import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, onChange }) {

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Public Key or Address
        <input placeholder="Type an address, for example: 0x1"  value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
