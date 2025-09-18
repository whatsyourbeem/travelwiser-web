
// /src/app/hotels/page.tsx
"use client";

// React 훅 (useState, useEffect) 및 Next.js 라우터 임포트
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 날짜 포맷팅 및 아이콘 라이브러리 임포트
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

// 공통 유틸리티 및 UI 컴포넌트 임포트
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// API로부터 받는 호텔 정보 타입을 정의합니다.
interface Hotel {
  hotel_id: string;
  hotel_translated_name: string;
}

export default function HotelSearchPage() {
  const router = useRouter();

  // --- 상태 관리 (State Management) ---
  // 사용자가 입력하는 호텔 이름을 위한 상태
  const [hotelName, setHotelName] = useState("");
  // 선택된 호텔 정보를 저장하는 상태
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  // API 검색 결과를 저장하는 배열 상태
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  // API 호출 시 로딩 상태를 관리하는 상태
  const [isLoading, setIsLoading] = useState(false);
  // 페이지 최초 로딩 상태를 관리
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 검색 조건(날짜, 숙박일, 성인 수)을 위한 상태
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [los, setLos] = useState(2);
  const [adults, setAdults] = useState(2);

  // --- API 호출 ---
  /**
   * 호텔 검색 API(/api/search-hotels)를 호출하는 비동기 함수
   * @param name - 검색할 호텔 이름 (옵션)
   */
  const fetchHotels = async (name?: string) => {
    setIsLoading(true);
    try {
      const url = name
        ? `/api/search-hotels?name=${name}`
        : "/api/search-hotels";
      const response = await fetch(url);
      const data: Hotel[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("호텔 데이터 로딩 중 오류 발생:", error);
      alert("호텔 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // --- Effects ---
  // 페이지가 처음 로드될 때 추천 호텔 목록을 가져옵니다.
  useEffect(() => {
    fetchHotels();
  }, []);

  // hotelName 상태가 변경될 때마다 디바운싱하여 호텔을 검색합니다.
  useEffect(() => {
    if (selectedHotel && hotelName !== selectedHotel.hotel_translated_name) {
      setSelectedHotel(null);
    }

    if (!hotelName) {
      // 검색어가 없으면 추천 목록을 다시 보여주기 위해 초기 호텔 목록을 가져옵니다.
      fetchHotels();
      return;
    }

    if (hotelName.length < 2) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchHotels(hotelName);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [hotelName]);

  // --- 이벤트 핸들러 ---
  /**
   * 최종 '검색' 버튼 클릭 시 실행되는 핸들러
   */
  const handleSearch = () => {
    // 선택된 호텔이 없으면 사용자에게 알립니다.
    if (!selectedHotel) {
      alert("호텔을 선택해주세요.");
      return;
    }
    // 체크인 날짜가 없으면 사용자에게 알립니다.
    if (!selectedDate) {
      alert("체크인 날짜를 선택해주세요.");
      return;
    }

    // 선택된 호텔 ID와 날짜/숙박 정보를 조합하여 상세 페이지로 이동합니다.
    const checkIn = format(selectedDate, "yyyy-MM-dd");
    router.push(
      `/hotels/${selectedHotel.hotel_id}?checkIn=${checkIn}&los=${los}&adults=${adults}`
    );
  };

  /**
   * 검색 결과 목록에서 특정 호텔을 클릭했을 때 실행되는 핸들러
   * @param hotel - 클릭된 호텔 객체
   */
  const handleSelectHotel = (hotel: Hotel) => {
    // 선택된 호텔 정보를 상태에 저장합니다.
    setSelectedHotel(hotel);
    // 입력창의 텍스트를 선택된 호텔의 전체 이름으로 변경합니다.
    setHotelName(hotel.hotel_translated_name);
    // 검색 결과 목록을 비웁니다.
    setSearchResults([]);
  };

  // --- 렌더링 ---
  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>호텔 검색</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* 호텔 이름 입력 섹션 */}
          <div className="grid gap-2 relative">
            <Label htmlFor="hotel-name-input">호텔 이름</Label>
            <div className="relative">
              <Input
                id="hotel-name-input"
                type="text"
                placeholder="호텔 이름을 입력하세요 (예: 신라호텔)"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                autoComplete="off"
              />
              {/* 로딩 중일 때 스피너 아이콘 표시 */}
              {isLoading && (
                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
              )}
            </div>
            {/* 검색 결과 표시 섹션 */}
            {(isInitialLoading || searchResults.length > 0) && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {hotelName ? "검색 결과" : "추천 호텔"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isInitialLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto">
                      {searchResults.map((hotel) => (
                        <li
                          key={hotel.hotel_id}
                          onClick={() => handleSelectHotel(hotel)}
                          className="p-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                        >
                          {hotel.hotel_translated_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* 체크인 날짜 선택 섹션 */}
          <div className="grid gap-2">
            <Label htmlFor="checkin-date">체크인</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="checkin-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>날짜를 선택하세요</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  classNames={{
                    day: "h-9 w-9 p-0 m-1",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 숙박일 및 성인 수 입력 섹션 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="los-input">숙박일</Label>
              <Input
                id="los-input"
                type="number"
                value={los}
                onChange={(e) => setLos(parseInt(e.target.value, 10) || 1)}
                min={1}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adults-input">성인</Label>
              <Input
                id="adults-input"
                type="number"
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value, 10) || 1)}
                min={1}
              />
            </div>
          </div>

          {/* 최종 검색 버튼 */}
          <Button onClick={handleSearch} size="lg" className="w-full">
            상세 정보 보기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
