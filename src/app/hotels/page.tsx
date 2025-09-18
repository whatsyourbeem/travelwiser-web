
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

  // 검색 조건(날짜, 숙박일, 성인 수)을 위한 상태
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [los, setLos] = useState(2);
  const [adults, setAdults] = useState(2);

  // --- API 호출 및 디바운싱 ---
  // hotelName 상태가 변경될 때마다 실행되는 useEffect 훅
  useEffect(() => {
    // 이전에 선택된 호텔이 있고, 입력된 이름이 선택된 호텔 이름과 다르면 선택 상태를 초기화합니다.
    if (selectedHotel && hotelName !== selectedHotel.hotel_translated_name) {
      setSelectedHotel(null);
    }

    // 검색어가 없으면 API를 호출하지 않습니다.
    if (!hotelName || hotelName.length < 2) {
      setSearchResults([]);
      return;
    }

    // 디바운싱(Debouncing): 사용자가 타이핑을 멈춘 후 300ms가 지나면 API를 호출합니다.
    // 불필요한 API 호출을 줄여 성능을 향상시킵니다.
    const debounceTimer = setTimeout(() => {
      // API 호출 함수 실행
      searchHotels();
    }, 300);

    // 컴포넌트가 언마운트되거나, hotelName이 변경되면 이전 타이머를 제거합니다.
    return () => clearTimeout(debounceTimer);
  }, [hotelName]); // hotelName이 변경될 때마다 이 훅을 다시 실행합니다.

  /**
   * 호텔 검색 API(/api/search-hotels)를 호출하는 비동기 함수
   */
  const searchHotels = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      // 백엔드 API에 GET 요청을 보냅니다.
      const response = await fetch(`/api/search-hotels?name=${hotelName}`);
      const data: Hotel[] = await response.json();
      // API로부터 받은 검색 결과를 상태에 저장합니다.
      setSearchResults(data);
    } catch (error) {
      console.error("호텔 검색 API 호출 중 오류 발생:", error);
      alert("호텔을 검색하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // --- 이벤트 핸들러 ---
  /**
   * 최종 '검색' 버튼 클릭 시 실행되는 핸들러
   */
  const handleSearch = () => {
    // 선택된 호텔이 없으면 사용자에게 알립니다.
    if (!selectedHotel) {
      alert("검색 결과에서 호텔을 선택해주세요.");
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
            {searchResults.length > 0 && (
              <ul className="absolute top-full z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((hotel) => (
                  <li
                    key={hotel.hotel_id}
                    onClick={() => handleSelectHotel(hotel)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {hotel.hotel_translated_name}
                  </li>
                ))}
              </ul>
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
