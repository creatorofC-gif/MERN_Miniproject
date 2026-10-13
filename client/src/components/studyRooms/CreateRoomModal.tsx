import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { roomsService } from '../../services/rooms.service';

export interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCreated?: (newRoom: any) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onCreated,
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [vibe, setVibe] = useState('Lofi Beats');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const room = await roomsService.createRoom({
        name,
        subject,
        vibe,
        description,
        category: 'STEM HUB',
      });
      const roomId = room._id || room.id;
      if (onCreated) onCreated(room);
      if (onSuccess) onSuccess();
      onClose();
      if (roomId) {
        navigate(`/study-rooms/${roomId}`);
      }
    } catch (err: any) {
      console.error('Failed to create room:', err);
      setError(err?.message || 'Failed to create room. Please verify you are logged in and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a New Study Room"
      subtitle="Launch an immersive, focused study space for your peers."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}
        <Input
          label="Room Name"
          placeholder="e.g., Organic Chemistry Midterm Sprint"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            <label className="block text-sm font-medium text-[#151C2F] mb-1.5">
              Atmosphere / Audio
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#151C2F] outline-none focus:border-[#0057BE]"
            >
              <option value="Lofi Beats">Lofi Beats</option>
              <option value="Deep Silence">Deep Silence</option>
              <option value="Active Discussion">Active Discussion</option>
              <option value="Pomodoro">Pomodoro Sprint</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#151C2F] mb-1.5">
            Description & Goals
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are we solving today? e.g. Working through problem set 4."
            className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#151C2F] placeholder-[#98A2B3] outline-none focus:border-[#0057BE] focus:ring-2 focus:ring-[#0057BE]/15"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Start Study Room'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
