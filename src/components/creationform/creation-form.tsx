import React, { useState } from 'react';
import './creation-form.css';

function CreationForm() {
  const [count, setCount] = useState(0)
  
  function test2(x: string): number {
    console.log(x)
    console.log(parseInt(x))
    return parseInt(x)//parseInt(x)
  }
  return (
    <div className="creation-form">
      <header className="creation-form-header">
        <p onClick={() => setCount(test2(count + "8" + 1))}>
          Edit <code>src/creation-form.tsx</code> and save { count } to reload.
        </p>
        <a
          className="creation-form-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default CreationForm;
