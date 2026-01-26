import { useState } from 'react';
import './App.css'

function App() {
  const [message, setMessage] = useState('default');

  type SimResult = {
    net: number;
    // add more fields as they become necessary
  }

  type RequestState = 
    | {status: "idle"}
    | {status: "loading"}
    | {status: "success"; result: SimResult}
    | {status: "error"; errorMessage: string};

  const [state, setState] = useState<RequestState>({status: "idle"});

  const submitData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState({status: "loading"})

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());

    try {
      const response = await fetch("http://127.0.0.1:8000/simulate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: SimResult = await response.json();
      setState({status: "success", result})
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setState({status: "error", errorMessage: msg});
    }
  }

  function MyForm() {
    return (
      <>
        <form onSubmit={submitData}>
          <label>Name:</label><br />
          <input name='name' type='text'/><br />
          <label>Age:</label><br />
          <input name='age' type='number'/><br />
          <label>Income:</label><br />
          <input name='income' type='number'/><br />
          <label>Expenses:</label><br />
          <input name='expenses' type='number'/><br />

          <button type='submit' disabled={state.status === "loading"}>
            {state.status === "loading" ? "Running..." : "Simulate"} 
          </button>
        </form>

        {state.status === "idle" && <p>No results yet.</p>}
        {state.status === "loading" && <p>Running Simulation...</p>}
        {state.status === "success" && <p>Net: {state.result.net}</p>}
        {state.status === "error" && <p>Error: {state.errorMessage}</p>}
      </>
    )
  }

  return (
    <>
      <MyForm />
    </>
  )
}

export default App
