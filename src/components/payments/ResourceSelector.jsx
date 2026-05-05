import React, { useState, useEffect } from 'react'
import { ShoppingCart, X } from 'lucide-react'

export default function ResourceSelector({ eventId, onResourcesSelected }) {
  const [resources, setResources] = useState([])
  const [selectedResources, setSelectedResources] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventResources()
  }, [eventId])

  const fetchEventResources = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/event/${eventId}/checkout-data`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const data = await response.json()
      setResources(data.data.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleResource = (resource) => {
    const existing = selectedResources.find(r => r.id === resource.id)
    
    if (existing) {
      setSelectedResources(selectedResources.filter(r => r.id !== resource.id))
    } else {
      setSelectedResources([...selectedResources, { ...resource, quantity: 1 }])
    }
  }

  const updateQuantity = (resourceId, quantity) => {
    if (quantity < 1) return
    
    setSelectedResources(selectedResources.map(r => 
      r.id === resourceId ? { ...r, quantity } : r
    ))
  }

  const removeResource = (resourceId) => {
    setSelectedResources(selectedResources.filter(r => r.id !== resourceId))
  }

  useEffect(() => {
    const cost = selectedResources.reduce((sum, r) => 
      sum + (r.cost * r.quantity), 0
    )
    setTotalCost(cost)
    onResourcesSelected(selectedResources, cost)
  }, [selectedResources])

  if (loading) {
    return <div className="text-center py-8">Loading resources...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map(resource => (
            <div
              key={resource.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedResources.find(r => r.id === resource.id)
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleResource(resource)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{resource.type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">
                      Rs. {resource.cost}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({resource.available} available)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-6 h-6 rounded border border-gray-300">
                  {selectedResources.find(r => r.id === resource.id) && (
                    <span className="text-blue-600">✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedResources.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Selected Resources
          </h3>
          
          <div className="space-y-3 mb-4">
            {selectedResources.map(resource => (
              <div key={resource.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div>
                  <p className="font-medium text-gray-900">{resource.type}</p>
                  <p className="text-sm text-gray-500">Rs. {resource.cost} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(resource.id, resource.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={resource.quantity}
                      onChange={(e) => updateQuantity(resource.id, parseInt(e.target.value) || 1)}
                      className="w-12 text-center border rounded"
                    />
                    <button
                      onClick={() => updateQuantity(resource.id, resource.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900 w-16 text-right">
                    Rs. {(resource.cost * resource.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeResource(resource.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Cost:</span>
              <span className="text-2xl font-bold text-blue-600">
                Rs. {totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
