import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Students from './pages/Students'
import Classes from './pages/Classes'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex gap-6">
          <h1 className="font-bold text-lg text-green-600">Personal Bot</h1>
          <Link to="/alunos" className="text-gray-600 hover:text-green-600">Alunos</Link>
          <Link to="/aulas" className="text-gray-600 hover:text-green-600">Aulas</Link>
        </nav>
        <Routes>
          <Route path="/alunos" element={<Students />} />
          <Route path="/aulas" element={<Classes />} />
          <Route path="/" element={<Students />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}