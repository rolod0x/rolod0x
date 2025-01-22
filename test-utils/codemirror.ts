import { act, screen } from '@testing-library/react';
import { EditorView } from '@codemirror/view';

// Helper function to get the CodeMirror view instance
export const getCodeMirrorView = async (): Promise<EditorView> => {
  const editor = await screen.findByTestId('codeMirror-editor');
  const view = EditorView.findFromDOM(editor as HTMLElement);
  if (!view) {
    throw new Error('CodeMirror view not found');
  }
  return view;
};

// Helper function to simulate text input in CodeMirror
export const setCodeMirrorValue = async (value: string) => {
  await act(async () => {
    const view = await getCodeMirrorView();
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
    });
  });
};
