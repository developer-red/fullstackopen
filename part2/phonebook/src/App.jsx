import {useEffect, useState} from 'react';
import './index.css'

import noteService from './noteDAO.jsx'


const Notification = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <div className='error'>
            {message}
        </div>
    )
}
const Filter = ({filterInput, setFilterInput}) => {
    console.log('Render: Filter Component');

    return (
        <>
            <div>
                Filter by name: <input value={filterInput} onChange={(e) => {
                console.log('Filter input changed:', e.target.value);
                setFilterInput(e.target.value);
            }}/>
            </div>
        </>
    );
};

const Display = ({filteredPersons, persons, setPersons, setErrorMessage}) => {  // noteService passed as a prop, if needed
    console.log('Render: Display Component', filteredPersons);

    return (
        <>
            <h2>Numbers</h2>
            {filteredPersons.map(({name, phone, id}) => (
                <div key={id}>
                    <p>{name} {phone}</p>
                    <button onClick={() => {
                        if (window.confirm(`Confirm deletion of ${name}`)) {
                            noteService.deleteEntry(id).catch((error) => {
                                setErrorMessage(error.message)

                                setTimeout(
                                    () => setErrorMessage(null)
                                    , 5000)
                            })
                            setPersons(persons.filter((person) => person.id !== id))
                        }

                    }}>Delete
                    </button>
                </div>
            ))}
        </>
    );
};


const Form = ({persons, setPersons, setErrorMessage}) => {
    console.log('Render: Form Component');

    const [nmInput, setNmInput] = useState('');
    const [phInput, setPhInput] = useState('');

    const onSubmitForm = (e) => {
        e.preventDefault();
        console.log('Form submitted:', nmInput, phInput);

        // Search for existing entry
        const existingEntry = persons.find(({name}) => name?.toLowerCase() === nmInput?.toLowerCase())

        // existing entry found, prompt for overwrite
        if (existingEntry) {
            if (window.confirm(`${existingEntry.name} is already added to the phonebook, replace the old number with a new one?`)) {

                const updatedEntry = {...existingEntry, phone: phInput}
                noteService.updateEntry(existingEntry.id, updatedEntry)
                setPersons(persons.map((person) => {
                    if (person.id === updatedEntry.id) {
                        return updatedEntry
                    } else {
                        return person
                    }
                }))
                setErrorMessage(`UPDATED: ${nmInput}'s phone number!`)
                setTimeout(
                    () => setErrorMessage(null)
                    , 5000)
            } else {
                return;
            }
        } else {
            noteService.postEntry({name: nmInput, phone: phInput}).then(
                (data) => {
                    const newPersons = persons.concat(data);
                    console.log('New persons array:', newPersons);
                    setPersons(newPersons);
                    setErrorMessage(`ADDED: ${nmInput} to the phonebook!`)
                    setTimeout(
                        () => setErrorMessage(null)
                        , 5000)
                }
            ).catch((error) => {
                setErrorMessage(error.message)

                setTimeout(
                    () => setErrorMessage(null)
                    , 5000)
            })
        }

        // Clear form inputs after processing is complete
        setNmInput('');
        setPhInput('');
    };

    return (
        <form onSubmit={onSubmitForm}>
            <div>
                name: <input value={nmInput} onChange={(e) => setNmInput(e.target.value)}/>
            </div>
            <div>
                phone: <input value={phInput} onChange={(e) => setPhInput(e.target.value)}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
};

const App = () => {
    console.log('Render: App Component');

    const [persons, setPersons] = useState([]);
    const [filterInput, setFilterInput] = useState('');
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null)


    // get data on initial load
    useEffect(
        () => {
            noteService.getEntries().then(data => setPersons(data))
        }, []
    )

    useEffect(() => {
        console.log('Running useEffect:', filterInput, persons);
        setFilteredPersons(persons.filter(({name}) => name.toLowerCase().includes(filterInput.toLowerCase())));
    }, [filterInput, persons]);

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={errorMessage}/>
            <h2>Filter</h2>
            <Filter filterInput={filterInput} setFilterInput={setFilterInput}/>
            <h2>Add New Person</h2>
            <Form persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage}/>
            <Display filteredPersons={filteredPersons} persons={persons} setPersons={setPersons}
                     setErrorMessage={setErrorMessage}/>
        </div>
    );
};

export default App;
