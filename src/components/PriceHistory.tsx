// /components/PriceHistory.tsx
"use client"; // 이 컴포넌트는 클라이언트 측에서 실행됩니다.

import { PriceHistoryResponse } from "@/types/price"; // 가격 이력 타입
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // UI 구성을 위한 shadcn/ui 카드 컴포넌트
import { Skeleton } from "@/components/ui/skeleton"; // 로딩 상태를 표시하기 위한 스켈레톤 UI
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"; // 가격 이력 차트를 위한 recharts 라이브러리

// 컴포넌트가 받을 props 타입을 정의합니다.
interface PriceHistoryProps {
  data: PriceHistoryResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

// 숫자 포맷팅을 위한 함수 (예: 100000 -> 100,000원)
const formatPrice = (price: number) =>
  `${price.toLocaleString()}원`;

// 날짜 포맷팅을 위한 함수 (예: 2025-08-19 -> 8/19)
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 이 컴포넌트는 부모로부터 받은 데이터를 화면에 표시하는 역할만 합니다.
export default function PriceHistory({ data, isLoading, isError }: PriceHistoryProps) {
  // 로딩 중일 때 보여줄 UI
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  // 에러 발생 시 보여줄 UI
  if (isError) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>가격 정보 조회 실패</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  // 데이터가 없거나 가격 정보가 없을 경우
  if (!data || data.priceHistory.length === 0) {
    return (
        <Card className="mt-6">
        <CardHeader>
          <CardTitle>가격 변동 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <p>아직 수집된 가격 정보가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  // 차트를 그리기 전에 날짜(checkedDate)를 기준으로 가격 이력 데이터를 오름차순으로 정렬합니다.
  const sortedHistory = [...data.priceHistory].sort((a, b) => 
    a.checkedDate.localeCompare(b.checkedDate)
  );

  // 데이터 로딩 성공 시 보여줄 UI
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>가격 변동 이력</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 최고가, 최저가, 평균가 정보 표시 */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <p className="text-sm text-gray-500">최고가</p>
            <p className="text-lg font-bold text-red-500">{formatPrice(data.highestPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">최저가</p>
            <p className="text-lg font-bold text-blue-500">{formatPrice(data.lowestPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">평균가</p>
            <p className="text-lg font-bold">{formatPrice(data.averagePrice)}</p>
          </div>
        </div>

        {/* 가격 변동 차트 */}
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={sortedHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="checkedDate" tickFormatter={formatDate} />
                    <YAxis tickFormatter={(price) => (price / 10000).toFixed(0) + '만'} domain={['dataMin - 10000', 'dataMax + 10000']}/>
                    <Tooltip 
                      formatter={(value: number) => [formatPrice(value), '가격']}
                      labelFormatter={formatDate}
                    />
                    <Line type="monotone" dataKey="pricePerNight" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
