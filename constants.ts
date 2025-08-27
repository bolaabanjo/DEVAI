
export const COMMIT_TYPES = [
  { value: 'feat', label: 'feat: A new feature' },
  { value: 'fix', label: 'fix: A bug fix' },
  { value: 'docs', label: 'docs: Documentation only changes' },
  { value: 'style', label: 'style: Changes that do not affect the meaning of the code' },
  { value: 'refactor', label: 'refactor: A code change that neither fixes a bug nor adds a feature' },
  { value: 'perf', label: 'perf: A code change that improves performance' },
  { value: 'test', label: 'test: Adding missing tests or correcting existing tests' },
  { value: 'build', label: 'build: Changes that affect the build system or external dependencies' },
  { value: 'ci', label: 'ci: Changes to our CI configuration files and scripts' },
  { value: 'chore', label: 'chore: Other changes that don\'t modify src or test files' },
  { value: 'revert', label: 'revert: Reverts a previous commit' },
];
