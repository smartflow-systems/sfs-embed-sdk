/**
 * SFS Embed SDK - Changelog Widget
 * Display latest product updates with badge notification
 */

import { useState, useEffect } from 'react';
import type { ChangelogWidgetConfig, ChangelogEntry } from '../types';

interface ChangelogWidgetProps {
  config: ChangelogWidgetConfig;
  workspaceId: string;
  apiKey?: string;
}

export function ChangelogWidget({ config, workspaceId, apiKey }: ChangelogWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchChangelog();
  }, []);

  useEffect(() => {
    // Calculate unread count
    const unread = entries.filter((entry) => !isEntryRead(entry.id)).length;
    setUnreadCount(unread);
  }, [entries]);

  const fetchChangelog = async () => {
    setIsLoading(true);

    try {
      const apiUrl = config.apiUrl || 'https://api.sfs.dev';
      const response = await fetch(
        `${apiUrl}/changelog/${workspaceId}?limit=${config.maxItems || 10}`,
        {
          headers: {
            ...(apiKey && { 'X-SFS-API-Key': apiKey }),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch changelog');
      }

      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Changelog fetch error:', error);
      // Use mock data for demo purposes
      setEntries(getMockEntries());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockEntries = (): ChangelogEntry[] => {
    return [
      {
        id: '1',
        title: 'New Dashboard Analytics',
        description: 'View detailed insights about your workspace performance with our new analytics dashboard.',
        date: new Date().toISOString(),
        type: 'feature',
      },
      {
        id: '2',
        title: 'Improved Form Builder',
        description: 'Build forms faster with our drag-and-drop interface and pre-built templates.',
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'improvement',
      },
      {
        id: '3',
        title: 'Chat Widget Bug Fixes',
        description: 'Fixed issues with chat notifications and typing indicators.',
        date: new Date(Date.now() - 172800000).toISOString(),
        type: 'bugfix',
      },
    ];
  };

  const isEntryRead = (id: string): boolean => {
    const readEntries = JSON.parse(
      localStorage.getItem(`sfs_changelog_read_${workspaceId}`) || '[]'
    );
    return readEntries.includes(id);
  };

  const markAsRead = (id: string) => {
    const readEntries = JSON.parse(
      localStorage.getItem(`sfs_changelog_read_${workspaceId}`) || '[]'
    );
    if (!readEntries.includes(id)) {
      readEntries.push(id);
      localStorage.setItem(
        `sfs_changelog_read_${workspaceId}`,
        JSON.stringify(readEntries)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    const allIds = entries.map((entry) => entry.id);
    localStorage.setItem(
      `sfs_changelog_read_${workspaceId}`,
      JSON.stringify(allIds)
    );
    setUnreadCount(0);
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Mark all as read when opened
    setTimeout(() => {
      markAllAsRead();
    }, 1000);
  };

  const getTypeIcon = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'feature':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case 'improvement':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'bugfix':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getTypeColor = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'feature':
        return 'bg-blue-100 text-blue-700';
      case 'improvement':
        return 'bg-green-100 text-green-700';
      case 'bugfix':
        return 'bg-amber-100 text-amber-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <>
      {/* Badge Button */}
      {config.badge !== false && !isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-5 left-5 bg-white border border-gray-300 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-all z-[999999]"
          aria-label="View changelog"
        >
          <span className="text-sm font-medium text-gray-700">
            What's New
          </span>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <>
          <div
            className="sfs-widget-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[999999] p-4">
            <div className="sfs-widget-card max-w-2xl w-full max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-semibold">What's New</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Latest updates and improvements
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No updates yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="border-l-4 border-blue-600 pl-4 py-2"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${getTypeColor(
                              entry.type
                            )}`}
                          >
                            {getTypeIcon(entry.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {entry.title}
                              </h3>
                              {!isEntryRead(entry.id) && (
                                <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {entry.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatDate(entry.date)}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(
                                  entry.type
                                )}`}
                              >
                                {entry.type.charAt(0).toUpperCase() +
                                  entry.type.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <p className="text-xs text-center text-gray-500">
                  Powered by <span className="font-semibold">SFS</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
