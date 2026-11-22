import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { colors } from '../theme/theme';

export const FRAME_WIDTH = 1280;
export const FRAME_HEIGHT = 720;
export const CONTENT_WIDTH = 1100;

export default function FixedFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: colors.outerBg,
      }}
    >
      {/* Outer box: fixed size, gray */}
      <Box
        sx={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: colors.outerBg,
        }}
      >
        {/* Inner box: fixed width, holds all the content */}
        <Box
          sx={{
            width: CONTENT_WIDTH,
            height: '100%',
            bgcolor: colors.contentBg,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}