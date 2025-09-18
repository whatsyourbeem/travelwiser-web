// /src/app/hotels/[hotelId]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Hotel, HotelAPIResponse } from "@/types/hotel";
import { PriceHistoryResponse, PriceHistoryEntry } from "@/types/price";
import { useSearchStore } from "@/store/searchStore";

// UI 컴포넌트 임포트
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PriceHistory from "@/components/PriceHistory";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 다른 호텔 검색을 위한 타입 정의
interface HotelSearchResult {
  hotel_id: string;
  hotel_translated_name: string;
}

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const HotelDetailSkeleton = () => (
  <div className="container mx-auto p-4 md:p-6 space-y-6">
    <Skeleton className="h-12 w-1/2 mb-4" />
    <Skeleton className="h-8 w-3/4 mb-4" />
    <div>
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-6" />
      <Card>
        <Skeleton className="w-full h-64 rounded-t-lg" />
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="mt-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

const HotelDetailPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const hotelId = params.hotelId as string;
  const searchParams = useSearchParams();
  const { checkIn, los, adults, setSearchCriteria } = useSearchStore();

  // --- 호텔 이름 검색을 위한 상태 --- 
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 날짜와 숙박일 변경 UI를 위한 로컬 상태
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLos, setSelectedLos] = useState<number>(los);

  // URL 쿼리 파라미터 처리 로직
  useEffect(() => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    const hasAllParams = currentParams.has('checkIn') && currentParams.has('los') && currentParams.has('adults');
    if (!hasAllParams) {
      const today = new Date();
      const checkInDate = today.toISOString().split('T')[0];
      const defaultParams = { checkIn: checkInDate, los: '2', adults: '2' };
      const newQuery = new URLSearchParams(defaultParams).toString();
      router.replace(`${pathname}?${newQuery}`);
    } else {
      const queryCheckIn = currentParams.get("checkIn") || "";
      const queryLos = parseInt(currentParams.get("los") || "2", 10);
      const queryAdults = parseInt(currentParams.get("adults") || "2", 10);
      setSearchCriteria(queryCheckIn, queryLos, queryAdults);
      setSelectedDate(queryCheckIn ? new Date(queryCheckIn) : undefined);
      setSelectedLos(queryLos);
    }
  }, [searchParams, pathname, router, setSearchCriteria]);

  const todayDateStr = getTodayDateString();

  // --- 데이터 조회 --- 
  const { data: hotelData, isLoading: isHotelLoading, isError: isHotelError, error: hotelError } = useQuery<HotelAPIResponse>({
    queryKey: ["hotelDetails", hotelId, checkIn, los, adults],
    queryFn: async () => {
      const response = await fetch(`/api/hotels/${hotelId}?checkIn=${checkIn}&los=${los}&adults=${adults}`);
      if (!response.ok) { const errorData = await response.json(); throw errorData; }
      return response.json();
    },
    enabled: !!hotelId && !!checkIn,
  });

  const { data: priceHistoryData, isLoading: isPriceHistoryLoading, isError: isPriceHistoryError } = useQuery<PriceHistoryResponse>({
     queryKey: ["priceHistory", hotelId, checkIn, los, adults],
     queryFn: async () => {
       const response = await fetch(`/api/price-history?hotelId=${hotelId}&checkIn=${checkIn}&los=${los}&adults=${adults}`);
       if (!response.ok) throw new Error("Failed to fetch price history");
       return response.json();
     },
     enabled: !!hotelId && !!checkIn,
  });

  // --- 호텔 이름 검색 로직 --- 
  useEffect(() => {
    if (hotelData?.results?.[0]?.hotelName) {
      setSearchQuery(hotelData.results[0].hotelName);
    }
  }, [hotelData]);

  useEffect(() => {
    if (!searchQuery || (hotelData && searchQuery === hotelData.results[0].hotelName)) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      const searchHotels = async () => {
        setIsSearching(true);
        try {
          const response = await fetch(`/api/search-hotels?name=${searchQuery}`);
          const data: HotelSearchResult[] = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Hotel search failed:", error);
        } finally {
          setIsSearching(false);
        }
      };
      searchHotels();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, hotelData]);

  const handleHotelSelect = (selectedHotel: HotelSearchResult) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    router.push(`/hotels/${selectedHotel.hotel_id}?${currentParams.toString()}`);
  };

  const combinedPriceData = useMemo(() => {
    if (!priceHistoryData || !priceHistoryData.priceHistory) return priceHistoryData;
    const currentLivePrice = hotelData?.results?.[0]?.dailyRate;
    const isTodayPriceInHistory = priceHistoryData.priceHistory.some(p => p.checkedDate === todayDateStr);
    if (currentLivePrice && !isTodayPriceInHistory) {
      const todayPricePoint: PriceHistoryEntry = { checkedDate: todayDateStr, pricePerNight: currentLivePrice, pricePerBook: 0, consistentRoomIds: true, hasEnoughData: true };
      const newPriceHistory = [...priceHistoryData.priceHistory, todayPricePoint];
      const prices = newPriceHistory.map(p => p.pricePerNight);
      return { ...priceHistoryData, priceHistory: newPriceHistory, highestPrice: Math.max(...prices), lowestPrice: Math.min(...prices), averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length };
    }
    return priceHistoryData;
  }, [hotelData, priceHistoryData, todayDateStr]);

  const handleUpdateSearch = () => {
    if (selectedDate) {
      const newCheckIn = format(selectedDate, "yyyy-MM-dd");
      router.push(`/hotels/${hotelId}?checkIn=${newCheckIn}&los=${selectedLos}&adults=${adults}`);
    }
  };

  // --- 렌더링 --- 
  if (isHotelLoading || isPriceHistoryLoading || !checkIn) {
    return <HotelDetailSkeleton />;
  }

  if (isHotelError) {
    return <div className="p-6 text-red-500"><pre>{JSON.stringify(hotelError, null, 2)}</pre></div>;
  }

  if (!hotelData || !hotelData.results || hotelData.results.length === 0) {
    return <div className="p-6">해당 조건의 호텔 정보를 찾을 수 없습니다.</div>;
  }

  const hotel: Hotel = hotelData.results[0];
  const displayPrice = hotel.dailyRate;

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* --- 검색 조건 변경 카드 --- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>검색 조건 변경</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* --- 다른 호텔 검색 UI --- */}
          <div className="relative">
            <Label htmlFor="hotel-name-input">호텔 이름</Label>
            <Input
              id="hotel-name-input"
              type="text"
              placeholder="다른 호텔 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {isSearching && (
              <Loader2 className="absolute right-2 top-9 h-5 w-5 animate-spin text-gray-400" />
            )}
            {searchResults.length > 0 && (
              <ul className="absolute top-full z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((hotel) => (
                  <li
                    key={hotel.hotel_id}
                    onClick={() => handleHotelSelect(hotel)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {hotel.hotel_translated_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* --- 날짜 및 숙박일 변경 UI --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
            <div className="grid gap-2">
              <Label htmlFor="los-input">숙박일</Label>
              <Input
                id="los-input"
                type="number"
                value={selectedLos}
                onChange={(e) =>
                  setSelectedLos(parseInt(e.target.value, 10) || 1)
                }
                min={1}
              />
            </div>
            <Button onClick={handleUpdateSearch} className="w-full md:w-auto">
              날짜/숙박일 적용
            </Button>
          </div>
        </CardContent>
      </Card>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">{hotel.hotelName}</h1>
        <p className="text-lg text-gray-600">★ {hotel.starRating.toFixed(1)}</p>
      </header>

      <Card className="overflow-hidden">
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={hotel.imageURL}
            alt={hotel.hotelName}
            fill
            className="object-cover"
            priority
          />
        </div>
        <CardHeader>
          <CardTitle>{hotel.roomtypeName}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("ko-KR").format(displayPrice)}{" "}
              {hotel.currency}
            </div>
            {hotel.discountPercentage > 0 && (
              <div className="text-right">
                <p className="text-gray-500 line-through">
                  {new Intl.NumberFormat("ko-KR").format(hotel.crossedOutRate)}
                </p>
                <Badge variant="destructive">
                  {hotel.discountPercentage}% 할인
                </Badge>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {hotel.includeBreakfast && <Badge>조식 포함</Badge>}
            {hotel.freeWifi && <Badge>무료 WIFI</Badge>}
            <Badge variant="secondary">
              ⭐ {hotel.reviewScore} ({hotel.reviewCount.toLocaleString()} 리뷰)
            </Badge>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-700">체크인: {checkIn}</p>
            <p className="text-sm text-gray-700">숙박일: {los}박</p>
            <p className="text-sm text-gray-700">성인: {adults}명</p>
          </div>
          <Button asChild size="lg" className="w-full">
            <a
              href={hotel.landingURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              예약하기
            </a>
          </Button>
        </CardContent>
      </Card>

      <PriceHistory
        data={combinedPriceData}
        isLoading={isPriceHistoryLoading}
        isError={isPriceHistoryError}
      />
    </div>
  );
};

export default HotelDetailPage;