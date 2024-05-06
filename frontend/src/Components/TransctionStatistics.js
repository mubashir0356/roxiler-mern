import { useState, useEffect } from "react"
import "./TransctionStatistics.css"

function TransctionStatistics({ selectedMonth }) {

    const [statsticsData, setStatsticsData] = useState({})

    const fetchtransactionsStatisctics = async () => {
        try {
            const options = {
                method: "GET"
            }
            const res = await fetch(`${process.env.REACT_APP_IP_ADDRESS}/getmonthstatisctics?month=${selectedMonth}`, options)
            const data = await res.json()
            setStatsticsData(data)
            console.log("statsticsData", data)

        } catch (error) {
            console.log("error while fetchting statistics", error)
        }
    }

    useEffect(() => {
        fetchtransactionsStatisctics()
    }, [selectedMonth])


    return (
        <div className="transaction-statics">
            <h2>Statistics - {selectedMonth}</h2>
            <div className="total-items-details">
                <div>
                    <p>Total sale</p>
                    <p>Total sold item</p>
                    <p>Total not sold item</p>
                </div>
                <div style={{ marginLeft: "10px" }}>
                    <p>{Math.ceil(statsticsData?.soldData?.totalSales)}</p>
                    <p>{statsticsData?.soldData?.transactionCount}</p>
                    <p>{statsticsData?.unSoldData?.transactionCount}</p>
                </div>
            </div>
        </div>
    )
}

export default TransctionStatistics