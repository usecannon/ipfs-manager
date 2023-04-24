import { extendTheme } from '@chakra-ui/react'
import type { ThemeConfig } from '@chakra-ui/react'

import '@fontsource/nunito-sans/400.css'
import '@fontsource/nunito-sans/700.css'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
} satisfies ThemeConfig

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'Nunito Sans', sans-serif`,
    body: `'Nunito Sans', sans-serif`,
  },
})
