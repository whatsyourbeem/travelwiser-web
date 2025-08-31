
// src/components/providers/QueryProvider.tsx

// 이 파일은 클라이언트 측에서만 실행되어야 하는 코드를 포함하고 있음을 명시합니다.
// React의 useState, useEffect, useContext 등과 같은 훅을 사용하기 위해 필요합니다.
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// React-Query의 QueryClient 인스턴스를 생성합니다.
// 이 인스턴스는 쿼리의 캐시를 관리하고, 모든 데이터 페칭 설정을 담고 있습니다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 쿼리 데이터가 "오래되었다(stale)"고 간주되기까지의 시간입니다.
      // 5분으로 설정하면, 한 번 가져온 데이터는 5분 동안은 신선한(fresh) 것으로 취급되어
      // 다시 가져오지 않고 캐시된 데이터를 사용합니다.
      staleTime: 1000 * 60 * 5, // 5 minutes

      // gcTime (Garbage Collection Time): 쿼리가 비활성 상태가 된 후 캐시에서 제거되기까지의 시간입니다.
      // 기본값은 5분이며, 여기서는 10분으로 늘려 설정합니다.
      // 사용자가 잠시 다른 페이지에 갔다가 돌아왔을 때 데이터를 다시 사용할 수 있게 합니다.
      gcTime: 1000 * 60 * 10, // 10 minutes

      // 사용자가 창을 다시 포커스했을 때 자동으로 데이터를 다시 가져올지 여부입니다.
      // false로 설정하여 불필요한 API 호출을 줄입니다.
      refetchOnWindowFocus: false,
    },
  },
});

// QueryProvider 컴포넌트는 자식 컴포넌트들에게 React-Query의 기능을 제공하는 역할을 합니다.
// React.PropsWithChildren 타입을 사용하여 children prop을 받을 수 있도록 합니다.
const QueryProvider = ({ children }: React.PropsWithChildren) => {
  return (
    // QueryClientProvider는 context provider로, queryClient 인스턴스를 앱 전체에 제공합니다.
    // 이 Provider로 감싸진 모든 자식 컴포넌트는 useQuery와 같은 React-Query 훅을 사용할 수 있습니다.
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
