import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Clock, MessageSquare } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

export default function ApprovalTimeline({ eventId }) {
  const [workflow, setWorkflow] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkflow()
  }, [eventId])

  const fetchWorkflow = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/events/${eventId}/workflow`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const data = await response.json()
      setWorkflow(data.data)
    } catch (error) {
      console.error('Error fetching workflow:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading approval status...</div>
  }

  if (!workflow) {
    return <div className="text-center py-8 text-gray-500">No workflow found</div>
  }

  const steps = [
    { key: 'submitted', label: 'Submitted', date: workflow.submitted_at },
    { key: 'review', label: 'Under Review', date: workflow.reviewed_at },
    { key: 'approved', label: 'Approved', date: workflow.reviewed_at },
    { key: 'rejected', label: 'Rejected', date: workflow.reviewed_at },
  ]

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    revision_requested: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Approval Status</h3>
        
        <div className="flex items-center gap-3 mb-6">
          {workflow.current_step === 'approved' && (
            <>
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors.approved}`}>
                Approved
              </span>
            </>
          )}
          {workflow.current_step === 'rejected' && (
            <>
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors.rejected}`}>
                Rejected
              </span>
            </>
          )}
          {workflow.current_step === 'revision_requested' && (
            <>
              <Clock className="w-8 h-8 text-orange-600" />
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors.revision_requested}`}>
                Revisions Requested
              </span>
            </>
          )}
          {workflow.current_step === 'review' && (
            <>
              <Clock className="w-8 h-8 text-yellow-600" />
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors.review}`}>
                Under Review
              </span>
            </>
          )}
          {workflow.current_step === 'submitted' && (
            <>
              <Clock className="w-8 h-8 text-blue-600" />
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors.submitted}`}>
                Submitted
              </span>
            </>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <div className="w-1 h-12 bg-gray-200"></div>
            </div>
            <div className="pb-8">
              <p className="font-semibold text-gray-900">Submitted</p>
              <p className="text-sm text-gray-600">
                {workflow.submitted_at ? formatDate(workflow.submitted_at) : 'Not yet'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${
                ['review', 'approved', 'rejected', 'revision_requested'].includes(workflow.current_step)
                  ? 'bg-yellow-600'
                  : 'bg-gray-300'
              }`}></div>
              <div className="w-1 h-12 bg-gray-200"></div>
            </div>
            <div className="pb-8">
              <p className="font-semibold text-gray-900">Under Review</p>
              <p className="text-sm text-gray-600">
                Pending approval from staff member
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${
                workflow.current_step === 'approved'
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}></div>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Approved</p>
              <p className="text-sm text-gray-600">
                {workflow.reviewed_at ? formatDate(workflow.reviewed_at) : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Review Notes */}
        {workflow.review_notes && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4" />
              Review Notes
            </h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded">
              {workflow.review_notes}
            </p>
          </div>
        )}

        {/* Revision Deadline */}
        {workflow.current_step === 'revision_requested' && workflow.revision_deadline && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Revision Deadline:</span>{' '}
              {formatDate(workflow.revision_deadline)}
            </p>
          </div>
        )}

        {/* Feedback Section */}
        {workflow.feedback && workflow.feedback.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">Feedback History</h4>
            <div className="space-y-3">
              {workflow.feedback.map((feedback) => (
                <div key={feedback.id} className="bg-gray-50 p-4 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{feedback.user.name}</p>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {feedback.feedback_type}
                    </span>
                  </div>
                  <p className="text-gray-700">{feedback.feedback_text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(feedback.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
