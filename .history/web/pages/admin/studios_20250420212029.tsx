
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { withAuth } from '../../components/withAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NavItem {
  label: string;
  href: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  type: string;
  year: number;
}

interface FontItem {
  id: string;
  name: string;
  image: string;
  type: string;
  price: number;
}

interface ArtworkItem {
  id: string;
  name: string;
  author: string;
  image: string;
  type: string;
}

interface Studio {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  author?: string;
  imageTitle?: string;
  imageDescription?: string;
  openDays?: string[];
  openHours?: string;
  navigation?: NavItem[];
  slogan?: string;
  portfolio?: PortfolioItem[];
  fonts?: FontItem[];
  artworks?: ArtworkItem[];
}

const AdminStudios = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    thumbnail?: string;
    author?: string;
    imageTitle?: string;
    imageDescription?: string;
    openDays: string;
    openHours: string;
    navigation: string;
    slogan: string;
    portfolio: string;
    fonts: string;
    artworks: string;
  }>({
    name: '',
    description: '',
    thumbnail: '',
    author: '',
    imageTitle: '',
    imageDescription: '',
    openDays: '',
    openHours: '',
    navigation: '',
    slogan: '',
    portfolio: '',
    fonts: '',
    artworks: '',
  });
  const [editId, setEditId] = useState<string | null>(null);

  const fetchStudios = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('No token found, user is not authenticated');
      toast.error('You are not authenticated. Please log in.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/studios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorRes = await response.json();
        console.error('Failed to fetch studios:', errorRes);
        toast.error(errorRes.message || 'Failed to fetch studios');
        return;
      }

      const data = await response.json();
      console.log('Studios data:', data);
      setStudios(data);
    } catch (error) {
      console.error('Error fetching studios:', error);
      toast.error('Error fetching studios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const parseNavigation = (navString: string): NavItem[] => {
    if (!navString.trim()) return [];
    // If the string doesn't include a pipe, treat it as a single link
    if (!navString.includes('|')) {
      return [{ label: 'Link', href: navString.trim() }];
    }
    // Otherwise, process using the existing delimited format
    return navString.split(';').reduce<NavItem[]>((acc, item) => {
      const [label, href] = item.split('|').map(s => s.trim());
      if (label && href) {
        acc.push({ label, href });
      }
      return acc;
    }, []);
  };

  // Helper: convert navigation array to the text format for editing
  const formatNavigation = (navItems?: NavItem[]): string => {
    if (!navItems || navItems.length === 0) return '';
    return navItems.map(item => `${item.label}|${item.href}`).join('; ');
  };

  const parseJsonField = (jsonString: string, fieldName: string): any[] => {
    if (!jsonString || jsonString.trim() === '') {
      return [];
    }
    try {
      // Trim any leading/trailing whitespace
      const trimmedJson = jsonString.trim();
      const parsed = JSON.parse(trimmedJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`Error parsing ${fieldName}:`, error);
      return [];
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url; // Assuming the API returns the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Convert openDays string to an array
      const sanitizedOpenDays = formData.openDays
        .split(',')
        .map((day) => day.trim())
        .filter((day) => day);

      const parsedNavigation = parseNavigation(formData.navigation);

      // Parse JSON fields
      const parsedPortfolio = parseJsonField(formData.portfolio, 'portfolio');
      const parsedFonts = parseJsonField(formData.fonts, 'fonts');
      const parsedArtworks = parseJsonField(formData.artworks, 'artworks');

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const method = editId ? 'PUT' : 'POST';
      const endpoint = editId ? `/api/studios/${editId}` : `/api/studios`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          openDays: sanitizedOpenDays,
          navigation: parsedNavigation,
          portfolio: parsedPortfolio,
          fonts: parsedFonts,
          artworks: parsedArtworks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.message || JSON.stringify(errorData) || 'Failed to save studio');
      }

      await fetchStudios();

      // Reset form and editId
      setFormData({
        name: '',
        description: '',
        thumbnail: '',
        author: '',
        imageTitle: '',
        imageDescription: '',
        openDays: '',
        openHours: '',
        navigation: '',
        slogan: '',
        portfolio: '',
        fonts: '',
        artworks: '',
      });
      setEditId(null);
      toast.success(editId ? 'Studio updated successfully' : 'Studio added successfully');
    } catch (err) {
      console.error('Error saving studio:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to save studio');
    }
  };
  const handleEdit = (studio: Studio) => {
    setFormData({
      name: studio.name,
      description: studio.description,
      thumbnail: studio.thumbnail || '',
      author: studio.author || '',
      imageTitle: studio.imageTitle || '',
      imageDescription: studio.imageDescription || '',
      openDays: Array.isArray(studio.openDays) ? studio.openDays.join(', ') : studio.openDays || '',
      openHours: studio.openHours || '',
      navigation: formatNavigation(studio.navigation),
      slogan: studio.slogan || '',
      portfolio: JSON.stringify(studio.portfolio || []),
      fonts: JSON.stringify(studio.fonts || []),
      artworks: JSON.stringify(studio.artworks || []),
    });
    setEditId(studio.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this studio?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/studios/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete studio');
      await fetchStudios();
    } catch (err) {
      setError('Failed to delete studio');
      toast.error('Failed to delete studio');
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Manage Studios</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Thumbnail</th>
                <th className="py-2 px-4 border-b">Author</th>
                <th className="py-2 px-4 border-b">Slogan</th>
                <th className="py-2 px-4 border-b">Portfolio</th>
                <th className="py-2 px-4 border-b">Fonts</th>
                <th className="py-2 px-4 border-b">Artworks</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((studio) => (
                <tr key={studio.id}>
                  <td className="py-2 px-4 border-b">{studio.name}</td>
                  <td className="py-2 px-4 border-b">{studio.description}</td>
                  <td className="py-2 px-4 border-b">
                    {studio.thumbnail ? (
                      <img src={studio.thumbnail} alt={studio.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      'No Thumbnail'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{studio.author || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{studio.slogan || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{studio.portfolio ? studio.portfolio.length : 0} items</td>
                  <td className="py-2 px-4 border-b">{studio.fonts ? studio.fonts.length : 0} items</td>
                  <td className="py-2 px-4 border-b">{studio.artworks ? studio.artworks.length : 0} items</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEdit(studio)} className="mr-2 text-blue-500">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(studio.id)} className="text-red-500">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="mt-8 text-xl font-semibold">{editId ? 'Edit Studio' : 'Add New Studio'}</h2>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Thumbnail URL"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              placeholder="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              placeholder="Image Title"
              value={formData.imageTitle}
              onChange={(e) => setFormData({ ...formData, imageTitle: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <textarea
              placeholder="Image Description"
              value={formData.imageDescription}
              onChange={(e) => setFormData({ ...formData, imageDescription: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              placeholder="Open Days (comma-separated, e.g., Mon, Tue, Wed)"
              value={formData.openDays}
              onChange={(e) => setFormData({ ...formData, openDays: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Open Hours (e.g., 09:00 AM - 05:00 PM)"
              value={formData.openHours}
              onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <textarea
              placeholder="Navigation Items (paste a link or use format: Overview|/studio/1/overview; Exhibits|/studio/1/exhibits)"
              value={formData.navigation}
              onChange={(e) => setFormData({ ...formData, navigation: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
<input
              type="text"
              placeholder="Slogan"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <textarea
              placeholder="Portfolio (JSON array)"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <textarea
              placeholder="Fonts (JSON array)"
              value={formData.fonts}
              onChange={(e) => setFormData({ ...formData, fonts: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <textarea
              placeholder="Artworks (JSON array)"
              value={formData.artworks}
              onChange={(e) => setFormData({ ...formData, artworks: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              {editId ? 'Update Studio' : 'Add Studio'}
            </button>
          </form>
        </>
      )}
    </Layout>
  );
};

export default withAuth(AdminStudios);
