
// import DashBoard from "./components/dashboard/dashboard"
// import Footer from "./components/footer/footer"
// import NavBar from "./components/navBar/navBar"

// import Login from "./containers/login"

// export default function App(){

//   return (
//     <div>
//       <Login/>
      
      
//       {/* <NavBar/> */}
//       {/* <DashBoard/> */}
//       {/* <Footer/> */}
     
      
//     </div>

//   )
// }

import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./containers/login"
import DashBoard from "./components/dashboard/dashboard"
import NavBar from "./components/navBar/navBar"
import Footer from "./components/footer/footer"
import ChatWidget from "./components/chatwidget/chatwidget"

export default function App() {
  return (
    <BrowserRouter>
      {/* NavBar visible sur toutes les pages (optionnel) */}
      <NavBar />
      <Routes>
        {/* <Route path="/" element={<ChatWidget />} /> */}
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/footer" element={<Footer/>} />
      </Routes>
    </BrowserRouter>
  )
}

// import { BrowserRouter, Routes, Route } from "react-router-dom"

// import Login from "./containers/login"
// import DashBoard from "./components/dashboard/dashboard"
// import Layout from "./Layout"

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Page SANS NavBar */}
//         <Route path="/" element={<Login />} />

//         {/* Pages AVEC NavBar */}
//         <Route element={<Layout />}>
//           <Route path="/dashboard" element={<DashBoard />} />
//         </Route>

//       </Routes>
//     </BrowserRouter>
//   )
// }

