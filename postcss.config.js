// postcss.config.js
// 이 파일은 PostCSS가 Tailwind CSS와 Autoprefixer를 처리하는 방법을 설정합니다.

// CommonJS 모듈 시스템을 사용하여 설정을 내보냅니다.
module.exports = {
  plugins: {
    // tailwindcss: Tailwind CSS를 PostCSS 플러그인으로 사용합니다.
    // 중요: 여기에 빈 객체 `{}`를 전달하는 것이 표준 방식이며,
    // 이렇게 하면 PostCSS가 설치된 `@tailwindcss/postcss` 패키지를 통해
    // Tailwind를 올바르게 인식하고 실행합니다.
    "@tailwindcss/postcss": {},
  },
};