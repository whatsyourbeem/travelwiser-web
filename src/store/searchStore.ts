
// src/store/searchStore.ts

import { create } from 'zustand';

// 스토어의 상태(state)에 대한 타입을 정의합니다.
interface SearchState {
  checkIn: string;  // 체크인 날짜 (YYYY-MM-DD)
  los: number;      // 숙박일 수 (length of stay)
  adults: number;   // 성인 인원 수
  // 상태를 업데이트하는 함수의 타입을 정의합니다.
  setSearchCriteria: (checkIn: string, los: number, adults: number) => void;
}

// Zustand 스토어를 생성합니다.
// create 함수는 스토어의 초기 상태와 액션(상태 변경 함수)을 정의하는 콜백 함수를 인자로 받습니다.
export const useSearchStore = create<SearchState>((set) => ({
  // 초기 상태 값들을 설정합니다.
  checkIn: '',   // 빈 문자열로 초기화
  los: 2,       // 기본값 2로 설정
  adults: 2,    // 기본값 2로 설정

  // setSearchCriteria는 상태를 업데이트하는 "액션"입니다.
  // 이 함수는 새로운 검색 조건들을 인자로 받아 `set` 함수를 호출하여 상태를 업데이트합니다.
  setSearchCriteria: (checkIn, los, adults) =>
    set({
      checkIn,
      los,
      adults,
    }),
}));
