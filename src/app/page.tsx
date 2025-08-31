import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white">
      {/* 상단 로고 바 */}
      <header className="bg-[#38306a] p-2.5 flex items-center justify-center gap-2">
        <Image src="/img/appicon.png" alt="앱 로고" width={28} height={28} />
        <h1 className="font-poppins text-lg font-bold text-white">TravelWiser</h1>
      </header>

      <main className="text-[#38306a]">
        {/* 메인 메시지 섹션 */}
        <section className="py-10 px-5 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold leading-snug">똑똑한 여행자를 위한<br />실시간 호텔 가격 변동 추적</h2>
          <p className="text-sm text-[#555] leading-relaxed my-7 whitespace-pre-line">
            <strong className="text-base text-black leading-loose">"혹시 평소보다 비싸게 예약한 건 아닐까?"</strong><br />지금 이 순간에도 호텔 가격은 바뀌고 있어요<br />가장 저렴해지는 순간을 놓치지 마세요
          </p>

          {/* 앱 다운로드 버튼 (상단) */}
          <div className="flex justify-center gap-4 flex-wrap mt-10 mb-5">
            <a href="https://play.google.com/store/apps/details?id=com.whatsyourbeem.travelwiser" target="_blank">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play에서 다운로드" width={160} height={40} />
            </a>
            <a href="https://apps.apple.com/kr/app/트래블와이저-실시간-숙소-가격-변동-그래프/id6739926163" target="_blank">
              <Image src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store에서 다운로드" width={160} height={40} />
            </a>
          </div>
        </section>

        {/* 앱 스크린샷 1 */}
        <div className="px-5 mx-auto text-center mb-7">
          <Image src="/img/tw1.png" alt="앱 스크린샷 1" width={360} height={780} className="inline-block rounded-2xl border-2 border-gray-300 shadow-lg" />
        </div>

        {/* 기능 설명 1 */}
        <section className="py-12 px-5 max-w-3xl mx-auto text-center pb-2.5">
          <h2 className="text-2xl font-extrabold leading-snug">실시간 가격 확인</h2>
          <p className="text-sm text-[#555] leading-relaxed my-5 whitespace-pre-line">목표 가격을 설정하고<br />목표가에 얼마나 근접했는지 빠르게 확인해요</p>
        </section>

        {/* 앱 스크린샷 2 */}
        <div className="px-5 mx-auto text-center mb-7">
          <Image src="/img/tw2.png" alt="앱 스크린샷 2" width={360} height={780} className="inline-block rounded-2xl border-2 border-gray-300 shadow-lg" />
        </div>

        {/* 기능 설명 2 */}
        <section className="py-12 px-5 max-w-3xl mx-auto text-center pb-2.5">
          <h2 className="text-2xl font-extrabold leading-snug">숙소 특징 비교</h2>
          <p className="text-sm text-[#555] leading-relaxed my-5 whitespace-pre-line">원하는 숙소를 찜해두고<br />주요 특징을 한 눈에 비교해요</p>
        </section>

        {/* 앱 스크린샷 3 */}
        <div className="px-5 mx-auto text-center pb-2.5">
          <Image src="/img/tw3.png" alt="앱 스크린샷 3" width={360} height={780} className="inline-block rounded-2xl border-2 border-gray-300 shadow-lg" />
        </div>

        {/* 앱 다운로드 버튼 (하단) */}
        <div className="flex justify-center gap-4 flex-wrap mt-12">
          <a href="https://play.google.com/store/apps/details?id=com.whatsyourbeem.travelwiser" target="_blank">
            <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play에서 다운로드" width={160} height={40} />
          </a>
          <a href="https://apps.apple.com/kr/app/트래블와이저-실시간-숙소-가격-변동-그래프/id6739926163" target="_blank">
            <Image src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store에서 다운로드" width={160} height={40} />
          </a>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="text-center p-7 mt-16 text-xs text-gray-400 bg-gray-50">
        TravelWiser &nbsp;|&nbsp; © 2025. BEEM. All rights reserved.
        <br />
        <br />
        <a href="/privacy-policy" className="text-gray-400 underline text-xs">
          개인정보처리방침
        </a>
      </footer>
    </div>
  );
}