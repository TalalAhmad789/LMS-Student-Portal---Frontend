import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import './index.css'
import App from './App.jsx'
import Dashboard from './components/Dashboard.jsx'
import Assignments from './components/Assignments.jsx'
import Attendance from './components/Attendance.jsx'
import Students from './components/Students.jsx'
import StudentLogin from './components/StudentLogin.jsx'
import Profile from './components/Profile.jsx'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Teacher from './components/Teacher.jsx'
import Lecture from './components/Lecture.jsx'
import Academics from './components/Academics.jsx'
import Applications from './components/Applications.jsx'
import Timetable from './components/Timetable.jsx'
import Learning from './components/Learning.jsx'
import Feedback from './components/Feedback.jsx'
import Mailbox from './components/Mailbox.jsx'
import Security from './components/Security.jsx'
import Access_And_Devices from './components/Access_And_Devices.jsx'
import Course from './components/Course.jsx'
import Settings from './components/Settings.jsx'
import Admin from './components/Admin.jsx'
import AttendanceMark from './components/AttendanceMark.jsx'
import EditAttendance from './components/EditAttendance.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import StudentPromotion from './components/StudentPromotion.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import TeacherLogin from './components/TeacherLogin.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<App />}>

      <Route path='/login' element={<StudentLogin />} ></Route>
      <Route path='/student/dashboard' element={<Dashboard />} ></Route>
      <Route path='/student/profile' element={<Profile />} ></Route>
      <Route path='/student/academics' element={<Academics />} ></Route>
      <Route path='/student/applications' element={<Applications />} ></Route>
      <Route path='/student/timetable' element={<Timetable />} ></Route>
      <Route path='/student/learning' element={<Learning />} ></Route>
      <Route path='/student/feedback' element={<Feedback />} ></Route>
      <Route path='/student/mailbox' element={<Mailbox />} ></Route>
      <Route path='/student/security' element={<Security />} ></Route>
      <Route path='/student/access_and_devices' element={<Access_And_Devices />} ></Route>

      <Route path='/teacher-fe7$nf!fd7/login' element={<TeacherLogin />}></Route>
      <Route path='/teacher/dashboard' element={<Dashboard />} ></Route>
      <Route path='/teacher/profile' element={<Profile />} ></Route>
      <Route path='/teacher/security' element={<Security />} ></Route>
      <Route path='/teacher/attendance' element={<Attendance />} ></Route>
      <Route path='/teacher/attendance/submit' element={<AttendanceMark />} ></Route>
      <Route path='/teacher/attendance/edit' element={<EditAttendance />} ></Route>

      <Route path='/admin-bh$d!f74d4/login' element={<AdminLogin />}></Route>
      <Route path='/admin/dashboard' element={<Dashboard />} />
      <Route path='/admin/profile' element={<Profile />} ></Route>
      <Route path='/admin/admins' element={<Admin />} />
      <Route path='/admin/students' element={<Students />} />
      <Route path='/admin/promotion' element={<StudentPromotion />} />
      <Route path='/admin/timetable' element={<Timetable />} />
      <Route path='/admin/attendance' element={<Attendance />} ></Route>
      <Route path='/admin/applications' element={<Applications />} />
      <Route path='/admin/assignments' element={<Assignments />} />
      <Route path='/admin/teachers' element={<Teacher />} />
      <Route path='/admin/security' element={<Security />} ></Route>
      <Route path='/admin/lecture' element={<Lecture />} />
      <Route path='/admin/course' element={<Course />} />
      <Route path='/admin/settings' element={<Settings />} />

    </Route>
  )
)

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <ThemeProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,


)
