// Change initial state from 'dashboard' to 'ads'
const [activeTab, setActiveTab] = useState('ads');

// Update the useEffect for fetching posts
useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get('/user/posts', {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      console.log(response.data);
      // Ensure we always get an array
      setPosts(response.data?.posts || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Add 'ads' to the condition
  if (activeTab === 'ads' || activeTab === 'dashboard' || activeTab === 'posts') {
    fetchPosts();
  }
}, [activeTab]);