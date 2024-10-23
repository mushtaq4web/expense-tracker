import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; 
import { Button, Modal, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Register the necessary components from Chart.js
Chart.register(...registerables);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [showModal, setShowModal] = useState(false);

  const addTransaction = () => {
    if (description && amount) {
      setTransactions([...transactions, { amount: parseFloat(amount), description, type }]);
      setAmount('');
      setDescription('');
      setShowModal(false);
    }
  };

  const deleteTransaction = (index) => {
    const newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const dataBar = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      label: 'Financial Overview',
      data: [totalIncome, totalExpenses],
      backgroundColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)']
    }]
  };

  const dataPie = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [totalIncome, totalExpenses],
      backgroundColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)']
    }]
  };

  return (
    <div className="container">
      <h1 className="mt-4">Expense Tracker</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>Add Transaction</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
            </Form.Group>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addTransaction}>
            Add Transaction
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 className="mt-4">Balance: ₹{balance.toFixed(2)}</h2>
      <div className="row">
        <div className="col-md-6">
          <Bar data={dataBar} />
        </div>
        <div className="col-md-6">
          <Pie data={dataPie} />
        </div>
      </div>

      <h3 className="mt-4">Transaction History</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.description}</td>
              <td>₹{transaction.amount.toFixed(2)}</td>
              <td>{transaction.type}</td>
              <td>
                <Button variant="danger" onClick={() => deleteTransaction(index)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
