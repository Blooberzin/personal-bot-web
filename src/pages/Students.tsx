import { useEffect, useState } from 'react'
import api from '../services/api'

interface Student {
  id: string
  name: string
  phone: string
  active: boolean
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  async function loadStudents() {
    const response = await api.get('/students')
    setStudents(response.data)
  }

  async function handleCreate() {
    if (!name || !phone) return
    await api.post('/students', { name, phone })
    setName('')
    setPhone('')
    loadStudents()
  }

  async function handleDelete(id: string) {
    await api.delete(`/students/${id}`)
    loadStudents()
  }

  useEffect(() => {
    loadStudents()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Alunos</h1>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Novo Aluno</h2>
        <input
          className="border rounded-lg p-2 w-full mb-3"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border rounded-lg p-2 w-full mb-3"
          placeholder="WhatsApp (ex: 5511999999999)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600"
          onClick={handleCreate}
        >
          Cadastrar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Lista de Alunos</h2>
        {students.length === 0 && <p className="text-gray-400">Nenhum aluno cadastrado.</p>}
        {students.map(student => (
          <div key={student.id} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-500">{student.phone}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700 text-sm"
              onClick={() => handleDelete(student.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}