const Footer = () => {
  return (
    <div>
      greeting app created by <a href='https://github.com/fjjdessoycaraballo'>fdessoy</a>
    </div>
  )
}

const App = () => {
  const now = new Date();
  const a = 10
  const b = 20
  console.log(now, a + b);
  const name = "King Charles VI"
  const age = 1000
  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>{a} plus {b} is {a + b}</p>
      <Hello name="Wabadub" age={13 + 23}/>
      <Hello name={name} age={age}/>
      <Footer />
    </div>
  )
}

const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name} and your age is {props.age}</p>
    </div>
  )
}

export default App