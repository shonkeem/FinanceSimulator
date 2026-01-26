import { useState } from 'react';
import './App.css'

type FormData = {
  name: string;
  age: string;
  income: string;
  expenses: string;
};

type MyFormProps = {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
};

function MyForm({ formData, onChange, onSubmit, isLoading} : MyFormProps) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <label>Name:</label><br />
        <input name='name' type="text" value={formData.name} onChange={onChange}/><br />
        <label>Age:</label><br />
        <input name='age' type="number" value={formData.age} onChange={onChange}/><br />
        <label>Income:</label><br />
        <input name='income' type="number" value={formData.income} onChange={onChange}/><br />
        <label>Expenses:</label><br />
        <input name='expenses' type="number" value={formData.expenses} onChange={onChange}/><br />

        <button type='submit' disabled={isLoading}>
          {isLoading ? "Running..." : "Simulate"} 
        </button>
      </form>
    </>
  )
}

type SimResult = {
  net: number;
  // add more fields as they become necessary
}

type RequestState = 
  | {status: "idle"}
  | {status: "loading"}
  | {status: "success"; result: SimResult}
  | {status: "error"; errorMessage: string};

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "18",
    income: "0",
    expenses: "0"
  })
  const [state, setState] = useState<RequestState>({status: "idle"});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({ ...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState({status: "loading"})

    try {
      const response = await fetch("http://127.0.0.1:8000/simulate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: SimResult = await response.json();
      setState({status: "success", result});
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setState({status: "error", errorMessage: msg});
    }
  };


  return (
    <>
      <MyForm 
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={state.status === "loading"}/>

      {state.status === "idle" && <p>No results yet.</p>}
      {state.status === "loading" && <p>Running Simulation...</p>}
      {state.status === "success" && <p>Net: {state.result.net}</p>}
      {state.status === "error" && <p>Error: {state.errorMessage}</p>}
    </>
  )
}

export default App
