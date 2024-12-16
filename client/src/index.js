import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import your App component
import { AuthProvider } from './context/AuthContext'; // If you have an Auth context

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App /> {/* No additional Router here */}
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
); 