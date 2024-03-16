import StarterKit from '@tiptap/starter-kit'
import { Dispatch, SetStateAction } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'

import { MenuBar } from './MenuBar'

interface EditorProps {
  content: string | undefined
  setContent: Dispatch<SetStateAction<string | undefined>>
}

const Editor = ({ content, setContent }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        spellcheck: 'false',
        class:
          'w-full p-3 h-52 prose prose-base prose-zinc dark:prose-invert border rounded focus:outline-none whitespace-pre-wrap break-words overflow-y-auto focus:outline-2 focus:outline-offset-2 focus:outline-primary',
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML())
    },
  })

  return (
    <div className="flex items-start flex-col gap-4">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        content={content}
        className="w-full h-52"
      />
    </div>
  )
}

Editor.displayName = 'Editor'

export { Editor }
