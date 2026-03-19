import { useState } from 'react';
import './App.css'

interface MyFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function MyForm({ onSubmit }: MyFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <label>Name:</label><br />
      <input name='name' type='text'/><br />
      <label>Age:</label><br />
      <input name='age' type='number'/><br />
      <label>Income:</label><br />
      <input name='income' type='number'/><br />
      <label>Expenses:</label><br />
      <input name='expenses' type='number'/><br />
      <button type='submit'>Simulate</button>
    </form>
  )
}

function App() {
  const [message, setMessage] = useState('default');

  const submitData = async (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()

    const data = new FormData(submitEvent.currentTarget);
    const values = Object.fromEntries(data);
    console.log(values);

    try {
      const response = await fetch("http://127.0.0.1:8000/simulate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Network response was no ok");
      }

      const result = await response.json();
      console.log(result.payload.income - result.payload.expenses);
      setMessage('Success! Data posted: ' + result.payload);
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  return (
    <>
      <MyForm onSubmit={submitData} />
      <p>{message}</p>
    </>
  )
}

export default App
