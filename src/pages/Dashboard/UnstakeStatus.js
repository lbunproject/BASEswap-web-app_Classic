import React, { useState, useEffect } from "react"
import "unstakestatus.css"
import useDashboardAPI from "rest/useDashboardAPI"

function UnstakeStatus() {
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const timestamp = Date.now() // Get the current timestamp and use for cache-Busting
      const url = `https://raw.githubusercontent.com/lbunproject/BASEswap-api-price/main/public/unstaked_plus_hashes.json?t=${timestamp}`
      const response = await fetch(url)
      const data = await response.json()
      setTableData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  // Function to generate table rows
  const renderTableRows = () => {
    return tableData.map((row, index) => (
      <tr key={index}>
        <td>{row.unstakeDate}</td>
        <td>{row.releaseDate}</td>
        <td>{row.baseBurned.toFixed(6)}</td>
        <td>{row.luncNetReleased.toFixed(6)}</td>
        <td>{row.rate.toFixed(3)}</td>
        <td>{row.sendTo}</td>
        <td dangerouslySetInnerHTML={{ __html: row.txHashUnstake }} />
        <td dangerouslySetInnerHTML={{ __html: row.txHashToUser }} />
      </tr>
    ))
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Unstake Date</th>
              <th>Release Date</th>
              <th>BASE Burned</th>
              <th>LUNC Released</th>
              <th>Rate</th>
              <th>Send to</th>
              <th>Unstake Hash</th>
              <th>Release Hash</th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>
    </div>
  )
}

export default UnstakeStatus
