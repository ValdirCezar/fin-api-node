const { json } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const customers = [];

app.use(express.json());

/**
 * id: uuid
 * cpf: atring
 * name: string
 * statement: []
 */

// ----- POST TO CREATE AN ACCOUNT -----
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  customers.map(item => {
    if (item.cpf === req.body.cpf) {
      return res.status(400).json({ message: "CPF already exists!" });
    }
  })

  customers.push({
    id: uuidv4(),
    cpf,
    name,
    statement: []
  })

  console.log(customers[0]);
  return res.status(201).json({ message: "Account created" });
})

// ----- START SERVER -----
app.listen(PORT, () => {
  console.log("Server is running on PORT: 3000");
})
