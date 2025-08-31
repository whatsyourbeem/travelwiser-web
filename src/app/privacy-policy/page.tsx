
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '트래블와이저 개인정보 처리방침',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="font-apple-sd bg-gray-50 text-gray-800 p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">🛡️ 트래블와이저 개인정보 처리방침</h1>

      <p className="mt-4">
        트래블와이저(이하 “당사”)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 본 개인정보 처리방침은 당사가 어떤 정보를 수집하고, 어떻게 이용하며, 어떤 방식으로 보호하는지를 설명합니다.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-800">1. 수집하는 개인정보 항목</h2>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2.5 text-left">구분</th>
                <th className="border border-gray-300 p-2.5 text-left">수집 항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2.5">필수</td>
                <td className="border border-gray-300 p-2.5">이메일 주소 (이메일 회원가입 또는 소셜 로그인 시)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2.5">선택</td>
                <td className="border border-gray-300 p-2.5">없음</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2.5">자동 수집</td>
                <td className="border border-gray-300 p-2.5">서비스 이용 기록(위시리스트 생성, 숙소 가격 추적 요청 등)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">※ 당사는 이름, 생년월일, 성별, 주소, 연락처 등 민감한 개인정보를 수집하지 않습니다.</p>
      </section>

      {/* ... 이하 생략 ... */}

    </div>
  );
};

export default PrivacyPolicyPage;
