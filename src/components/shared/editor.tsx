"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import {
  Bold, Italic, Underline as UnderlineIcon,
  Link as LinkIcon, Image as ImageIcon,
  List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo,
  FileCode, Eye, Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { marked } from "marked";
import { ImageUpload } from "@/components/shared/image-upload";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type EditorMode = "rich" | "markdown" | "preview";

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: EditorProps) {
  const [mode, setMode] = useState<EditorMode>("rich");
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
      }),
      ImageExtension,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (mode === "rich") {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
          "min-h-[300px] max-w-none p-6"
        ),
      },
    },
  });

  // Sync content into TipTap when switching to rich mode if updated elsewhere
  useEffect(() => {
    if (editor && mode === "rich") {
      const currentHtml = editor.getHTML();
      if (content !== currentHtml) {
        let htmlContent = content;
        if (content && !content.trim().startsWith("<")) {
          htmlContent = marked.parse(content, { async: false }) as string;
        }
        editor.commands.setContent(htmlContent);
      }
    }
  }, [mode, content, editor]);

  const insertMarkdownSyntax = (prefix: string, suffix: string = "") => {
    const textarea = markdownRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || "text"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 0);
  };

  const openLinkDialog = useCallback(() => {
    if (mode === "markdown") {
      insertMarkdownSyntax("[", "](https://example.com)");
      return;
    }
    const previousUrl = editor?.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setIsLinkOpen(true);
  }, [editor, mode]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setIsLinkOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const openImageDialog = useCallback(() => {
    setIsImageOpen(true);
    setImageUrl("");
  }, []);

  const applyImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setIsImageOpen(false);
    setImageUrl("");
  }, [editor, imageUrl]);

  const ToolbarButton = ({
    onClick,
    active = false,
    children,
    title
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors hover:bg-muted text-xs font-medium flex items-center gap-1",
        active ? "bg-muted text-foreground font-semibold" : "text-muted-foreground"
      )}
    >
      {children}
    </button>
  );

  const renderedPreview = () => {
    if (!content) return "<p class='text-muted-foreground italic'>Nothing to preview</p>";
    if (content.trim().startsWith("<")) {
      return content;
    }
    return marked.parse(content, { async: false }) as string;
  };

  return (
    <>
      <div className="border border-border rounded-lg bg-background overflow-hidden flex flex-col">
        {/* Editor Top Bar with Mode Selector & Toolbar */}
        <div className="border-b border-border p-2 flex flex-wrap items-center justify-between gap-2 bg-muted/20">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border border-border/50">
            <button
              type="button"
              onClick={() => setMode("rich")}
              className={cn(
                "px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-all",
                mode === "rich" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Edit3 className="w-3.5 h-3.5" /> Rich Text
            </button>
            <button
              type="button"
              onClick={() => setMode("markdown")}
              className={cn(
                "px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-all",
                mode === "markdown" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileCode className="w-3.5 h-3.5" /> Markdown
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={cn(
                "px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-all",
                mode === "preview" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>

          {/* Action Toolbar */}
          {mode === "rich" && editor && (
            <div className="flex flex-wrap items-center gap-1">
              <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
                <UnderlineIcon className="w-4 h-4" />
              </ToolbarButton>

              <div className="w-px h-4 bg-border mx-1" />

              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
                <Heading1 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
                <Heading2 className="w-4 h-4" />
              </ToolbarButton>

              <div className="w-px h-4 bg-border mx-1" />

              <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
                <Quote className="w-4 h-4" />
              </ToolbarButton>

              <div className="w-px h-4 bg-border mx-1" />

              <ToolbarButton onClick={openLinkDialog} active={editor.isActive("link")} title="Add Link">
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={openImageDialog} title="Add Image">
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>

              <div className="ml-auto flex items-center gap-1">
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                  <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                  <Redo className="w-4 h-4" />
                </ToolbarButton>
              </div>
            </div>
          )}

          {mode === "markdown" && (
            <div className="flex flex-wrap items-center gap-1">
              <ToolbarButton onClick={() => insertMarkdownSyntax("**", "**")} title="Bold">
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdownSyntax("*", "*")} title="Italic">
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-4 bg-border mx-1" />
              <ToolbarButton onClick={() => insertMarkdownSyntax("# ")} title="Heading 1">
                <Heading1 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdownSyntax("## ")} title="Heading 2">
                <Heading2 className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-4 bg-border mx-1" />
              <ToolbarButton onClick={() => insertMarkdownSyntax("- ")} title="Bullet List">
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdownSyntax("1. ")} title="Numbered List">
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdownSyntax("> ")} title="Quote">
                <Quote className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-4 bg-border mx-1" />
              <ToolbarButton onClick={openLinkDialog} title="Add Link">
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={openImageDialog} title="Add Image">
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
            </div>
          )}
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto">
          {mode === "rich" && editor && (
            <EditorContent editor={editor} />
          )}

          {mode === "markdown" && (
            <div className="p-4 min-h-[300px] flex flex-col">
              <Textarea
                ref={markdownRef}
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder + " (Write Markdown here... e.g. # Heading, **bold**)"}
                className="font-mono text-sm min-h-[300px] flex-1 resize-y border-0 focus-visible:ring-0 p-2 leading-relaxed"
              />
            </div>
          )}

          {mode === "preview" && (
            <div className="p-6 min-h-[300px] prose prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderedPreview() }} />
            </div>
          )}
        </div>
      </div>

      <Dialog open={isLinkOpen} onOpenChange={setIsLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applyLink(); }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { editor?.chain().focus().extendMarkRange("link").unsetLink().run(); setIsLinkOpen(false); }}>
              Remove
            </Button>
            <Button onClick={applyLink}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <ImageUpload
              value={imageUrl}
              onChange={(url) => {
                setImageUrl(url);
                if (mode === "markdown") {
                  insertMarkdownSyntax(`![Image](${url})`);
                } else if (editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
                setIsImageOpen(false);
                setImageUrl("");
              }}
              onRemove={() => setImageUrl("")}
              label="Select or Drag image file to upload"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
