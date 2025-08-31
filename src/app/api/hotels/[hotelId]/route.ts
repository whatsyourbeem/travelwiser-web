
// src/app/api/hotels/[hotelId]/route.ts

// Next.js 앱 라우터에서 요청(Request)과 응답(Response) 객체를 사용하기 위해 임포트합니다.
import { NextRequest, NextResponse } from 'next/server';

// 이 함수는 동적 경로의 매개변수(예: [hotelId])를 `params` 객체로 받습니다.
// 이 경우에는 { params: { hotelId: string } } 형태가 됩니다.
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ hotelId: string }> }
) {
  const params = await context.params;
  const hotelId = params.hotelId;

  // URL의 쿼리 파라미터를 가져옵니다.
  const searchParams = request.nextUrl.searchParams;
  const checkIn = searchParams.get('checkIn'); // "2025-09-06"
  const los = searchParams.get('los'); // "2" (length of stay)
  const adults = searchParams.get('adults'); // "2"

  // 필수 파라미터가 없는 경우, 400 Bad Request 에러를 반환합니다.
  if (!checkIn || !los || !adults) {
    return NextResponse.json(
      { error: 'Missing required query parameters: checkIn, los, adults' },
      { status: 400 }
    );
  }

  // 체크아웃 날짜를 계산합니다.
  // checkIn 날짜 문자열로부터 Date 객체를 생성합니다.
  const checkInDate = new Date(checkIn);
  // 숙박일수(los)를 정수로 변환합니다.
  const lengthOfStay = parseInt(los, 10);
  // 체크인 날짜에 숙박일수를 더하여 체크아웃 날짜를 계산합니다.
  const checkOutDate = new Date(checkInDate.setDate(checkInDate.getDate() + lengthOfStay));
  // Agoda API가 요구하는 'YYYY-MM-DD' 형식으로 날짜를 변환합니다.
  // toISOString()은 "2025-09-07T..." 형태이므로 앞 10자리만 잘라냅니다.
  const formattedCheckOutDate = checkOutDate.toISOString().split('T')[0];

  // Agoda API에 보낼 요청 본문(body)을 구성합니다.
  const apiRequestBody = {
    criteria: {
      additional: {
        currency: 'KRW',
        discountOnly: false,
        language: 'ko-kr',
        occupancy: {
          // adults 파라미터를 정수로 변환하여 사용합니다.
          numberOfAdult: parseInt(adults, 10),
          numberOfChildren: 0, // 예시에서는 0으로 고정
        },
      },
      checkInDate: checkIn,
      checkOutDate: formattedCheckOutDate,
      // hotelId 파라미터를 정수로 변환하여 배열에 담습니다.
      hotelId: [parseInt(hotelId, 10)],
    },
  };

  try {
    // 서버 환경 변수에서 Agoda API 키를 안전하게 가져옵니다.
    const apiKey = process.env.AGODA_API_KEY;
    if (!apiKey) {
      // API 키가 설정되지 않은 경우, 500 Internal Server Error를 반환합니다.
      throw new Error('API key is not configured on the server.');
    }

    // 현재 실행 환경이 'production'(Vercel 등)인지 'development'(로컬)인지 확인합니다.
    const isProduction = process.env.NODE_ENV === 'production';

    // 환경에 따라 API URL을 동적으로 결정합니다.
    // Vercel과 같은 프로덕션 환경에서는 https를, 로컬 개발 환경에서는 http를 사용합니다.
    // 이렇게 하면 외부 API가 https를 지원하게 되면 Vercel에서도 바로 작동할 수 있습니다.
    const agodaApiUrl = isProduction
      ? 'https://affiliateapi7643.agoda.com/affiliateservice/lt_v1'
      : 'http://affiliateapi7643.agoda.com/affiliateservice/lt_v1';

    // Agoda API에 POST 요청을 보냅니다.
    const response = await fetch(agodaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 환경 변수에서 가져온 API 키를 Authorization 헤더에 담아 보냅니다.
        'Authorization': apiKey,
      },
      // JavaScript 객체를 JSON 문자열로 변환하여 body에 담습니다.
      body: JSON.stringify(apiRequestBody),
    });

    // Agoda API로부터 받은 응답이 성공적이지 않은 경우 에러를 처리합니다.
    if (!response.ok) {
      // 응답 본문을 텍스트로 읽어 에러 메시지에 포함시킵니다.
      const errorBody = await response.text();
      console.error(`Agoda API Error: ${response.statusText}`, errorBody);
      return NextResponse.json(
        { error: 'Failed to fetch data from Agoda API', details: errorBody },
        { status: response.status }
      );
    }

    // 응답 본문을 JSON으로 파싱합니다.
    const data = await response.json();

    // 파싱한 데이터를 클라이언트에게 JSON 형태로 반환합니다.
    return NextResponse.json(data);

  } catch (error) {
    // fetch 요청 중 네트워크 오류나 기타 예외가 발생한 경우 처리합니다.
    console.error('Internal Server Error:', error);
    // 디버깅을 위해 에러의 상세 내용을 클라이언트에 전달합니다.
    const details = error instanceof Error ? 
      { message: error.message, cause: error.cause } : 
      { message: 'An unknown error occurred' };

    return NextResponse.json(
      { error: 'Internal Server Error', details },
      { status: 500 }
    );
  }
}
