import React, { useEffect, useState } from 'react';
import { ThumbsUp, MessageCircle, Trash2, CheckCircle } from 'lucide-react';
import { useQA } from '../../context/QAContext';
import qaService from '../../services/qaService';

export default function QuestionsFeed({ eventId, isOrganizer = false }) {
  const { getEventQuestions, voteOnQuestion } = useQA();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState(new Set());

  useEffect(() => {
    loadQuestions();
  }, [eventId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = getEventQuestions(eventId);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (questionId) => {
    if (userVotes.has(questionId)) {
      setUserVotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    } else {
      setUserVotes(prev => new Set([...prev, questionId]));
    }
    voteOnQuestion(questionId, 'up');
  };

  const handleMarkAnswered = async (questionId) => {
    try {
      await qaService.markQuestionAnswered(questionId);
      loadQuestions();
    } catch (error) {
      console.error('Error marking question answered:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await qaService.deleteQuestion(questionId);
      loadQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
        No questions yet. Be the first to ask!
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">
        Questions & Answers ({questions.length})
      </h3>

      <div className="space-y-3">
        {questions.map(q => (
          <div
            key={q.id}
            className={`border rounded-lg p-4 transition-colors ${
              q.status === 'answered' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{q.question}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <span className="px-2 py-1 bg-gray-200 rounded text-gray-700">
                    {q.category}
                  </span>
                  {q.status === 'answered' && (
                    <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded">
                      <CheckCircle className="h-3 w-3" />
                      Answered
                    </span>
                  )}
                </div>
              </div>

              {isOrganizer && (
                <div className="flex gap-1">
                  {q.status !== 'answered' && (
                    <button
                      onClick={() => handleMarkAnswered(q.id)}
                      className="p-2 hover:bg-green-100 rounded transition-colors"
                      title="Mark as answered"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 hover:bg-red-100 rounded transition-colors"
                    title="Delete question"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-4 text-sm">
              <button
                onClick={() => handleVote(q.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  userVotes.has(q.id)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                {q.votes}
              </button>
              <div className="flex items-center gap-1 text-gray-600">
                <MessageCircle className="h-4 w-4" />
                {q.answers} answers
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
