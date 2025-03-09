// TaskDetail.js
import React, { useState } from 'react';
import { CheckCircle, Image } from 'lucide-react';
import { detectImageUrl } from './image-utils';

function TaskDetail({ activeTask, taskNotes, setTaskNotes, handleTaskAction, isSaving, saveSuccess, onViewInOHIF }) {
  if (!activeTask) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 h-96 flex flex-col items-center justify-center text-gray-500">
        <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>Select a task to view details</p>
      </div>
    );
  }

  const isImageResource = detectImageUrl(activeTask.linkUrl);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          {activeTask.linkTitle}
        </h3>
        <p className="text-gray-600">
          Project: {activeTask.projectName} • Organization: {activeTask.organizationName}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a 
            href={activeTask.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Resource Link
          </a>
          
          {isImageResource && (
            <button
              onClick={() => onViewInOHIF(activeTask.linkUrl)}
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md flex items-center transition-colors"
            >
              <Image className="w-4 h-4 mr-2" />
              View in DICOM Viewer
            </button>
          )}
        </div>
      </div>

      {activeTask.status === 'completed' ? (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
          <CheckCircle className="w-6 h-6 mr-2" />
          This task has been marked as completed
        </div>
      ) : (
        <>
          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              rows={8}
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Add your notes about this task here..."
            />
          </div>

          {saveSuccess && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
              Changes saved successfully!
            </div>
          )}

          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => handleTaskAction('save-draft')}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              onClick={() => handleTaskAction('complete')}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Mark as Complete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskDetail;