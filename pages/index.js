import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ url: '', code: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''));
    fetchLinks();
  }, []);

  // Polling effect for real-time updates
  useEffect(() => {
    let intervalId;
    let isPageVisible = true;

    // Handle page visibility to pause polling when tab is hidden
    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Function to poll for updates (without showing loading state)
    const pollLinks = async () => {
      if (!isPageVisible) return; // Skip if tab is hidden
      
      try {
        const res = await fetch('/api/links');
        if (res.ok) {
          const data = await res.json();
          setLinks(data);
          setError(null);
        }
      } catch (err) {
        // Silently fail during polling to avoid disrupting user experience
        console.error('Polling error:', err);
      }
    };

    // Set up polling interval (every 2 seconds)
    intervalId = setInterval(pollLinks, 2000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      setLinks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.url,
          code: formData.code || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create link');
      }

      setFormData({ url: '', code: '' });
      setShowForm(false);
      fetchLinks();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete link');
      fetchLinks();
    } catch (err) {
      alert('Error deleting link: ' + err.message);
    }
  };

  const copyToClipboard = (text, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(text);
    // No alert - silent copy
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2">
            TinyLink
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">URL Shortener Dashboard</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg hover-lift p-4 sm:p-6 mb-6 animate-scale-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Links</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg transition-smooth shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
            >
              {showForm ? 'Cancel' : '+ Add Link'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 animate-slide-in">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Code (optional, 6-8 alphanumeric)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Leave empty for auto-generate"
                  pattern="[A-Za-z0-9]{6,8}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
                />
              </div>
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md animate-slide-in-right">
                  {formError}
                </div>
              )}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg transition-smooth shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium disabled:transform-none"
              >
                {formLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-pulse-slow mr-2">⏳</span>
                    Creating...
                  </span>
                ) : (
                  'Create Link'
                )}
              </button>
            </form>
          )}

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by code or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse-slow">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading links...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 animate-slide-in">
              <div className="inline-block p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-600 font-medium">Error: {error}</p>
              </div>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-gray-600 text-lg">
                {searchTerm ? 'No links found matching your search.' : 'No links yet. Create your first link!'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto animate-fade-in">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Short Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Target URL
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Last Clicked
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLinks.map((link, index) => (
                      <tr 
                        key={link.code} 
                        className="hover:bg-blue-50 transition-smooth animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <a
                              href={`${baseUrl}/${link.code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-smooth"
                            >
                              {link.code}
                            </a>
                            <button
                              onClick={(e) => copyToClipboard(`${baseUrl}/${link.code}`, e)}
                              className="ml-3 text-gray-400 hover:text-blue-600 transition-smooth transform hover:scale-110 active:scale-95"
                              title="Copy link"
                            >
                              📋
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md truncate" title={link.url}>
                            {link.url}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {link.clicks || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(link.last_clicked_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => router.push(`/code/${link.code}`)}
                            className="text-blue-600 hover:text-blue-900 mr-4 transition-smooth hover:underline"
                          >
                            Stats
                          </button>
                          <button
                            onClick={() => handleDelete(link.code)}
                            className="text-red-600 hover:text-red-900 transition-smooth hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredLinks.map((link, index) => (
                  <div
                    key={link.code}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover-lift animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <a
                            href={`${baseUrl}/${link.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-smooth"
                          >
                            {link.code}
                          </a>
                          <button
                            onClick={(e) => copyToClipboard(`${baseUrl}/${link.code}`, e)}
                            className="ml-2 text-gray-400 hover:text-blue-600 transition-smooth transform hover:scale-110 active:scale-95"
                            title="Copy link"
                          >
                            📋
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 break-all mb-3" title={link.url}>
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-xs text-gray-500">Clicks</span>
                          <span className="block text-sm font-semibold text-blue-600">{link.clicks || 0}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Last Click</span>
                          <span className="block text-xs text-gray-600">{formatDate(link.last_clicked_at)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/code/${link.code}`)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-smooth"
                        >
                          Stats
                        </button>
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-smooth"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
