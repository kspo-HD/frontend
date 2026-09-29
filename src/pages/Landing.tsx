import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  {
    icon: '🗺️',
    title: '전국 시설 지도',
    desc: '전국 5만여 개 피트니스 시설의 위치, 업종, 운영 상태를 지도에서 한눈에 확인하세요.',
  },
  {
    icon: '📊',
    title: '창업 입지 분석',
    desc: '원하는 위치와 반경을 설정하면 경쟁 강도, 폐업률, 공공시설 압박 등을 종합한 입지 점수를 제공합니다.',
  },
  {
    icon: '📂',
    title: '공공 데이터 환원',
    desc: '국민체육진흥공단·체육시설업 등록 데이터를 정제하여 누구나 활용할 수 있도록 공개합니다.',
  },
];

const stats = [
  { value: '12,847', label: '등록 운동시설' },
  { value: '17개', label: '광역시·도 전체' },
  { value: '42,000+', label: '공개 운동 데이터 건수' },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0F1B3C] text-white py-24 px-6 text-center flex flex-col items-center gap-6">
        <p className="text-sm text-blue-300 tracking-widest uppercase">피트니스 창업자를 위한 데이터</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
          내 창업 지역에 경쟁 시설이<br />얼마나 있을까?
        </h1>
        <p className="text-gray-300 text-base max-w-xl leading-relaxed">
          전국 피트니스 시설 데이터 기반으로 입지를 분석하고, AI + 공공 데이터로 창업 점수를 산정해 드립니다.
        </p>
        <div className="flex gap-3 mt-2">
          <Link
            to="/map"
            className="bg-[#3B6FD4] text-white px-6 py-3 rounded-md font-medium hover:bg-[#2e5ec0] transition-colors"
          >
            지도로 시설 탐색
          </Link>
          <Link
            to="/login"
            className="border border-gray-400 text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
          >
            창업분석 시작하기
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-12">주요 기능</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-bold text-[#3B6FD4]">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1B3C] text-gray-400 py-8 px-6 text-center text-sm mt-auto">
        <span className="font-semibold text-white mr-4">FitMap</span>
        피트니스 창업 입지 분석 서비스 · 데이터 출처: 국민체육진흥공단, 체육시설업 공공데이터
      </footer>
    </div>
  );
}
