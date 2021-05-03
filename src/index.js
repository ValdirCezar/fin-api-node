const { request } = require('express');

// Import express to start an server
const express = require('express');

// Import v4 and rename to uuid to create an id automatically
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const customers = [];

app.use(express.json());

/* ----- Middlewares ------ */

/**
 * 
 * Verify if exists an account with the
 * CPF informed in headers
 */
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;
  const customer = customers.find((customer) => customer.cpf === cpf);

  request.customer = customer;

  // Case customer exists return next() else return 404
  return customer ? next() : res.status(404).json({ message: "CPF not found" })
}



/* ----- Endpoints ------ */

/**
 * 
 * POST to create a new account
 */
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  // Mapping an item in vector like with CPF informed on body
  customers.map(item => {
    if (item.cpf === req.body.cpf) {
      // Case CPF already exists return an error
      return res.status(400).json({ message: "CPF already exists!" });
    }
  })

  // Case CPF not exists add the same on vector
  customers.push({
    id: uuidv4(),
    cpf,
    name,
    statement: []
  })

  // Return a sucess
  return res.status(201).json({ message: "Account created" });
})

/**
 * GET to read a statement of account
 */
app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = request;
  return res.json({ statements: customer.statement })
})

/**
 * GET statements of a customer by date
 */
app.get("/statement/date", (req, res) => {
  const { customer } = request;
  const { date } = req.query;
  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())
  return res.json(statement)
})

/**
 * POST to make a deposity in an account
 */
app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = request;

  const statementOperation = {
    id: uuidv4(),
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  };

  customer.statement.push(statementOperation);

  return res.status(201).json({ message: "Successful deposit" })
})

/**
 * PUT to update data from account
 */
app.put("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { name } = req.body;
  const { customer } = request;

  customer.name = name;

  return res.status(201).json({ message: "Account updated" })
})

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log("Server is running on PORT: 3000");
})
