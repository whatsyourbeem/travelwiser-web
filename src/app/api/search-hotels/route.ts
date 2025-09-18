
// /src/app/api/search-hotels/route.ts
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// 호텔 정보 타입을 정의합니다.
interface Hotel {
  hotel_id: string;
  hotel_translated_name: string;
  hotel_name: string;
}

// 미리 생성해둔 호텔 인덱스 파일의 경로를 설정합니다.
const hotelIndexPath = path.join(process.cwd(), "public", "hotel-index.json");

// 호텔 데이터를 메모리에 캐시하여, 반복적인 파일 읽기를 방지합니다.
let hotelCache: Hotel[] | null = null;

/**
 * 호텔 인덱스 파일을 읽어와 메모리에 캐시하는 함수
 * @returns {Promise<Hotel[]>} 호텔 데이터 배열
 */
async function getHotels() {
  // 캐시된 데이터가 있으면 즉시 반환합니다.
  if (hotelCache) {
    return hotelCache;
  }
  // 캐시가 없으면 파일을 읽어옵니다.
  const fileContent = await fs.readFile(hotelIndexPath, "utf-8");
  hotelCache = JSON.parse(fileContent);
  return hotelCache as Hotel[];
}

/**
 * 호텔을 검색하는 GET 요청 핸들러 (최적화된 버전)
 * @param request - NextRequest 객체
 * @returns 호텔 검색 결과 (JSON)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "검색어(name)가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    // 캐시된 호텔 데이터를 가져옵니다.
    const allHotels = await getHotels();

    // 검색어(name)를 포함하는 호텔을 필터링합니다. (대소문자 무시)
    const lowercasedName = name.toLowerCase();
    const matchedHotels = allHotels
      .filter((hotel) => {
        const translatedNameMatch = hotel.hotel_translated_name?.toLowerCase().includes(lowercasedName);
        const nameMatch = hotel.hotel_name?.toLowerCase().includes(lowercasedName);
        return translatedNameMatch || nameMatch;
      })
      .slice(0, 10); // 검색 결과를 10개로 제한합니다.

  return NextResponse.json(matchedHotels);
  } catch (error) {
    console.error("호텔 데이터 검색 중 오류 발생:", error);
    // 캐시 초기화 (파일에 문제가 생겼을 경우를 대비)
    hotelCache = null; 
    return NextResponse.json(
      { error: "서버에서 데이터를 처리하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
