import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { doubtsService } from '../../services/doubts.service';
import { useAuth } from '../../context/AuthContext';

export interface AskDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCreated?: (newDoubt: any) => void;
}

export const AskDoubtModal: React.FC<AskDoubtModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onCreated,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [tags, setTags] = useState('Mathematics, University Level');
  const [description, setDescription] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      await doubtsService.createDoubt({
        title,
        description,
        codeSnippet: codeSnippet.trim() || undefined,
        subject,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isUrgent,
        pointsReward: isUrgent ? 150 : 50,
        authorName: user?.name || 'Alex Mercer',
        authorAvatar: user?.avatar,
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      onClose();
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ask a Doubt"
      subtitle="Share your question with peers and master solvers to get fast answers."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Question Title"
          placeholder="e.g., Need help with partial differential equations (Heat Equation)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#151C2F] mb-1.5">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#151C2F] outline-none focus:border-[#0057BE]"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Input
              label="Tags (comma separated)"
              placeholder="e.g., Python, Recursion"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#151C2F] mb-1.5">
            Detailed Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain where you are stuck and what you've tried so far..."
            className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#151C2F] placeholder-[#98A2B3] outline-none focus:border-[#0057BE] focus:ring-2 focus:ring-[#0057BE]/15"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#151C2F] mb-1.5">
            Code Snippet or Equations (Optional)
          </label>
          <textarea
            rows={2}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="def foo(): ..."
            className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 font-mono text-xs text-[#151C2F] placeholder-[#98A2B3] outline-none focus:border-[#0057BE]"
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-[#FFF1F2] rounded-lg border border-[#FFE4E6]">
          <input
            type="checkbox"
            id="urgent-check"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="rounded text-[#E11D48] focus:ring-[#E11D48] h-4 w-4"
          />
          <label htmlFor="urgent-check" className="text-xs font-semibold text-[#E11D48] cursor-pointer">
            Mark as Urgent (+150 Pts bounty, prioritized solver queue)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post Doubt'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
