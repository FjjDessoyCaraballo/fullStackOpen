import Part from './Part'

const Header = ({ header }) => <h2>{header}</h2>

const Total = ({ total }) => <p><strong>Total exercises: {total}</strong></p> 

const Course = ({ course }) => {
    const total = course.parts.reduce((s, p) => { return s + p.exercises}, 0)

    return (
        <div>
            <Header header={course.name} />
            {course.parts.map(part => 
                <Part key={part.id} part={part} />
                )}
            <Total total={total} />
        </div>
    )
}

export default Course