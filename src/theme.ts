import { createTheme } from '@mui/material/styles';

// 디자인 시스템 토큰
const colorTokens = {
  bgHeader: '#F5FAFF',
  bgDefault: '#FFFFFF',
  border: '#E5E7EB',
  primary: '#2563EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  success: {
    bg: '#D1FADF',
    text: '#065F46',
  },
  danger: {
    bg: '#FEE2E2',
    text: '#991B1B',
  },
  chip: {
    bg: '#E5E7EB',
  },
};

// MUI 테마 생성
const theme = createTheme({
  spacing: 8, // 8px 스케일
  palette: {
    primary: {
      main: colorTokens.primary,
    },
    background: {
      default: colorTokens.bgDefault,
      paper: colorTokens.bgDefault, // 카드 등 Paper 컴포넌트 배경도 통일
    },
    text: {
      primary: colorTokens.textPrimary,
      secondary: colorTokens.textSecondary,
    },
    // 커스텀 색상 토큰 등록
    custom: {
      header: colorTokens.bgHeader,
      border: colorTokens.border,
      success: colorTokens.success,
      danger: colorTokens.danger,
      chip: colorTokens.chip,
    },
  },
  typography: {
    fontFamily: '"Noto Sans", sans-serif',
    allVariants: {
      color: colorTokens.textPrimary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14, // rounded-2xl
          textTransform: 'none', // 모든 버튼의 텍스트 대문자 변환 방지
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Contained 버튼에만 그림자 적용
        },
        text: {
          boxShadow: 'none', // Text 버튼은 그림자 없음
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1200px !important', // 컨테이너 최대폭
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
  },
});

// 커스텀 팔레트 타입 확장
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      header: string;
      border: string;
      success: { bg: string; text: string };
      danger: { bg: string; text: string };
      chip: { bg: string };
    };
  }
  interface PaletteOptions {
    custom?: {
      header?: string;
      border?: string;
      success?: { bg: string; text: string };
      danger?: { bg: string; text: string };
      chip?: { bg: string };
    };
  }
}

export default theme;


