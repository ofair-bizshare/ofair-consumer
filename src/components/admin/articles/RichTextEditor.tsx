
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor">
      <div className="toolbar flex items-center gap-1 mb-2 p-1 border border-input bg-background rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive('bold') ? 'bg-muted' : '')}
          title="כתב מודגש"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive('italic') ? 'bg-muted' : '')}
          title="כתב נטוי"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(editor.isActive('heading', { level: 2 }) ? 'bg-muted' : '')}
          title="כותרת"
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(editor.isActive('heading', { level: 3 }) ? 'bg-muted' : '')}
          title="כותרת משנה"
        >
          H3
        </Button>
        
        <div className="flex items-center ml-2 gap-1">
          <Palette className="h-4 w-4 text-gray-500 mr-1" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-6 h-6 rounded-md bg-blue-500"
            title="כחול"
            onClick={() => editor.chain().focus().setColor('#3b82f6').run()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-6 h-6 rounded-md bg-red-500"
            title="אדום"
            onClick={() => editor.chain().focus().setColor('#ef4444').run()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-6 h-6 rounded-md bg-green-500"
            title="ירוק"
            onClick={() => editor.chain().focus().setColor('#22c55e').run()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-6 h-6 rounded-md bg-purple-500"
            title="סגול"
            onClick={() => editor.chain().focus().setColor('#a855f7').run()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-6 h-6 rounded-md bg-gray-900"
            title="שחור"
            onClick={() => editor.chain().focus().setColor('#000000').run()}
          />
        </div>
      </div>

      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};

export default RichTextEditor;
