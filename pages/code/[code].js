import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function StatsPage() {
  const router = useRouter();
  const { code } = router.query;
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''));
    if (code) {
      fetchLink();
    }
  }, [code]);

  const fetchLink = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/links/${code}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Link not found');
        } else {
          throw new Error('Failed to fetch link');
        }
        return;
      }
      const data = await res.json();
      setLink(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50 border-b border-gray-200">
          <div className="flex items-center h-14 sm:h-16" style={{ paddingLeft: '20px' }}>
            <Link 
              href="/" 
              className="inline-flex items-center text-black hover:text-gray-800 transition-smooth group font-medium"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform text-lg sm:text-xl"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
  <path d="M19.6873 6.57402H3.20042L8.16261 1.61183C8.25215 1.52535 8.32357 1.4219 8.37271 1.30752C8.42184 1.19315 8.4477 1.07013 8.44878 0.945646C8.44987 0.821166 8.42615 0.697716 8.37901 0.582501C8.33187 0.467285 8.26226 0.362612 8.17423 0.274587C8.08621 0.186563 7.98153 0.116951 7.86632 0.0698122C7.7511 0.0226738 7.62765 -0.00104631 7.50317 3.53972e-05C7.37869 0.0011171 7.25567 0.0269792 7.14129 0.0761127C7.02692 0.125246 6.92347 0.196667 6.83699 0.286208L0.274487 6.84871C0.0987332 7.02452 0 7.26293 0 7.51152C0 7.76011 0.0987332 7.99853 0.274487 8.17433L6.83699 14.7368C7.0138 14.9076 7.25062 15.0021 7.49642 15C7.74223 14.9978 7.97737 14.8992 8.15119 14.7254C8.32501 14.5516 8.42361 14.3165 8.42574 14.0706C8.42788 13.8248 8.33338 13.588 8.16261 13.4112L3.20042 8.44902H19.6873C19.9359 8.44902 20.1744 8.35025 20.3502 8.17443C20.526 7.99862 20.6248 7.76016 20.6248 7.51152C20.6248 7.26288 20.526 7.02442 20.3502 6.84861C20.1744 6.67279 19.9359 6.57402 19.6873 6.57402Z" fill="#131313"/>
</svg></span>
              <span className="ml-2 text-sm sm:text-base">Back to Dashboard</span>
            </Link>
          </div>
        </header>
        <div className="pt-14 sm:pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="inline-block animate-pulse-slow">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            </div>
            <p className="text-lg text-gray-600">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50 border-b border-gray-200">
          <div className="flex items-center h-14 sm:h-16" style={{ paddingLeft: '20px' }}>
            <Link 
              href="/" 
              className="inline-flex items-center text-black hover:text-gray-800 transition-smooth group font-medium"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform text-lg sm:text-xl"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
  <path d="M19.6873 6.57402H3.20042L8.16261 1.61183C8.25215 1.52535 8.32357 1.4219 8.37271 1.30752C8.42184 1.19315 8.4477 1.07013 8.44878 0.945646C8.44987 0.821166 8.42615 0.697716 8.37901 0.582501C8.33187 0.467285 8.26226 0.362612 8.17423 0.274587C8.08621 0.186563 7.98153 0.116951 7.86632 0.0698122C7.7511 0.0226738 7.62765 -0.00104631 7.50317 3.53972e-05C7.37869 0.0011171 7.25567 0.0269792 7.14129 0.0761127C7.02692 0.125246 6.92347 0.196667 6.83699 0.286208L0.274487 6.84871C0.0987332 7.02452 0 7.26293 0 7.51152C0 7.76011 0.0987332 7.99853 0.274487 8.17433L6.83699 14.7368C7.0138 14.9076 7.25062 15.0021 7.49642 15C7.74223 14.9978 7.97737 14.8992 8.15119 14.7254C8.32501 14.5516 8.42361 14.3165 8.42574 14.0706C8.42788 13.8248 8.33338 13.588 8.16261 13.4112L3.20042 8.44902H19.6873C19.9359 8.44902 20.1744 8.35025 20.3502 8.17443C20.526 7.99862 20.6248 7.76016 20.6248 7.51152C20.6248 7.26288 20.526 7.02442 20.3502 6.84861C20.1744 6.67279 19.9359 6.57402 19.6873 6.57402Z" fill="#131313"/>
</svg></span>
              <span className="ml-2 text-sm sm:text-base">Back to Dashboard</span>
            </Link>
          </div>
        </header>
        <div className="pt-14 sm:pt-16 min-h-screen flex items-center justify-center px-4">
          <div className="text-center animate-fade-in max-w-md">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold text-red-600 mb-2">{error || 'Link not found'}</p>
            <p className="text-gray-600 mb-6">The link you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-smooth shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50 border-b border-gray-200">
        <div className="flex items-center h-14 sm:h-16" style={{ paddingLeft: '20px' }}>
          <Link 
            href="/" 
            className="inline-flex items-center text-black hover:text-gray-800 transition-smooth group font-medium"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform text-lg sm:text-xl"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
  <path d="M19.6873 6.57402H3.20042L8.16261 1.61183C8.25215 1.52535 8.32357 1.4219 8.37271 1.30752C8.42184 1.19315 8.4477 1.07013 8.44878 0.945646C8.44987 0.821166 8.42615 0.697716 8.37901 0.582501C8.33187 0.467285 8.26226 0.362612 8.17423 0.274587C8.08621 0.186563 7.98153 0.116951 7.86632 0.0698122C7.7511 0.0226738 7.62765 -0.00104631 7.50317 3.53972e-05C7.37869 0.0011171 7.25567 0.0269792 7.14129 0.0761127C7.02692 0.125246 6.92347 0.196667 6.83699 0.286208L0.274487 6.84871C0.0987332 7.02452 0 7.26293 0 7.51152C0 7.76011 0.0987332 7.99853 0.274487 8.17433L6.83699 14.7368C7.0138 14.9076 7.25062 15.0021 7.49642 15C7.74223 14.9978 7.97737 14.8992 8.15119 14.7254C8.32501 14.5516 8.42361 14.3165 8.42574 14.0706C8.42788 13.8248 8.33338 13.588 8.16261 13.4112L3.20042 8.44902H19.6873C19.9359 8.44902 20.1744 8.35025 20.3502 8.17443C20.526 7.99862 20.6248 7.76016 20.6248 7.51152C20.6248 7.26288 20.526 7.02442 20.3502 6.84861C20.1744 6.67279 19.9359 6.57402 19.6873 6.57402Z" fill="#131313"/>
</svg></span>
            <span className="ml-2 text-sm sm:text-base">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content with padding for fixed header */}
      <div className="pt-14 sm:pt-25 py-4 sm:py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg hover-lift p-4 sm:p-6 lg:p-8 animate-scale-in">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">
              Link Statistics
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Detailed analytics for your shortened link</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Short Code */}
            <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Code</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <code className="flex-1 text-base sm:text-lg font-mono font-semibold text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-100">
                  {link.code}
                </code>
                <button
                  onClick={() => copyToClipboard(link.code, 'code')}
                  className={`px-4 py-3 rounded-lg transition-smooth transform hover:scale-105 active:scale-95 font-medium ${
                    copied === 'code' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 border border-gray-200'
                  }`}
                  title="Copy code"
                >
                  {copied === 'code' ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            {/* Short URL */}
            <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short URL</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <code className="flex-1 text-sm sm:text-base font-mono text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-100 break-all">
                  {baseUrl}/{link.code}
                </code>
                <button
                  onClick={() => copyToClipboard(`${baseUrl}/${link.code}`, 'short')}
                  className={`px-4 py-3 rounded-lg transition-smooth transform hover:scale-105 active:scale-95 font-medium ${
                    copied === 'short' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 border border-gray-200'
                  }`}
                  title="Copy URL"
                >
                  {copied === 'short' ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            {/* Target URL */}
            <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target URL</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm sm:text-base text-blue-600 hover:text-blue-800 break-all px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-smooth hover:bg-blue-50"
                >
                  {link.url}
                </a>
                <button
                  onClick={() => copyToClipboard(link.url, 'target')}
                  className={`px-4 py-3 rounded-lg transition-smooth transform hover:scale-105 active:scale-95 font-medium ${
                    copied === 'target' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 border border-gray-200'
                  }`}
                  title="Copy URL"
                >
                  {copied === 'target' ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg hover-lift text-white animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-blue-100">Total Clicks</label>
                  <span className="text-2xl">👆</span>
                </div>
                <p className="text-4xl sm:text-5xl font-bold">{link.clicks || 0}</p>
                <p className="text-sm text-blue-100 mt-2">All-time clicks</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg hover-lift text-white animate-scale-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-green-100">Created At</label>
                  <span className="text-2xl">📅</span>
                </div>
                <p className="text-sm sm:text-base font-semibold">{new Date(link.created_at).toLocaleDateString()}</p>
                <p className="text-xs text-green-100 mt-2">{new Date(link.created_at).toLocaleTimeString()}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl shadow-lg hover-lift text-white animate-scale-in sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-purple-100">Last Clicked</label>
                  <span className="text-2xl">⏰</span>
                </div>
                <p className="text-sm sm:text-base font-semibold">
                  {link.last_clicked_at ? new Date(link.last_clicked_at).toLocaleDateString() : 'Never'}
                </p>
                <p className="text-xs text-purple-100 mt-2">
                  {link.last_clicked_at ? new Date(link.last_clicked_at).toLocaleTimeString() : 'No clicks yet'}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Link ID</label>
                  <p className="text-sm font-mono text-gray-700">{link.code}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Status</label>
                  <p className="text-sm font-semibold text-green-600">✓ Active</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

