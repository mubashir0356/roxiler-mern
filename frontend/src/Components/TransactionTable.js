import { useEffect, useState } from "react"
import "./TransactionTable.css"

function TransactionTable({ selectedMonth, setSelectedMonth }) {

    const [transactionsData, setTransactionData] = useState([])
    const [pageNum, setPageNums] = useState(1)
    const [searchInput, setSearchInput] = useState("")
    console.log("transaction data", transactionsData)
    const onSearchChange = event => {
        setSearchInput(event.target.value)
    }

    const onClickNext = () => {
        if (pageNum < 6) {
            setPageNums(prev => prev + 1)
        }
    }

    const onClickPrev = () => {
        if (pageNum > 1) {
            setPageNums(prev => prev - 1)
        }
    }


    const fetchtransactions = async () => {
        try {
            const options = {
                method: "GET"
            }
            const res = await fetch(`${process.env.REACT_APP_IP_ADDRESS}/gettransactions?search=${searchInput}&page=${pageNum}`, options)
            const data = await res.json()
            setTransactionData(data)

        } catch (error) {
            console.log("error while fetchting transactions", error)
        }
    }

    useEffect(() => {
        fetchtransactions()
    }, [searchInput, pageNum])

    console.log(searchInput, "searchInput")

    return (
        <div>
            <div className="search-input">
                <input type="search" placeholder="Search transaction" className="search-box" onChange={onSearchChange} />
                <select className="options-months" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value="January">January</option>
                    <option value="Febrauary">Febrauary</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
            </div>

            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactionsData.map((transaction, index) =>
                        <tr key={index}>
                            <td>{transaction.id}</td>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.sold === 0 ? "False" : "True"}</td>
                            <td>{transaction.image}</td>
                        </tr>
                    )}



                </tbody>
            </table>

            <div className="transaction-table pages-align" >
                <p>Page No: {pageNum}</p>
                <div style={{ display: "flex" }}>
                    <button style={{ backgroundColor: "transparent", border: "none", cursor: "pointer" }} onClick={onClickNext}>Next</button>
                    <p style={{ marginLeft: "2px", marginRight: "2px" }}> - </p>
                    <button style={{ backgroundColor: "transparent", border: "none", cursor: "pointer" }} onClick={onClickPrev}>Previous</button>
                </div>
                <p>Per Page: 10</p>
            </div>
        </div>

    )
}

export default TransactionTable