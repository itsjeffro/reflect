'use client'

import '@mdxeditor/editor/style.css'

import { BoldItalicUnderlineToggles, CreateLink, headingsPlugin, linkDialogPlugin, linkPlugin, listsPlugin, ListsToggle, markdownShortcutPlugin, MDXEditor, toolbarPlugin, type MDXEditorMethods } from '@mdxeditor/editor'
import { useEffect, useRef, type Ref } from 'react';
import { mergeRefs } from '../utils';

type EditorProps = {
  value?: string;
  onChange: () => void;
  ref?: Ref<MDXEditorMethods>;
};

/**
 * NOTE to self
 * - The markdownShortcutPlugin needs to be after markdown plugins for the auto convert to work during plain text typing.
 */
export const Editor = ({ value = '', ref, onChange, ...props }: EditorProps) => {
  const markdownRef = useRef<MDXEditorMethods>(null)

  useEffect(() => {
    markdownRef.current?.setMarkdown(value ?? '')
  }, [value]);

  return (
    <MDXEditor
      {...props}
      markdown={value}
      ref={mergeRefs([ref, markdownRef])}
      onChange={onChange}
      className='editor'
      contentEditableClassName="editor__content-editable"
      plugins={[
        listsPlugin(),
        linkDialogPlugin(),
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarClassName: 'editor_toolbar',
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <CreateLink />
            </>
          )
        })
      ]}
    />
  )
}