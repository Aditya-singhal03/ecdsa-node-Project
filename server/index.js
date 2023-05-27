const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require("ethereum-cryptography/secp256k1.js");
const {keccak256} = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
  "032aae583565bf8b5db84ce2249e8553af7d69bcc813de614f96a75d4c87f6891d":150,
};

const transactions = {
  "0x1": 1,
  "0x2": 5,
  "0x3": 7,
  "032aae583565bf8b5db84ce2249e8553af7d69bcc813de614f96a75d4c87f6891d":15,
}
app.get("/transaction/:address", (req, res) => {
  const { address } = req.params;
  const transaction = transactions[address] || 0;
  res.send({ transaction });
});
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});


app.post("/send", (req, res) => {
  const { sender, recipient, amount,signatureString} = req.body;

  const hashMessage = (msg) =>{
    return keccak256(utf8ToBytes(msg));
 }
 
  const hashMessageGenerator = () =>{
    return hashMessage(JSON.stringify({
        sender: sender.toLowerCase(),
        amount: Number(amount),
        id: Number(transactions[sender]),
        recipient: recipient.toLowerCase(),
    })
    );
  };

  setInitialBalance(sender);
  setInitialBalance(recipient);
  const signature = {
     r:  BigInt(signatureString.r),
     s:BigInt(signatureString.s),
     recovery:BigInt(signatureString.recovery),
  }
  console.log("sign: ", signature);
  console.log("hash: ", hashMessageGenerator());
  console.log("senders: ", sender);
  console.log("ans: ",secp256k1.verify(secp256k1.sign(hashMessageGenerator(),"a70f3753243188d2170c8b947d8837045f5cd011b69042e5f6719df266d3cbe2"),hashMessageGenerator(),sender));
  console.log("transac.: ",transactions[sender]);
  if(secp256k1.verify(signature,hashMessageGenerator(),sender)){
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      transactions[sender]++;
      res.send({ balance: balances[sender],transaction:transactions[sender]});
    }
  }
  else{
    res.status(400).send({ message: "Not your account! Authentication failed" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
  if (!transactions[address]) {
    transactions[address] = 0;
  }
}
//public key:032aae583565bf8b5db84ce2249e8553af7d69bcc813de614f96a75d4c87f6891d
// Private key:a70f3753243188d2170c8b947d8837045f5cd011b69042e5f6719df266d3cbe2
