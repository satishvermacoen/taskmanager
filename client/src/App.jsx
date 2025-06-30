import React from 'react'
import{ BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import CreateTask from './pages/Admin/CreateTask';
import ManageTasks from './pages/Admin/ManageTasks';
import UserDashboard from './pages/User/UserDashboard';
import MyTask from './pages/User/MyTask';


function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/managetask' element={<ManageTasks />} />
          <Route path='/admin/createtask' element={<CreateTask />} />
          <Route path='/admin/manageuser' element={<ManageUsers />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path='/admin/dashboard' element={<UserDashboard />} />
          <Route path='/admin/task' element={<MyTask />} />
          <Route path='/admin/task-details/:id' element={<ViewTaskDetails />} />
        </Route>


      </Routes>
    </Router>
    </div>
  )
}

export default App
