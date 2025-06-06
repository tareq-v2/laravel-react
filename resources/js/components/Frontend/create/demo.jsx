// ... existing imports ...

const BlogDetails = () => {
  // ... existing states ...
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // ... existing useEffect ...

  // Separate useEffect for comments pagination
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const commentsRes = await axios.get(`/blogs/${id}/comments?page=${commentsPage}`);
        setComments(commentsRes.data.data); // Paginated comments
        setCommentsTotalPages(commentsRes.data.last_page);
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id, commentsPage]);

  // ... existing functions ...

  // Handle comment page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= commentsTotalPages) {
      setCommentsPage(newPage);
    }
  };

  // ... existing return ...

  return (
    <div className="container py-4">
      {/* ... existing code ... */}
      
      {/* Comments Section */}
      <div className="comments-section mt-5">
        <h3 className="mb-4">Comments ({commentsTotalPages > 0 ? commentsTotalPages * 10 : 0})</h3>
        
        {/* ... comment form ... */}

        <div className="comments-list">
          {commentsLoading ? (
            <div className="text-center py-3">Loading comments...</div>
          ) : comments.length === 0 ? (
            <p className="text-muted">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              // ... existing comment rendering ...
            ))
          )}
        </div>

        {/* Pagination Controls - Only show if needed */}
        {commentsTotalPages > 1 && (
          <div className="comment-pagination mt-4">
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${commentsPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(commentsPage - 1)}
                  >
                    &laquo; Previous
                  </button>
                </li>
                
                {[...Array(commentsTotalPages).keys()].map(page => (
                  <li 
                    key={page + 1} 
                    className={`page-item ${commentsPage === page + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${commentsPage === commentsTotalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(commentsPage + 1)}
                  >
                    Next &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* ... existing code ... */}
    </div>
  );
};

// ... existing components ...

export default BlogDetails;