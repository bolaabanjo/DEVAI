
export enum Tool {
  BUG_EXPLAINER = 'Bug Explainer',
  SNIPPET_MANAGER = 'Snippet Manager',
  COMMIT_GENERATOR = 'Commit Generator',
}

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
}
