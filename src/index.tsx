import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './screens/Home';
import { createBrowserRouter, RouterProvider,  } from 'react-router-dom';
import Result, {loader as resultLoader, ResultErrorElement} from './screens/Result';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/result',
    element: <Result/>,
    loader: resultLoader,
    errorElement: <ResultErrorElement />
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
