import { Editor } from '@tiptap/react'
import {
  ListNumbers,
  ArrowUDownLeft,
  ArrowUDownRight,
} from '@phosphor-icons/react'
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MenuBarProps {
  editor: Editor | null
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex w-full items-center gap-2 justify-between">
      <ToggleGroup type="multiple" variant="outline" size="lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="bold"
              aria-label="Toggle bold"
              data-state={editor.isActive('bold') ? 'on' : 'off'}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              <FontBoldIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent>Negrito</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="italic"
              aria-label="Toggle italic"
              data-state={editor.isActive('italic') ? 'on' : 'off'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              <FontItalicIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent>Itálico</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="bullet-list"
              aria-label="Bullet List"
              data-state={editor.isActive('bulletList') ? 'on' : 'off'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
            >
              <ListBulletIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent>Lista de Marcadores</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="ordered-list"
              aria-label="Ordered List"
              data-state={editor.isActive('orderedList') ? 'on' : 'off'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            >
              <ListNumbers className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent>Lista Numerada</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="code-block"
              aria-label="Code Block"
              data-state={editor.isActive('codeBlock') ? 'on' : 'off'}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
            >
              <CodeIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent>Bloco de Código</TooltipContent>
        </Tooltip>
      </ToggleGroup>

      <ToggleGroup type="multiple" variant="outline" size="lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="undo"
              aria-label="Undo"
              data-state={editor.isActive('undo') ? 'on' : 'off'}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <ArrowUDownLeft className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent>Desfazer</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="redo"
              aria-label="Redo"
              data-state={editor.isActive('redo') ? 'on' : 'off'}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <ArrowUDownRight className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent>Refazer</TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </div>
  )
}

MenuBar.displayName = 'MenuBar'

export { MenuBar }
