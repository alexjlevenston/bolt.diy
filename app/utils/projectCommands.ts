import type { Message } from 'ai';
import { generateId } from './fileUtils';

export interface ProjectCommands {
  type: string;
  setupCommand?: string;
  startCommand?: string;
  followupMessage: string;
}

interface FileContent {
  content: string;
  path: string;
}

export async function detectProjectCommands(files: FileContent[]): Promise<ProjectCommands> {
  const hasFile = (name: string) => files.some((f) => f.path.endsWith(name));

  if (hasFile('package.json')) {
    const packageJsonFile = files.find((f) => f.path.endsWith('package.json'));

    if (!packageJsonFile) {
      return { type: '', setupCommand: '', followupMessage: '' };
    }

    try {
      const packageJson = JSON.parse(packageJsonFile.content);
      const scripts = packageJson?.scripts || {};

      // Check for preferred commands in priority order
      const preferredCommands = ['dev', 'start', 'preview'];
      const availableCommand = preferredCommands.find((cmd) => scripts[cmd]);

      if (availableCommand) {
        return {
          type: 'Node.js',
          setupCommand: `npm install`,
          startCommand: `npm run ${availableCommand}`,
          followupMessage: `Found "${availableCommand}" script in package.json. Running "npm run ${availableCommand}" after installation.`,
        };
      }

      return {
        type: 'Node.js',
        setupCommand: 'npm install',
        followupMessage:
          'Would you like me to inspect package.json to determine the available scripts for running this project?',
      };
    } catch (error) {
      console.error('Error parsing package.json:', error);
      return { type: '', setupCommand: '', followupMessage: '' };
    }
  }

  if (hasFile('index.html')) {
    return {
      type: 'Static',
      startCommand: 'npx --yes serve',
      followupMessage: '',
    };
  }

  return { type: '', setupCommand: '', followupMessage: '' };
}

export function createCommandsMessage(commands: ProjectCommands): Message | null {
  if (!commands.setupCommand && !commands.startCommand) {
    return null;
  }

  let commandString = '';

  if (commands.setupCommand) {
    commandString += `
<codeagentAction type="shell">${commands.setupCommand}</codeagentAction>`;
  }

  if (commands.startCommand) {
    commandString += `
<codeagentAction type="start">${commands.startCommand}</codeagentAction>
`;
  }

  return {
    role: 'assistant',
    content: `
<codeagentArtifact id="project-setup" title="Project Setup">
${commandString}
</codeagentArtifact>${commands.followupMessage ? `\n\n${commands.followupMessage}` : ''}`,
    id: generateId(),
    createdAt: new Date(),
  };
}

export function escapeCodeAgentArtifactTags(input: string) {
  // Regular expression to match codeagentArtifact tags and their content
  const regex = /(<codeagentArtifact[^>]*>)([\s\S]*?)(<\/codeagentArtifact>)/g;

  return input.replace(regex, (match, openTag, content, closeTag) => {
    // Escape the opening tag
    const escapedOpenTag = openTag.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Escape the closing tag
    const escapedCloseTag = closeTag.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Return the escaped version
    return `${escapedOpenTag}${content}${escapedCloseTag}`;
  });
}

export function escapeCodeAgentAActionTags(input: string) {
  // Regular expression to match codeagentArtifact tags and their content
  const regex = /(<codeagentAction[^>]*>)([\s\S]*?)(<\/codeagentAction>)/g;

  return input.replace(regex, (match, openTag, content, closeTag) => {
    // Escape the opening tag
    const escapedOpenTag = openTag.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Escape the closing tag
    const escapedCloseTag = closeTag.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Return the escaped version
    return `${escapedOpenTag}${content}${escapedCloseTag}`;
  });
}

export function escapeCodeAgentTags(input: string) {
  return escapeCodeAgentArtifactTags(escapeCodeAgentAActionTags(input));
}
