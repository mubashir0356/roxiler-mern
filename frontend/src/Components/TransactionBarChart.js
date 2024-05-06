import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "./TransactionBarChart.css"

function TransactionBarChart({ selectedMonth }) {

  const [data, setData] = useState([]);
  const [quantities, setQuantities] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // const [statsticsData, setStatsticsData] = useState({})

  const fetchQuantity = async () => {
    try {
      const options = {
        method: "GET"
      }
      const res = await fetch(`${process.env.REACT_APP_IP_ADDRESS}/getquantity?month=${selectedMonth}`, options)
      const data = await res.json()
      setData(data)
      console.log("qtydata", data)

    } catch (error) {
      console.log("error while fetchting quantity", error)
    }
  }

  const updateQuantity = () => {
    data.forEach(each => {
      switch (each.priceRange) {
        case '0 - 100':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 1), each.numberOfItems, ...prevQuantities.slice(2)]);
          break;
        case '101 - 200':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 2), each.numberOfItems, ...prevQuantities.slice(3)]);
          break;
        case '201 - 300':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 3), each.numberOfItems, ...prevQuantities.slice(4)]);
          break;
        case '301 - 400':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 4), each.numberOfItems, ...prevQuantities.slice(5)]);
          break;
        case '401 - 500':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 5), each.numberOfItems, ...prevQuantities.slice(6)]);
          break;
        case '501 - 600':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 6), each.numberOfItems, ...prevQuantities.slice(7)]);
          break;
        case '601 - 700':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 7), each.numberOfItems, ...prevQuantities.slice(8)]);
          break;
        case '701 - 800':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 8), each.numberOfItems, ...prevQuantities.slice(9)]);
          break;
        case '801 - 900':
          setQuantities(prevQuantities => [...prevQuantities.slice(0, 9), each.numberOfItems]);
          break;
        default:
          // Do nothing
          break;
      }
    });
  }

  console.log(quantities, "quantities")

  useEffect(() => {
    fetchQuantity()
  }, [selectedMonth])

  useEffect(() => {
    updateQuantity()
  }, [data])

  // Process data to calculate price range and number of items
  const processData = (data) => {
    // Your logic to process the data and calculate price range and count
    // Example:
    const priceRangeData = [
      { range: '0 - 100', count: quantities[0] },
      { range: '101 - 200', count: quantities[1] },
      { range: '201 - 300', count: quantities[2] },
      { range: '301 - 400', count: quantities[3] },
      { range: '401 - 500', count: quantities[4] },
      { range: '501 - 600', count: quantities[5] },
      { range: '601 - 700', count: quantities[6] },
      { range: '701 - 800', count: quantities[7] },
      { range: '801 - 900', count: quantities[8] },
      { range: '901 - above', count: quantities[9] },
      // Add more ranges as needed
    ];
    return priceRangeData;
  };

  return (
    <div className='transaction-barstatus'>
      <h2>Bar Chart Status - {selectedMonth}</h2>

      <div style={{ marginTop: "20px" }}>
        <BarChart width={1000} height={500} data={processData(data)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  )
}

export default TransactionBarChart