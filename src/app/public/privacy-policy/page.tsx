// Next.js의 메타데이터 타입을 가져옵니다. 페이지 제목 등을 설정하는 데 사용됩니다.
import type { Metadata } from 'next';

// 페이지의 메타데이터를 정의합니다. 브라우저 탭에 표시될 제목을 설정합니다.
export const metadata: Metadata = {
  title: '트래블와이저 개인정보 처리방침',
};

// 개인정보 처리방침 페이지를 위한 리액트 컴포넌트입니다.
const PrivacyPolicyPage = () => {
  return (
    // 페이지 전체를 감싸는 메인 컨테이너입니다. Tailwind CSS 클래스를 사용하여 스타일을 적용합니다.
    // font-apple-sd: 기본 글꼴 설정
    // bg-gray-50: 아주 연한 회색 배경
    // text-gray-800: 기본 텍스트 색상
    // p-10: 전체에 2.5rem (40px) 패딩 적용
    // max-w-4xl: 최대 너비를 56rem (896px)으로 제한
    // mx-auto: 좌우 마진을 자동으로 설정하여 가운데 정렬
    <div className="font-apple-sd bg-gray-50 text-gray-800 p-10 max-w-4xl mx-auto">
      
      {/* 페이지의 주 제목입니다. */}
      {/* text-3xl: 글자 크기를 1.875rem으로 설정 */}
      {/* font-bold: 글자를 굵게 만듭니다. */}
      {/* mb-6: 아래쪽 마진을 1.5rem (24px)으로 설정 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🛡️ 트래블와이저 개인정보 처리방침</h1>

      {/* 도입부 단락입니다. */}
      {/* mt-4: 위쪽 마진을 1rem (16px)으로 설정 */}
      {/* text-base: 기본 글자 크기 */}
      {/* leading-relaxed: 줄 간격을 넓게 설정 */}
      <p className="mt-4 text-base leading-relaxed">
        트래블와이저(이하 “당사”)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 본 개인정보 처리방침은 당사가 어떤 정보를 수집하고, 어떻게 이용하며, 어떤 방식으로 보호하는지를 설명합니다.
      </p>

      {/* 각 섹션을 구분하기 위한 <section> 태그입니다. */}
      {/* mt-10: 위쪽 마진을 2.5rem (40px)으로 설정 */}
      <section className="mt-10">
        {/* 섹션의 소제목입니다. */}
        {/* text-2xl: 글자 크기를 1.5rem으로 설정 */}
        {/* font-semibold: 글자를 세미-볼드로 만듭니다. */}
        {/* mb-4: 아래쪽 마진을 1rem (16px)으로 설정 */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 수집하는 개인정보 항목</h2>
        
        {/* 테이블이 화면 너비를 초과할 경우 스크롤을 생성하기 위한 div입니다. */}
        <div className="overflow-x-auto mt-4">
          {/* 정보 항목을 표시하는 테이블입니다. */}
          {/* w-full: 너비를 100%로 설정 */}
          {/* border-collapse: 테이블 테두리를 한 줄로 합칩니다. */}
          {/* border: 테두리를 추가합니다. */}
          <table className="w-full border-collapse border border-gray-300">
            {/* 테이블 헤더 그룹입니다. */}
            <thead>
              <tr>
                {/* 테이블 헤더 셀(th)입니다. */}
                <th className="border border-gray-300 p-3 text-left bg-gray-100">구분</th>
                <th className="border border-gray-300 p-3 text-left bg-gray-100">수집 항목</th>
              </tr>
            </thead>
            {/* 테이블 본문 그룹입니다. */}
            <tbody>
              {/* 테이블의 각 행(row)입니다. */}
              <tr>
                {/* 테이블 데이터 셀(td)입니다. */}
                <td className="border border-gray-300 p-3">필수</td>
                <td className="border border-gray-300 p-3">이메일 주소 (이메일 회원가입 또는 소셜 로그인 시)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">선택</td>
                <td className="border border-gray-300 p-3">없음</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">자동 수집</td>
                <td className="border border-gray-300 p-3">서비스 이용 기록(위시리스트 생성, 숙소 가격 추적 요청 등)</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 부가 설명 단락입니다. */}
        <p className="mt-4 text-sm text-gray-600">※ 당사는 이름, 생년월일, 성별, 주소, 연락처 등 민감한 개인정보를 수집하지 않습니다.</p>
      </section>

      {/* 2번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 개인정보 수집 방법</h2>
        {/* <br> 태그를 사용하지 않고, 각 줄을 별도의 <p> 태그나 <div>로 감싸는 것이 시맨틱적으로 더 좋습니다. */}
        <p className="leading-relaxed">- 회원가입 및 로그인 과정에서 사용자가 직접 입력 또는 <strong>소셜 로그인(Google, Apple, Kakao 등)</strong>을 통해 제공받음</p>
        <p className="leading-relaxed">- 서비스 이용 과정에서 자동으로 생성되는 정보 수집</p>
      </section>

      {/* 3번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 개인정보의 수집 및 이용 목적</h2>
        {/* 목록(ul)입니다. */}
        {/* list-disc: 기본 디스크 형태의 불릿을 사용합니다. */}
        {/* list-inside: 불릿을 리스트 아이템 내부에 위치시킵니다. */}
        {/* space-y-2: 자식 요소들 사이에 수직 간격을 0.5rem (8px)으로 설정합니다. */}
        <ul className="list-disc list-inside space-y-2">
          <li>회원 식별 및 인증</li>
          <li>사용자 맞춤형 기능 제공 (위시리스트 저장, 가격 알림 등)</li>
          <li>서비스 개선 및 사용자 통계 분석</li>
        </ul>
      </section>

      {/* 4번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 개인정보 보유 및 이용 기간</h2>
        <p className="leading-relaxed">- 회원 탈퇴 시 개인정보는 <strong>지체 없이 파기</strong>됩니다.</p>
        <p className="leading-relaxed">- 위시리스트 및 가격 트래킹 관련 데이터도 함께 삭제됩니다.</p>
        <p className="leading-relaxed">- 단, 관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 법령을 따릅니다.</p>
      </section>

      {/* 5번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 개인정보 제3자 제공</h2>
        <p className="leading-relaxed">당사는 이용자의 개인정보를 <strong>외부에 제공하지 않으며</strong>, 법령에 따라 필요한 경우에만 제한적으로 제공합니다.</p>
      </section>

      {/* 6번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 개인정보 처리 위탁</h2>
        <p className="leading-relaxed">당사는 현재 개인정보 처리를 외부에 위탁하고 있지 않습니다. 향후 위탁이 발생할 경우, 위탁 대상과 범위에 대해 사전 고지 및 동의를 받겠습니다.</p>
      </section>

      {/* 7번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 이용자의 권리와 행사 방법</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>본인의 개인정보 열람, 수정, 삭제 요청</li>
          <li>회원 탈퇴 및 개인정보 처리 정지 요청</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">※ 앱 또는 고객센터를 통해 요청 가능합니다.</p>
      </section>

      {/* 8번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 개인정보 보호를 위한 조치</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>이메일 및 소셜 로그인 정보 암호화 저장</li>
          <li>서버 접근 통제 및 내부 권한 관리</li>
          <li>정기적인 보안 점검 및 백업 시스템 운영</li>
        </ul>
      </section>

      {/* 9번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 개인정보 보호책임자</h2>
        <div className="leading-relaxed">
          {/* <br> 태그 대신 각 줄을 <div>나 <p>로 분리합니다. */}
          <div>- 개인정보 보호책임자: 안재현</div>
          <div>- 이메일: whatsyourbeem@gmail.com</div>
        </div>
      </section>

      {/* 10번 섹션 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 정책 변경 고지</h2>
        <p className="leading-relaxed">이 개인정보 처리방침은 법령 변경 또는 서비스 개선에 따라 변경될 수 있으며, 변경 시 앱 내 공지사항을 통해 고지합니다.</p>
        <p className="mt-6 font-semibold">시행일자: 2025년 4월 11일</p>
      </section>

    </div>
  );
};

// 컴포넌트를 내보내 다른 파일에서 사용할 수 있게 합니다.
export default PrivacyPolicyPage;