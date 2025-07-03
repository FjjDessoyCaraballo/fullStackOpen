const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.content}</p>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>{props.value}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Part content={part1} />
      <Part content={part2} />
      <Part content={part3} />
      <Total value={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App
