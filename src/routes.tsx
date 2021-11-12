import { lazy } from 'react'
import Layout from 'views/layout'


const Dashboard = lazy(() => import('./components/dashboard'))
const Loading = lazy(() => import('./components/loading'))
const Users = lazy(() => import('./components/users'))
const AddUserForm = lazy(() => import('./components/add-user'))
const EditUser = lazy(() => import('./components/edit-user'))
const Projects = lazy(() => import('./components/projects'))
const AddProject = lazy(() => import('./components/add-project/index'))
const EditProject = lazy(() => import('./components/edit-project'))
const EditProfile = lazy(() => import('./components/edit-profile'))
const Departments = lazy(() => import('./components/departments'))
const AddDepartment = lazy(() => import('./components/add-department'))
const EditDepartment = lazy(() => import('./components/edit-department'))
const AddAnnouncement = lazy(() => import('./components/add-announcement'))
const EditAnnouncement = lazy(() => import('./components/edit-announcement'))
const AnnouncementView = lazy(() => import('./components/view-annoucment'))
const Announcements = lazy(() => import('./components/announcement'))
const MyAnnouncements = lazy(() => import('./components/user-announcement'))

export const appRoutes = [
    { path: '/', component: Layout, exact: false, private: true },
]

export const layoutRoutes = [
    { path: '/dashboard', component: Dashboard, exact: true, private: false },
    { path: '/loading', component: Loading, exact: true, private: false },
    { path: '/users', component: Users, exact: true, private: false },
    { path: '/add-user', component: AddUserForm, exact: true, private: false },

    { path: '/edit-user/:id?', component: EditUser, exact: true, private: false },

    { path: '/projects', component: Projects, exact: true, private: false },
    { path: '/add-project', component: AddProject, exact: true, private: false },
    { path: '/edit-project/:id?', component: EditProject, exact: true, private: false },
    { path: '/edit-profile', component: EditProfile, exact: true, private: false },
    { path: '/departments', component: Departments, exact: true, private: false },
    { path: '/add-department', component: AddDepartment, exact: true, private: false },
    { path: '/edit-department/:id?', component: EditDepartment, exact: true, private: false },

    { path: '/announcements',  component: Announcements, exact: true, private: false },
    { path: '/add-announcement', component: AddAnnouncement, exact: true, private: false },
    { path: '/edit-announcement/:id?', component: EditAnnouncement, exact: true, private: false },
    { path: '/announcements/:id?', component: AnnouncementView, exact: true, private: false },
    { path: '/my-announcement', component:MyAnnouncements, exact: true , private:false }
]

