import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--codeAgent-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--codeAgent-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--codeAgent-elements-terminal-textColor'),
    background: cssVar('--codeAgent-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--codeAgent-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--codeAgent-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--codeAgent-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--codeAgent-elements-terminal-color-black'),
    red: cssVar('--codeAgent-elements-terminal-color-red'),
    green: cssVar('--codeAgent-elements-terminal-color-green'),
    yellow: cssVar('--codeAgent-elements-terminal-color-yellow'),
    blue: cssVar('--codeAgent-elements-terminal-color-blue'),
    magenta: cssVar('--codeAgent-elements-terminal-color-magenta'),
    cyan: cssVar('--codeAgent-elements-terminal-color-cyan'),
    white: cssVar('--codeAgent-elements-terminal-color-white'),
    brightBlack: cssVar('--codeAgent-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--codeAgent-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--codeAgent-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--codeAgent-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--codeAgent-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--codeAgent-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--codeAgent-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--codeAgent-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}
