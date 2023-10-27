import React from 'react';
import TodoList from './TodoList';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <TodoList />
      </div>
    </ErrorBoundary>
  );
}

export default App;