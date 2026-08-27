import React, { useState } from 'react';
import { Lesson, LessonType, CreateLessonPayload, UpdateLessonPayload } from '../../../types/lesson';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Quote, Code, Terminal, Link as LinkIcon, Table } from 'lucide-react';

interface LessonFormProps {
  courseId: string;
  onSubmit: (data: CreateLessonPayload | (UpdateLessonPayload & { id: string })) => Promise<void>;
  initialValues?: Lesson;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

const LessonForm: React.FC<LessonFormProps> = ({
  courseId,
  onSubmit,
  initialValues,
  onCancel,
  isLoading,
  error,
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [type, setType] = useState<LessonType>(initialValues?.type ?? 'VIDEO');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [videoUrl, setVideoUrl] = useState(initialValues?.videoUrl ?? '');
  const [position, setPosition] = useState(initialValues?.position?.toString() ?? '');
  const [formError, setFormError] = useState('');

  const isEdit = !!initialValues;

  const insertMarkdown = (syntax: string, placeholder = '') => {
    const textarea = document.getElementById('lf-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let selectionOffsetStart = 0;
    let selectionOffsetEnd = 0;

    switch (syntax) {
      case 'bold':
        replacement = `**${selectedText || placeholder || 'bold text'}**`;
        selectionOffsetStart = 2;
        selectionOffsetEnd = replacement.length - 2;
        break;
      case 'italic':
        replacement = `*${selectedText || placeholder || 'italic text'}*`;
        selectionOffsetStart = 1;
        selectionOffsetEnd = replacement.length - 1;
        break;
      case 'strikethrough':
        replacement = `~~${selectedText || placeholder || 'strikethrough text'}~~`;
        selectionOffsetStart = 2;
        selectionOffsetEnd = replacement.length - 2;
        break;
      case 'h1':
        replacement = `# ${selectedText || placeholder || 'Heading 1'}`;
        selectionOffsetStart = 2;
        selectionOffsetEnd = replacement.length;
        break;
      case 'h2':
        replacement = `## ${selectedText || placeholder || 'Heading 2'}`;
        selectionOffsetStart = 3;
        selectionOffsetEnd = replacement.length;
        break;
      case 'h3':
        replacement = `### ${selectedText || placeholder || 'Heading 3'}`;
        selectionOffsetStart = 4;
        selectionOffsetEnd = replacement.length;
        break;
      case 'code':
        replacement = `\`\`\`\n${selectedText || placeholder || 'code block'}\n\`\`\``;
        selectionOffsetStart = 4;
        selectionOffsetEnd = replacement.length - 4;
        break;
      case 'inline-code':
        replacement = `\`${selectedText || placeholder || 'code'}\``;
        selectionOffsetStart = 1;
        selectionOffsetEnd = replacement.length - 1;
        break;
      case 'list':
        replacement = `\n- ${selectedText || placeholder || 'List item'}`;
        selectionOffsetStart = 3;
        selectionOffsetEnd = replacement.length;
        break;
      case 'list-ol':
        replacement = `\n1. ${selectedText || placeholder || 'List item'}`;
        selectionOffsetStart = 4;
        selectionOffsetEnd = replacement.length;
        break;
      case 'checklist':
        replacement = `\n- [ ] ${selectedText || placeholder || 'Task item'}`;
        selectionOffsetStart = 8;
        selectionOffsetEnd = replacement.length;
        break;
      case 'blockquote':
        replacement = `\n> ${selectedText || placeholder || 'Quote text'}`;
        selectionOffsetStart = 3;
        selectionOffsetEnd = replacement.length;
        break;
      case 'link':
        replacement = `[${selectedText || placeholder || 'link text'}](https://example.com)`;
        selectionOffsetStart = 1;
        selectionOffsetEnd = selectedText ? selectedText.length + 1 : (placeholder || 'link text').length + 1;
        break;
      case 'table':
        replacement = `\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n`;
        selectionOffsetStart = 2;
        selectionOffsetEnd = replacement.length;
        break;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    // Refocus the textarea and set the selection range
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + selectionOffsetStart, start + selectionOffsetEnd);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) { setFormError('Title is required.'); return; }
    if (!type) { setFormError('Please select a lesson type.'); return; }

    const submitContent = type === 'NOTES' ? (content.trim() || undefined) : undefined;
    const submitVideoUrl = type === 'VIDEO' ? (videoUrl.trim() || undefined) : undefined;

    if (isEdit && initialValues) {
      await onSubmit({
        id: initialValues.id,
        title: title.trim(),
        type,
        content: submitContent,
        videoUrl: submitVideoUrl,
        position: position ? parseInt(position) : undefined,
      });
    } else {
      await onSubmit({
        courseId,
        title: title.trim(),
        type,
        content: submitContent,
        videoUrl: submitVideoUrl,
        position: position ? parseInt(position) : undefined,
      });
    }
  };

  const displayError = error || formError;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="lf-title" className="text-sm font-medium text-gray-700">Lesson Title *</label>
        <Input
          id="lf-title"
          type="text"
          placeholder="e.g. Introduction to Node.js"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="lf-type" className="text-sm font-medium text-gray-700">Type *</label>
          <select
            id="lf-type"
            value={type}
            onChange={(e) => setType(e.target.value as LessonType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="VIDEO">Video</option>
            <option value="NOTES">Notes</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 w-24">
          <label htmlFor="lf-pos" className="text-sm font-medium text-gray-700">Position</label>
          <Input
            id="lf-pos"
            type="number"
            min="1"
            placeholder="1"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
      </div>

      {type === 'VIDEO' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="lf-url" className="text-sm font-medium text-gray-700">Video URL</label>
          <Input
            id="lf-url"
            type="url"
            placeholder="https://youtube.com/..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      )}

      {type === 'NOTES' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="lf-content" className="text-sm font-medium text-gray-700">Content (Markdown)</label>
          
          {/* Markdown Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-50 border border-b-0 border-gray-300 rounded-t-lg">
            <button
              type="button"
              onClick={() => insertMarkdown('bold', 'bold text')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs flex items-center justify-center w-7 h-7"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('italic', 'italic text')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 italic text-xs flex items-center justify-center w-7 h-7"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('strikethrough', 'strikethrough text')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown('h1', 'Heading 1')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs flex items-center justify-center w-7 h-7"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('h2', 'Heading 2')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs flex items-center justify-center w-7 h-7"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('h3', 'Heading 3')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs flex items-center justify-center w-7 h-7"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown('list', 'List item')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('list-ol', 'List item')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('checklist', 'Task item')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Task List"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown('blockquote', 'Quote text')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('inline-code', 'code')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Inline Code"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('code', 'code block')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown('link', 'link text')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('table')}
              className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center w-7 h-7"
              title="Insert Table"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          <textarea
            id="lf-content"
            rows={5}
            placeholder="Write your lesson notes in Markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-b-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[120px]"
          />
        </div>
      )}

      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {displayError}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" isLoading={isLoading}>
          {isEdit ? 'Update Lesson' : 'Add Lesson'}
        </Button>
      </div>
    </form>
  );
};

export default LessonForm;
