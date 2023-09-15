const Header = ({course}) => {

    return (<div>
        <h1> {course}</h1>
    </div>)
}

const Content = function ({parts}) {
    return (
        < div>
            {parts.map(({name, exercises}) => {
                return <Part key={name} part={name} exercises={exercises}/>
            })}
        </div>
    )
}

const Part = function ({part, exercises}) {
    return (
        <p> {part} {exercises} </p>
    )
}

const Total = function ({parts}) {

    let total = parts.reduce((acc, {exercises}) => acc + exercises, 0)
    return (<div>
            <p>Number of exercises {total}</p>
        </div>
    )
}

const Course = function ({course}) {

    return (
        <>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </>
    )
}

export default Course