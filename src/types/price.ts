// FireCat API에서 받아오는 가격 이력 데이터의 기본 단위를 정의합니다.
export interface PriceHistoryEntry {
  checkedDate: string; // 가격이 확인된 날짜 (YYYY-MM-DD)
  pricePerNight: number; // 1박당 가격
  pricePerBook: number; // 예약 시점의 전체 가격 (현재는 0으로 고정)
  consistentRoomIds: boolean; // 조회된 객실 ID가 일관적인지 여부
  hasEnoughData: boolean; // 충분한 데이터가 있는지 여부
}

// FireCat API의 전체 응답 데이터 구조를 정의합니다.
export interface PriceHistoryResponse {
  hotelId: number; // 호텔 ID
  checkIn: string; // 체크인 날짜
  los: number; // 숙박 기간 (Length of Stay)
  highestPrice: number; // 조회 기간 내 최고가
  lowestPrice: number; // 조회 기간 내 최저가
  averagePrice: number; // 조회 기간 내 평균가
  priceHistory: PriceHistoryEntry[]; // 일자별 가격 이력 배열
  elapsedTime: string; // API 응답 시간
}
