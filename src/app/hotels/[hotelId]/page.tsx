// src/app/hotels/[hotelId]/page.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
  const params = useParams();
  const hotelId = params.hotelId as string;
  const searchParams = useSearchParams();
  const { checkIn, los, adults, setSearchCriteria } = useSearchStore();

  // 날짜와 숙박일 변경 UI를 위한 로컬 상태
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLos, setSelectedLos] = useState<number>(los);

  const todayDateStr = getTodayDateString();

  // URL 쿼리 파라미터가 변경될 때마다 Zustand 스토어와 로컬 상태를 업데이트합니다.
  useEffect(() => {
    const queryCheckIn = searchParams.get("checkIn") || "";
    const queryLos = parseInt(searchParams.get("los") || "2", 10);
    const queryAdults = parseInt(searchParams.get("adults") || "2", 10);
    setSearchCriteria(queryCheckIn, queryLos, queryAdults);
    setSelectedDate(queryCheckIn ? new Date(queryCheckIn) : undefined);
    setSelectedLos(queryLos);
  }, [searchParams, setSearchCriteria]);

  // 호텔 정보 조회 쿼리
  const {
    data: hotelData,
    isLoading: isHotelLoading,
    isError: isHotelError,
    error: hotelError,
  } = useQuery<HotelAPIResponse>({
    queryKey: ["hotelDetails", hotelId, checkIn, los, adults],
    queryFn: async () => {
      const response = await fetch(
        `/api/hotels/${hotelId}?checkIn=${checkIn}&los=${los}&adults=${adults}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      return response.json();
    },
    enabled: !!hotelId && !!checkIn,
  });

  // 가격 이력 조회 쿼리
  const {
    data: priceHistoryData,
    isLoading: isPriceHistoryLoading,
    isError: isPriceHistoryError,
  } = useQuery<PriceHistoryResponse>({
    queryKey: ["priceHistory", hotelId, checkIn, los, adults],
    queryFn: async () => {
      const response = await fetch(
        `/api/price-history?hotelId=${hotelId}&checkIn=${checkIn}&los=${los}&adults=${adults}`
      );
      if (!response.ok) throw new Error("Failed to fetch price history");
      return response.json();
    },
    enabled: !!hotelId && !!checkIn,
  });

  // 실시간 가격과 과거 이력을 결합하는 로직
  const combinedPriceData = useMemo(() => {
    if (!hotelData || !priceHistoryData) return priceHistoryData;
    const currentLivePrice = hotelData.results?.[0]?.dailyRate;
    const isTodayPriceInHistory = priceHistoryData.priceHistory.some(
      (p) => p.checkedDate === todayDateStr
    );
    if (currentLivePrice && !isTodayPriceInHistory) {
      // 그래프에 추가할 새로운 데이터 포인트를 PriceHistoryEntry 타입에 맞춰 생성합니다.
      const todayPricePoint: PriceHistoryEntry = {
        checkedDate: todayDateStr,
        pricePerNight: currentLivePrice,
        pricePerBook: 0, // 실시간 데이터에는 해당 값이 없으므로 기본값을 사용합니다.
        consistentRoomIds: true, // 실시간 단일 데이터는 항상 일관성이 있다고 가정합니다.
        hasEnoughData: true, // 실시간 단일 데이터는 항상 충분하다고 가정합니다.
      };
      const newPriceHistory = [
        ...priceHistoryData.priceHistory,
        todayPricePoint,
      ];
      const prices = newPriceHistory.map((p) => p.pricePerNight);
      return {
        ...priceHistoryData,
        priceHistory: newPriceHistory,
        highestPrice: Math.max(...prices),
        lowestPrice: Math.min(...prices),
        averagePrice:
          prices.reduce((sum, price) => sum + price, 0) / prices.length,
      };
    }
    return priceHistoryData;
  }, [hotelData, priceHistoryData, todayDateStr]);

  // 검색 조건 변경 핸들러
  const handleUpdateSearch = () => {
    if (selectedDate) {
      const newCheckIn = format(selectedDate, "yyyy-MM-dd");
      router.push(
        `/hotels/${hotelId}?checkIn=${newCheckIn}&los=${selectedLos}&adults=${adults}`
      );
    }
  };

  if (isHotelLoading || isPriceHistoryLoading || !checkIn) {
    return <HotelDetailSkeleton />;
  }

  if (isHotelError) {
    return (
      <div className="p-6 text-red-500">
        <pre>{JSON.stringify(hotelError, null, 2)}</pre>
      </div>
    );
  }

  if (!hotelData || hotelData.results.length === 0) {
    return <div className="p-6">해당 조건의 호텔 정보를 찾을 수 없습니다.</div>;
  }

  const hotel: Hotel = hotelData.results[0];
  const displayPrice = hotel.dailyRate;

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* 날짜 및 숙박일 변경 UI */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>검색 조건 변경</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* 체크인 날짜 선택 */}
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
                  classNames={{
                    // 각 날짜 셀(day)에 margin(m-1)을 적용하여 셀 간의 간격을 만듭니다.
                    // h-9, w-9, p-0은 셀의 크기와 내부 여백을 일관되게 유지하기 위함입니다.
                    day: "h-9 w-9 p-0 m-1",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* 숙박일 수 입력 */}
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
          {/* 적용 버튼 */}
          <Button onClick={handleUpdateSearch} className="w-full md:w-auto">
            적용
          </Button>
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