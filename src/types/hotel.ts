
// src/types/hotel.ts

// Agoda API 응답 결과 중 result 배열 안의 개별 호텔 정보를 위한 타입입니다.
export interface Hotel {
  hotelId: number;            // 호텔 고유 ID
  hotelName: string;          // 호텔 이름
  roomtypeName: string;       // 객실 유형 이름
  starRating: number;         // 호텔 성급
  reviewScore: number;        // 리뷰 점수
  reviewCount: number;        // 리뷰 개수
  currency: string;           // 통화
  dailyRate: number;          // 1박당 가격 (할인 적용가)
  crossedOutRate: number;     // 할인 전 원래 가격
  discountPercentage: number; // 할인율
  imageURL: string;           // 대표 이미지 URL
  landingURL: string;         // 예약 페이지로 연결되는 URL
  includeBreakfast: boolean;  // 조식 포함 여부
  freeWifi: boolean;          // 무료 와이파이 여부
  latitude: number;           // 위도
  longitude: number;          // 경도
}

// API 전체 응답을 위한 타입입니다.
export interface HotelAPIResponse {
  results: Hotel[]; // 호텔 정보 배열
}
