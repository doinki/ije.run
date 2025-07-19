import type { Config } from '@react-router/dev/config';

export default {
  prerender: () => {
    return ['/'];
  },
  ssr: true,
} satisfies Config;
