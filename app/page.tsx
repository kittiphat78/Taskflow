"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          TaskFlow ✨
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-2">
          จัดการงานของคุณอย่างมีประสิทธิภาพ
        </p>
        <p className="text-gray-500">ด้วยคุณสมบัติที่สมบูรณ์และใช้งานง่าย</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h3 className="font-semibold text-gray-800 mb-2">ล็อกอินปลอดภัย</h3>
          <p className="text-gray-600 text-sm">
            ข้อมูลของคุณได้รับการเข้ารหัสและปลอดภัย
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-4xl mb-3">🗄️</div>
          <h3 className="font-semibold text-gray-800 mb-2">ข้อมูลมีการสำรองไว้</h3>
          <p className="text-gray-600 text-sm">
            ข้อมูลของคุณจัดเก็บในฐานข้อมูล PostgreSQL
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-4xl mb-3">🏷️</div>
          <h3 className="font-semibold text-gray-800 mb-2">แท็กและความสำคัญ</h3>
          <p className="text-gray-600 text-sm">
            จัดแบ่งงานตามหมวดหมู่และระดับความสำคัญ
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-800 mb-2">Dashboard สถิติ</h3>
          <p className="text-gray-600 text-sm">
            ติดตามความก้าวหน้าของงานของคุณ
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg"
        >
          เข้าสู่ระบบ
        </Link>
        <Link
          href="/register"
          className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg border-2 border-blue-200"
        >
          สมัครสมาชิก
        </Link>
      </div>
    </main>
  )
}