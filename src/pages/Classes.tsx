import { useEffect, useState } from 'react'
import api from '../services/api'

interface Student {
  id: string
  name: string
}

interface Class {
  id: string
  scheduledAt: string
  status: string
  reminderSent: boolean
  student: Student
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [studentId, setStudentId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  async function loadData() {
    const [classesRes, studentsRes] = await Promise.all([
      api.get('/classes'),
      api.get('/students')
    ])
    setClasses(classesRes.data)
    setStudents(studentsRes.data)
  }

  async function handleCreate() {
    if (!studentId || !scheduledAt) return
    await api.post('/classes', {
      studentId,
      scheduledAt: new Date(scheduledAt).toISOString()
    })
    setStudentId('')
    setScheduledAt('')
    loadData()
  }

  async function handleDelete(id: string) {
    await api.delete(`/classes/${id}`)
    loadData()
  }

  useEffect(() => {
  loadData()
  
  // Atualiza a cada 10 segundos automaticamente
  const interval = setInterval(loadData, 10000)
  
  return () => clearInterval(interval)
}, [])

  function formatDate(date: string) {
    return new Date(date).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function statusColor(status: string) {
    if (status === 'confirmed') return 'text-green-500'
    if (status === 'cancelled') return 'text-red-500'
    return 'text-yellow-500'
  }

  function statusLabel(status: string) {
    if (status === 'confirmed') return 'Confirmado'
    if (status === 'cancelled') return 'Cancelado'
    return 'Pendente'
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Aulas</h1>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Nova Aula</h2>
        <select
          className="border rounded-lg p-2 w-full mb-3"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
        >
          <option value="">Selecione um aluno</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input
          className="border rounded-lg p-2 w-full mb-3"
          type="datetime-local"
          value={scheduledAt}
          onChange={e => setScheduledAt(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
          onClick={handleCreate}
        >
          Agendar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Aulas Agendadas</h2>
        {classes.length === 0 && <p className="text-gray-400">Nenhuma aula agendada.</p>}
        {classes.map(cls => (
          <div key={cls.id} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="font-medium">{cls.student.name}</p>
              <p className="text-sm text-gray-500">{formatDate(cls.scheduledAt)}</p>
              <p className={`text-sm font-medium ${statusColor(cls.status)}`}>
                {statusLabel(cls.status)}
              </p>
            </div>
            <button
              className="text-red-500 hover:text-red-700 text-sm"
              onClick={() => handleDelete(cls.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}