import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({value, text}) => {
  return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [bad, setBad] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [all, setAll] = useState(0)

  const handleBadCounter = () => {
    const updatedCounter = bad + 1
    setBad(updatedCounter)
    setAll(good + neutral + updatedCounter)
  }
  const handleNeutralCounter = () => {
    const updatedCounter = neutral + 1
    setNeutral(updatedCounter)
    setAll(good + bad + updatedCounter)
  }
  const handleGoodCounter = () => {
    const updatedCounter = good + 1
    setGood(updatedCounter)
    setAll(neutral + bad + updatedCounter)
  }

  const handleAverage = () => (good - bad) / all
  const handlePercentage = () => ((good / all) * 100) + " %"
  
  if (good === 0 && bad === 0 && neutral === 0) {
    return (
      <div>

      <h1>give feedback</h1>
      <Button onClick={handleGoodCounter} text="good" />
      <Button onClick={handleNeutralCounter} text="neutral"/>
      <Button onClick={handleBadCounter} text="bad"/>
      <h1>statistics</h1>
      <li>No feedback given</li>
      </div>
  )}
  return (
    <div>

    <h1>give feedback</h1>
    <Button onClick={handleGoodCounter} text="good" />
    <Button onClick={handleNeutralCounter} text="neutral"/>
    <Button onClick={handleBadCounter} text="bad"/>
    <h1>statistics</h1>
    <table>
      <StatisticLine value={good} text="good"/>
      <StatisticLine value={neutral} text="neutral"/>
      <StatisticLine value={bad} text="bad"/>
      <StatisticLine value={all} text="all" />
      <StatisticLine value={handleAverage()} text="average" />
      <StatisticLine value={handlePercentage()} text="positive" />
    </table>
    </div>
  )
}

export default App