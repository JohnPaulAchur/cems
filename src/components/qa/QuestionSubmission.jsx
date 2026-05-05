import React, { useState } from 'react';
import { Send, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useQA } from '../../context/QAContext';
import qaService from '../../services/qaService';

export default function QuestionSubmission({ eventId }) {
  const { submitQuestion } = useQA();
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('general');
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'general', label: 'General Question' },
    { id: 'technical', label: 'Technical Issue' },
    { id: 'clarification', label: 'Clarification' },
    { id: 'feedback', label: 'Feedback' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setSubmitting(true);
      await submitQuestion(eventId, question, category);
      await qaService.submitQuestion(eventId, question, category);
      
      setQuestion('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-blue-600" />
        Ask a Question
      </h3>

      {submitted && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
          Your question has been submitted anonymously!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question here... (keep it concise and clear)"
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="mt-1 text-xs text-gray-500">
            {question.length}/500 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <button
            type="button"
            onClick={() => setAnonymous(!anonymous)}
            className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            {anonymous ? (
              <>
                <EyeOff className="h-4 w-4" />
                Anonymous
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Identified
              </>
            )}
          </button>
          <span className="text-xs text-blue-600">
            {anonymous ? 'Your name won\'t be shared' : 'Your name will be visible'}
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting || !question.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          {submitting ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
    </div>
  );
}
