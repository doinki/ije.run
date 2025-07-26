import type { ButtonHTMLAttributes } from 'react';
import { useId, useSyncExternalStore } from 'react';

import { useIsHydrated } from '~/hooks/use-is-hydrated';

declare global {
  interface Window {
    __setPreferredTheme: (theme: Theme) => void;
  }
}

export const enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface ThemeSwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  onChange?: (theme: Theme) => void;
}

export function ThemeSwitch({ className, onChange, onClick, ...props }: ThemeSwitchProps) {
  const id = useId();
  const isMounted = useIsHydrated();
  const theme = useTheme();

  return (
    <button
      aria-label={isMounted ? `Turn ${theme === Theme.DARK ? 'on' : 'off'} the light` : undefined}
      className={['theme-switch', className].join(' ').trim()}
      type="button"
      onClick={(e) => {
        const preferredTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;

        window.__setPreferredTheme(preferredTheme);
        onClick?.(e);
        onChange?.(preferredTheme);
      }}
      {...props}
    >
      <style>{`.theme-switch{-webkit-tap-highlight-color:#fff0;box-sizing:content-box}.sun,.sun-beams,.moon{transform-origin:center}@media (prefers-reduced-motion:reduce){.sun,.sun-beams,.moon{transition-property:none}}.sun{transition:transform 0.5s cubic-bezier(.5,1.25,.75,1.25)}html.dark .sun{transform:scale(1.75);transition-timing-function:cubic-bezier(.25,0,.3,1);transition-duration:0.25s}.sun-beams{transition:transform 0.5s cubic-bezier(.5,1.25,.75,1.25),opacity 0.5s cubic-bezier(.25,0,.3,1)}html.dark .sun-beams{opacity:0;transform:rotate(-25deg);transition-duration:0.15s}.moon{transition:transform 0.25s cubic-bezier(0,0,0,1)}html.dark .moon{transform:translateX(-.5rem);transition-delay:0.25s;transition-duration:0.5s}`}</style>
      <svg aria-hidden="true" strokeLinecap="round" viewBox="0 0 24 24">
        <mask fill="currentColor" id={id}>
          <rect fill="white" height="100%" width="100%" x="0" y="0" />
          <circle className="moon" cx="24" cy="10" fill="black" r="6" />
        </mask>
        <circle className="sun" cx="12" cy="12" fill="currentColor" mask={`url(#${id})`} r="6" />
        <g className="sun-beams" stroke="currentColor" strokeWidth="2">
          <line x1="12" x2="12" y1="1" y2="3" />
          <line x1="12" x2="12" y1="21" y2="23" />
          <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
          <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
          <line x1="1" x2="3" y1="12" y2="12" />
          <line x1="21" x2="23" y1="12" y2="12" />
          <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
          <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
        </g>
      </svg>
    </button>
  );
}

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `!function(){var e,t="theme",c="${Theme.DARK}",a="${Theme.LIGHT}";try{e=localStorage.getItem(t)}catch(e){}var n=window.matchMedia("(prefers-color-scheme: dark)");function o(e){window.__theme=e,e===c?document.documentElement.classList.add(c):e===a&&document.documentElement.classList.remove(c)}o(e||(n.matches?c:a)),n.addListener((function(t){e||o(t.matches?c:a)})),window.__setPreferredTheme=function(c){e=c,o(c);try{localStorage.setItem(t,c)}catch(e){}}}();`,
      }}
    />
  );
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        onStoreChange();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributeFilter: ['class'],
    attributes: true,
  });

  return () => {
    observer.disconnect();
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains(Theme.DARK) ? Theme.DARK : Theme.LIGHT;
}

export function useTheme(defaultTheme: Theme = Theme.LIGHT): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, () => defaultTheme);
}
