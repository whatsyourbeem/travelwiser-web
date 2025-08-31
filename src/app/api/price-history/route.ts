// /app/api/price-history/route.ts

// Next.js 서버에서 요청(Request)과 응답(Response) 객체를 사용하기 위해 'next/server'에서 필요한 모듈을 가져옵니다.
import { NextRequest, NextResponse } from "next/server";

// HTTP GET 요청을 비동기적으로 처리하는 함수를 정의합니다.
export async function GET(request: NextRequest) {
  // 클라이언트로부터 받은 요청 URL에서 쿼리 파라미터들을 쉽게 다룰 수 있도록 URL 객체를 생성합니다.
  const { searchParams } = new URL(request.url);
  
  // 'hotelId' 쿼리 파라미터 값을 가져옵니다. (예: "12345")
  const hotelId = searchParams.get("hotelId");
  // 'checkIn' 쿼리 파라미터 값을 가져옵니다. (예: "2024-09-10")
  const checkIn = searchParams.get("checkIn");
  // 'los' (Length of Stay) 쿼리 파라미터 값을 가져옵니다. (예: "2")
  const los = searchParams.get("los");
  // 'adults' 쿼리 파라미터 값을 가져옵니다. (예: "2")
  const adults = searchParams.get("adults");

  // API 호출에 필수적인 파라미터들이 하나라도 빠졌는지 확인합니다.
  if (!hotelId || !checkIn || !los || !adults) {
    // 만약 필수 파라미터가 없다면, 어떤 파라미터가 필요한지 알려주는 에러 메시지와 함께
    // HTTP 상태 코드 400 (Bad Request)을 클라이언트에 반환합니다.
    return NextResponse.json(
      { error: "Missing required query parameters" },
      { status: 400 }
    );
  }

  // 현재 코드가 실행되는 환경을 확인합니다. 'process.env.NODE_ENV'는 Node.js 환경 변수입니다.
  // Vercel과 같은 프로덕션 환경에서는 'production'으로 설정됩니다.
  const isProduction = process.env.NODE_ENV === 'production';

  // 실행 환경에 따라 API 호출 URL을 동적으로 결정합니다.
  // Vercel(프로덕션) 환경에서는 HTTPS를 사용하고, 로컬 개발 환경에서는 HTTP를 사용합니다.
  const fireCatUrl = isProduction
    ? `https://api.travelwiser.me/priceHistory?hotelId=${hotelId}&checkIn=${checkIn}&los=${los}&adults=${adults}` // 프로덕션(Vercel) 환경용 URL
    : `http://api.travelwiser.me:28000/priceHistory?hotelId=${hotelId}&checkIn=${checkIn}&los=${los}&adults=${adults}`; // 로컬 개발 환경용 URL

  // 외부 API 호출과 같은 네트워크 요청은 실패할 수 있으므로, try-catch 블록으로 감싸 에러를 처리합니다.
  try {
    // 결정된 URL로 외부 가격 이력 API에 GET 요청을 보냅니다.
    // fetch 함수는 네트워크 요청을 보내고, await 키워드는 응답이 올 때까지 기다립니다.
    const response = await fetch(fireCatUrl, {
      // next: { revalidate: 3600 } // 필요하다면, Vercel의 캐시 기능을 사용하여 1시간 동안 응답을 저장할 수 있습니다.
    });

    // API로부터 받은 응답이 성공적이지 않은 경우 (예: 상태 코드가 200-299 범위 밖일 때)
    if (!response.ok) {
      // 에러를 발생시켜 catch 블록으로 제어를 넘깁니다.
      throw new Error(`FireCat API failed with status: ${response.status}`);
    }

    // 응답 본문을 JSON 형식으로 파싱합니다. await는 파싱이 완료될 때까지 기다립니다.
    const data = await response.json();

    // 성공적으로 받은 데이터를 JSON 형식으로 클라이언트에 반환합니다. (HTTP 상태 코드는 기본값 200 OK)
    return NextResponse.json(data);
  } catch (error) {
    // try 블록에서 에러가 발생하면 이곳에서 처리합니다.
    // 서버 콘솔에 에러 내용을 기록하여 디버깅에 활용합니다.
    console.error("Failed to fetch price history:", error);
    // 클라이언트에는 상세한 에러 내용 대신, 일반적인 실패 메시지와 함께
    // HTTP 상태 코드 500 (Internal Server Error)을 반환하여 시스템 내부 구현을 숨깁니다.
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}
