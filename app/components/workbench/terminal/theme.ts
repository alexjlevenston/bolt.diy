import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--codeagent-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--codeagent-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--codeagent-elements-terminal-textColor'),
    background: cssVar('--codeagent-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--codeagent-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--codeagent-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--codeagent-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--codeagent-elements-terminal-color-black'),
    red: cssVar('--codeagent-elements-terminal-color-red'),
    green: cssVar('--codeagent-elements-terminal-color-green'),
    yellow: cssVar('--codeagent-elements-terminal-color-yellow'),
    blue: cssVar('--codeagent-elements-terminal-color-blue'),
    magenta: cssVar('--codeagent-elements-terminal-color-magenta'),
    cyan: cssVar('--codeagent-elements-terminal-color-cyan'),
    white: cssVar('--codeagent-elements-terminal-color-white'),
    brightBlack: cssVar('--codeagent-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--codeagent-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--codeagent-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--codeagent-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--codeagent-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--codeagent-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--codeagent-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--codeagent-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}
