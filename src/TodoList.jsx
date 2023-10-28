import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import axios from 'axios';
import './App.css';

const LoadingComponent = () => {
  return (
    <div className="loading-container">
      <div className="loading-text">Loading...</div>
    </div>
  );
};

const Table = ({
    tasks,
    newTask,
    setNewTask,
    addTask,
    reloadPage,
    handleInputKeyPress
  }) => {
    const columns = React.useMemo(
      () => [
        { Header: '#', accessor: 'id' },
        { Header: 'User', accessor: 'userId' },
        { Header: 'Description', accessor: 'title', className: 'description-column' },
        {
          Header: 'Completed',
          accessor: 'completed',
          Cell: ({ value }) => (value ? '✔️' : '❌')
        },
      ],
      []
    );
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      canPreviousPage,
      canNextPage,
      pageOptions,
      nextPage,
      previousPage,
      state: { pageIndex },
      gotoPage
    } = useTable(
      {
        columns,
        data: tasks,
        initialState: { pageIndex: 0 },
      },
      useSortBy,
      usePagination
    );
  
    return (
      <div className="container">
        <h1>Todo List</h1>
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <span className="page-info">
            Page {' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
  
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'← Prev'}
          </button>
          <span>
            {pageOptions.map((page, index) => (
              <button
                key={index}
                onClick={() => gotoPage(page)}
                className={pageIndex === page ? 'active' : ''}
              >
                {page + 1}
              </button>
            ))}
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'Next →'}
          </button>
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleInputKeyPress}
          />
          <button onClick={addTask}>Add new task</button>
          <button onClick={reloadPage}>Reload</button>
        </div>
      </div>
    );
  };
 
  

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const reloadPage = () => {
    setIsLoading(true);
    setTimeout(() => {
        const sortedTasks = [...tasks];
        sortedTasks.sort((a, b) => a.id - b.id);
        setTasks(sortedTasks);
        setIsLoading(false);
      }, 5000);
  };

const addTask = () => {
    if (newTask.trim() !== '') {
      const newId = tasks.length + 1;
      const newTaskObject = {
        id: newId,
        userId: Math.floor(Math.random() * 100),
        title: newTask,
        completed: false,
      };

      const newTasks = [newTaskObject, ...tasks];

      setTasks(newTasks);
      setNewTask('');
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        setHasError(true);
      });
  }, []);

  return (
      <div>
      {!isLoading && (
        <Table
          tasks={tasks}
          setTasks={setTasks}
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
          reloadPage={reloadPage}
          handleInputKeyPress={handleInputKeyPress}
          isLoading={isLoading}
        />
      )}
      {isLoading && <LoadingComponent />}
    </div>
  );
};

export default TodoList;
