import './App.css';
import TransactionTable from "./Components/TransactionTable"
import TransctionStatistics from "./Components/TransctionStatistics"
import TransactionBarChart from './Components/TransactionBarChart';
import { useState } from 'react';

function App() {
  const [selectedMonth, setSelectedMonth] = useState("June");

  return (
    <div className="main-container">
      
      <div className="transaction-details-heading">
        <h1 >Transaction Dashboard</h1>
      </div>
      <TransactionTable selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      <TransctionStatistics selectedMonth={selectedMonth}/>
      <TransactionBarChart selectedMonth={selectedMonth}/>
    </div>
  );
}

export default App;
