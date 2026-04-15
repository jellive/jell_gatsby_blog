export interface Project {
  name: string
  nameKo?: string
  description: string
  tech: string[]
  url?: string
  github?: string
  status: 'active' | 'archived' | 'wip'
  category: 'mobile' | 'web' | 'desktop' | 'extension' | 'backend'
}

export const projects: Project[] = [
  {
    name: 'Cookting (냉장고를 부탁해)',
    nameKo: '쿡팅',
    description:
      'AI 기반 스마트 냉장고 관리 & 레시피 추천 서비스. Next.js 웹 클라이언트와 NestJS 백엔드로 구성된 모노레포 프로젝트.',
    tech: ['Next.js', 'NestJS', 'PostgreSQL', 'Flutter', 'TypeScript', 'AI'],
    github: 'https://github.com/jellive',
    status: 'active',
    category: 'web',
  },
  {
    name: 'Vinjari (빈자리)',
    nameKo: '빈자리',
    description:
      '캠핑 예약 관리 Flutter 앱. Spring Boot 백엔드 + Firebase 연동, 웹 기반 OAuth 인증 구조.',
    tech: ['Flutter', 'Dart', 'Spring Boot', 'Java', 'Firebase'],
    github: 'https://github.com/jellive',
    status: 'active',
    category: 'mobile',
  },
  {
    name: 'Wecanner (위캐너)',
    nameKo: '위캐너',
    description:
      '주간 일정 위젯 앱. Flutter + Swift/Tuist 네이티브 구성. iOS WidgetKit 연동.',
    tech: ['Flutter', 'Dart', 'Swift', 'Tuist', 'WidgetKit'],
    github: 'https://github.com/jellive',
    status: 'active',
    category: 'mobile',
  },
  {
    name: 'Dev Utils Hub',
    description:
      '개발자를 위한 유틸리티 도구 모음. 13가지 도구를 Tauri v2 + React 기반 데스크탑 앱으로 제공.',
    tech: ['Tauri v2', 'React', 'TypeScript', 'Vite'],
    github: 'https://github.com/jellive',
    status: 'active',
    category: 'desktop',
  },
  {
    name: '나무위키-아카라이브 링커',
    description:
      '나무위키와 아카라이브 간 링크 변환을 자동화하는 크롬 확장 프로그램.',
    tech: ['TypeScript', 'Vite', 'Chrome Extension', 'Manifest V3'],
    github: 'https://github.com/jellive',
    status: 'active',
    category: 'extension',
  },
  {
    name: 'Jellmodoro',
    description:
      'Flutter 뽀모도로 타이머 앱. AI 집중 분석 리포트 + Apple Watch 연동으로 작업 패턴을 시각화.',
    tech: ['Flutter', 'Dart', 'Apple Watch', 'AI'],
    github: 'https://github.com/jellive',
    status: 'active',
    category: 'mobile',
  },
  {
    name: 'Couple Planner',
    description:
      'Next.js + Expo 기반 커플 앱. AI 데이트 플래너, 공유 캘린더, 기념일 관리 기능 제공.',
    tech: ['Next.js', 'Expo', 'React Native', 'TypeScript', 'AI'],
    github: 'https://github.com/jellive',
    status: 'active',
    category: 'mobile',
  },
]

export const categoryLabel: Record<Project['category'], string> = {
  mobile: '모바일',
  web: '웹',
  desktop: '데스크탑',
  extension: '확장 프로그램',
  backend: '백엔드',
}

export const statusLabel: Record<Project['status'], string> = {
  active: '운영 중',
  archived: '아카이브',
  wip: '개발 중',
}
