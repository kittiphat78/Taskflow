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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative text-center mb-16 z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl mb-8 shadow-2xl shadow-amber-500/30 animate-float">
          <span className="text-5xl">✦</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-slate-200 bg-clip-text text-transparent">
            TaskFlow
          </span>
          <br />
          <span className="bg-gradient-to-r from-slate-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
            Elite
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-3 font-light">
          จัดการงานของคุณอย่างมืออาชีพ
        </p>
        <p className="text-slate-400 text-lg font-light max-w-xl mx-auto">
          ระบบจัดการงานที่ทรงพลัง พร้อมฟีเจอร์ครบครันและการออกแบบที่หรูหรา
        </p>
      </div>

      {/* Features Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-16 z-10">
        <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 rounded-2xl shadow-2xl p-8 text-center transition-all duration-300 hover:shadow-amber-500/10 hover:-translate-y-1">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-100 mb-3 text-lg">ปลอดภัยสูงสุด</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            ข้อมูลของคุณได้รับการเข้ารหัสและปกป้องด้วยระบบรักษาความปลอดภัยระดับสูง
          </p>
        </div>

        <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 rounded-2xl shadow-2xl p-8 text-center transition-all duration-300 hover:shadow-amber-500/10 hover:-translate-y-1">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-100 mb-3 text-lg">สำรองข้อมูลอัตโนมัติ</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            ข้อมูลจัดเก็บใน PostgreSQL พร้อมระบบสำรองข้อมูลอัตโนมัติ ไม่ต้องกังวลเรื่องข้อมูลสูญหาย
          </p>
        </div>

        <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 rounded-2xl shadow-2xl p-8 text-center transition-all duration-300 hover:shadow-amber-500/10 hover:-translate-y-1">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-100 mb-3 text-lg">จัดระเบียบอัจฉริยะ</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            แท็กและกำหนดระดับความสำคัญ จัดแบ่งงานตามหมวดหมู่ได้อย่างมีประสิทธิภาพ
          </p>
        </div>

        <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 rounded-2xl shadow-2xl p-8 text-center transition-all duration-300 hover:shadow-amber-500/10 hover:-translate-y-1">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-100 mb-3 text-lg">วิเคราะห์ประสิทธิภาพ</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Dashboard แสดงสถิติและความก้าวหน้า ช่วยให้คุณเห็นภาพรวมการทำงานได้ชัดเจน
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="relative flex flex-col sm:flex-row gap-4 z-10">
        <Link
          href="/login"
          className="group relative px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all shadow-2xl hover:shadow-amber-500/30 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            เข้าสู่ระบบ
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-white/20 to-amber-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Link>
        
        <Link
          href="/register"
          className="group relative px-10 py-4 bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-600/50 hover:border-amber-500/50 text-slate-200 hover:text-white rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            สมัครสมาชิก
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </span>
        </Link>
      </div>

      {/* Footer Info */}
      <div className="relative mt-16 text-center z-10">
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-light">ใช้งานฟรี</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-light">ไม่มีโฆษณา</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-light">ปลอดภัย 100%</span>
          </div>
        </div>
        <p className="text-slate-500 text-sm font-light">
          เข้าร่วมกับผู้ใช้งานหลายพันคนที่เชื่อมั่นใน TaskFlow Elite
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}