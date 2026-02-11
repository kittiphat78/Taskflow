"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Task = {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  dueDate?: string
  tags: Array<{ id: string; name: string; color: string }>
}

type Tag = {
  id: string
  name: string
  color: string
}

type Stats = {
  total: number
  completed: number
  pending: number
  highPriority: number
}

const priorityColors = {
  LOW: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border border-amber-200",
  HIGH: "bg-rose-50 text-rose-700 border border-rose-200",
  URGENT: "bg-purple-50 text-purple-700 border border-purple-200",
}

const priorityLabels = {
  LOW: "ต่ำ",
  MEDIUM: "ปกติ",
  HIGH: "สูง",
  URGENT: "เร่งด่วน",
}

const priorityIcons = {
  LOW: "○",
  MEDIUM: "◐",
  HIGH: "●",
  URGENT: "◆",
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [input, setInput] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM")
  const [dueDate, setDueDate] = useState("")
  const [search, setSearch] = useState("")
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks()
      fetchTags()
    }
  }, [session])

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks()
    }
  }, [search])

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (search) {
        params.append("search", search)
      }
      const url = search ? `/api/tasks?${params.toString()}` : "/api/tasks"
      
      const res = await fetch(url, {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
        updateStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setTags(data)
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    }
  }

  const updateStats = (taskList: Task[]) => {
    setStats({
      total: taskList.length,
      completed: taskList.filter((t) => t.completed).length,
      pending: taskList.filter((t) => !t.completed).length,
      highPriority: taskList.filter((t) => !t.completed && (t.priority === "HIGH" || t.priority === "URGENT")).length,
    })
  }

  const addTask = async () => {
    if (!input.trim()) return
    if (!dueDate) {
      alert("กรุณากำหนดวันเสร็จ")
      return
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: input,
          priority,
          dueDate: dueDate || null,
        }),
      })

      const data = await res.json()
      
      console.log("Task API Response:", { status: res.status, ok: res.ok, data })
      
      if (res.ok) {
        const newTask = data
        setTasks([...tasks, newTask])
        setInput("")
        setDueDate("")
        setPriority("MEDIUM")
        updateStats([...tasks, newTask])
      } else {
        const errorMessage = data?.error || `HTTP ${res.status}`
        console.error("Failed to add task - Status:", res.status, "Error:", errorMessage, "Data:", data)
        alert("เกิดข้อผิดพลาด: " + errorMessage)
      }
    } catch (error) {
      console.error("Failed to add task - Exception:", error instanceof Error ? error.message : String(error))
      alert("เกิดข้อผิดพลาด: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
          completed: !completed,
        }),
      })

      if (res.ok) {
        const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
        setTasks(updated)
        updateStats(updated)
      }
    } catch (error) {
      console.error("Failed to toggle task:", error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (res.ok) {
        const updated = tasks.filter((t) => t.id !== id)
        setTasks(updated)
        updateStats(updated)
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-slate-400 font-light">กำลังโหลด...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-2xl">✦</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-slate-200 bg-clip-text text-transparent">
                  TaskFlow Elite
                </h1>
                <p className="text-slate-400 text-sm mt-0.5 font-light">
                  {session?.user?.name || session?.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
              className="group relative px-6 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-300 shadow-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>ออกจากระบบ</span>
                <span className="text-xs">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/0 via-rose-600/10 to-rose-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-6 hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">งานทั้งหมด</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  {stats.total}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-6 hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">เสร็จสมบูรณ์</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                  {stats.completed}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-6 hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">กำลังดำเนินการ</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                  {stats.pending}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <span className="text-2xl">◐</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-6 hover:shadow-rose-500/10 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">เร่งด่วน</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-rose-200 to-rose-400 bg-clip-text text-transparent">
                  {stats.highPriority}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-xl flex items-center justify-center border border-rose-500/30">
                <span className="text-2xl">◆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Add Task Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                  <span className="text-xl">✦</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-200">เพิ่มงานใหม่</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">ชื่องาน</label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    placeholder="กรอกชื่องาน..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-slate-200 placeholder-slate-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">ระดับความสำคัญ</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-slate-200 transition-all appearance-none cursor-pointer"
                  >
                    <option value="LOW" className="bg-slate-800">○ ต่ำ</option>
                    <option value="MEDIUM" className="bg-slate-800">◐ ปกติ</option>
                    <option value="HIGH" className="bg-slate-800">● สูง</option>
                    <option value="URGENT" className="bg-slate-800">◆ เร่งด่วน</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    กำหนดเสร็จ <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-slate-200 transition-all"
                  />
                </div>

                <button
                  onClick={addTask}
                  disabled={!input.trim() || !dueDate}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-slate-700 disabled:to-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 disabled:shadow-none disabled:cursor-not-allowed disabled:text-slate-500"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>เพิ่มงาน</span>
                    <span className="text-sm">+</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Tasks */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search Box */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-6">
              <label className="block text-sm font-medium text-slate-400 mb-3">ค้นหางาน</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาด้วยชื่อหรือรายละเอียด..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-slate-200 placeholder-slate-500 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="px-5 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-slate-300 hover:text-white font-medium rounded-xl transition-all"
                  >
                    ล้าง
                  </button>
                )}
              </div>
            </div>

            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <span className="text-xl">◐</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-100">กำลังดำเนินการ</h2>
                    <p className="text-slate-400 text-sm font-light">{pendingTasks.length} งาน</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {pendingTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-2xl shadow-xl hover:shadow-2xl p-5 transition-all duration-300 overflow-hidden"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="relative mt-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id, task.completed)}
                            className="w-5 h-5 rounded-lg cursor-pointer bg-slate-900/50 border-2 border-slate-600 checked:bg-amber-500 checked:border-amber-500 transition-all appearance-none"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {task.completed && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-100 text-lg mb-1 break-words">{task.title}</h3>
                          {task.description && (
                            <p className="text-slate-400 text-sm mb-3 break-words">{task.description}</p>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium ${priorityColors[task.priority]}`}>
                              <span>{priorityIcons[task.priority]}</span>
                              <span>{priorityLabels[task.priority]}</span>
                            </span>
                            {task.dueDate && (
                              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50 font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{new Date(task.dueDate).toLocaleDateString("th-TH")}</span>
                              </span>
                            )}
                            {task.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="text-xs px-3 py-1.5 rounded-lg font-medium text-white shadow-lg"
                                style={{ backgroundColor: tag.color }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="flex-shrink-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 w-8 h-8 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-500/20"
                          title="ลบงาน"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                    <span className="text-xl">✓</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-100">เสร็จสมบูรณ์</h2>
                    <p className="text-slate-400 text-sm font-light">{completedTasks.length} งาน</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {completedTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 rounded-2xl shadow-lg hover:shadow-xl p-5 transition-all duration-300 overflow-hidden opacity-75 hover:opacity-90"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="relative mt-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id, task.completed)}
                            className="w-5 h-5 rounded-lg cursor-pointer bg-emerald-500 border-2 border-emerald-500 transition-all appearance-none"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-400 text-lg mb-1 line-through break-words">{task.title}</h3>
                          {task.description && (
                            <p className="text-slate-500 text-sm mb-3 line-through break-words">{task.description}</p>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium opacity-60 ${priorityColors[task.priority]}`}>
                              <span>{priorityIcons[task.priority]}</span>
                              <span>{priorityLabels[task.priority]}</span>
                            </span>
                            {task.dueDate && (
                              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-700/30 text-slate-400 border border-slate-600/30 font-medium opacity-60">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{new Date(task.dueDate).toLocaleDateString("th-TH")}</span>
                              </span>
                            )}
                            {task.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="text-xs px-3 py-1.5 rounded-lg font-medium text-white/70 shadow-lg opacity-60"
                                style={{ backgroundColor: tag.color }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="flex-shrink-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 w-8 h-8 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-500/20"
                          title="ลบงาน"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {pendingTasks.length === 0 && completedTasks.length === 0 && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-600/50">
                  <span className="text-5xl opacity-30">📭</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-2">ไม่พบงาน</h3>
                <p className="text-slate-500 font-light">เพิ่มงานใหม่หรือลองค้นหาด้วยคำอื่น</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}