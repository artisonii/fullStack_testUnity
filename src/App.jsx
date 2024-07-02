import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { add_request_details } from './Redux/actions/RequestDetailsActions';
import NetworkMonitor from './components/NetworkMonitor/NetworkMonitor';


const App = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts');
    fetch('https://jsonplaceholder.typicode.com/users');
  }, []);

  const filteredRequests = filterType === 'all'
    ? requests
    : requests.filter((req) => req.method.toLowerCase() === filterType);

  useEffect(() => {
    const handleInterceptedRequest = event => {
      if (event.data.type === 'INTERCEPTED_REQUEST') {
        console.log(event.data.detail)
        dispatch(add_request_details(event.data.detail))
      }
    };

    navigator.serviceWorker.addEventListener('message', handleInterceptedRequest);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleInterceptedRequest);
    };
  }, []);

  return (
    <div className="App">
      <NetworkMonitor />
    </div>
  );
};

export default App;
