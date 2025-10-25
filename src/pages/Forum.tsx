import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Eye, Plus, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { api } from '../api';
import { useToast } from '../hooks/use-toast';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author_name: string;
  author_email: string;
  views: number;
  likes: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

interface ForumComment {
  id: string;
  post_id: string;
  content: string;
  author_name: string;
  author_email: string;
  likes: number;
  created_at: string;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'culture', label: 'Culture' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'general', label: 'General' }
];

export function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    author_name: '',
    author_email: ''
  });

  const [newComment, setNewComment] = useState({
    content: '',
    author_name: '',
    author_email: ''
  });

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await api.get(`/api/forum/posts${params}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load forum posts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await api.get(`/api/forum/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title || !newPost.content || !newPost.author_name || !newPost.author_email) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.post('/api/forum/posts', newPost);
      toast({
        title: 'Success',
        description: 'Post created successfully!'
      });
      setNewPost({ title: '', content: '', category: 'general', author_name: '', author_email: '' });
      setShowCreatePost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.content || !newComment.author_name || !newComment.author_email) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.post('/api/forum/comments', {
        ...newComment,
        post_id: selectedPost?.id
      });
      toast({
        title: 'Success',
        description: 'Comment added successfully!'
      });
      setNewComment({ content: '', author_name: '', author_email: '' });
      if (selectedPost) {
        fetchComments(selectedPost.id);
        const updatedPost = await api.get(`/api/forum/posts/${selectedPost.id}`);
        setSelectedPost(updatedPost.data);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-brand-ivory">
        <div className="bg-brand-black text-brand-ivory py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              onClick={() => setSelectedPost(null)}
              className="mb-4 bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              {selectedPost.title}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="capitalize bg-brand-gold text-brand-black">
                  {selectedPost.category}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedPost.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {selectedPost.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {selectedPost.comment_count}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Posted by <span className="font-semibold">{selectedPost.author_name}</span> on {formatDate(selectedPost.created_at)}
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add a Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateComment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name"
                    value={newComment.author_name}
                    onChange={(e) => setNewComment({ ...newComment, author_name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={newComment.author_email}
                    onChange={(e) => setNewComment({ ...newComment, author_email: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Write your comment..."
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                  rows={4}
                />
                <Button type="submit" className="bg-brand-gold text-brand-black hover:bg-brand-gold/90">
                  Post Comment
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-brand-black">
              Comments ({comments.length})
            </h2>
            {comments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-600">
                  No comments yet. Be the first to comment!
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-brand-black">{comment.author_name}</span>
                      <span className="text-sm text-gray-600">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <ThumbsUp className="w-4 h-4" />
                      {comment.likes}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showCreatePost) {
    return (
      <div className="min-h-screen bg-brand-ivory">
        <div className="bg-brand-black text-brand-ivory py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              onClick={() => setShowCreatePost(false)}
              className="mb-4 bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              Create New Post
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">Title</label>
                  <Input
                    placeholder="Enter post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">Category</label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.value !== 'all').map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">Content</label>
                  <Textarea
                    placeholder="Write your post content..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={10}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-black mb-2">Your Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={newPost.author_name}
                      onChange={(e) => setNewPost({ ...newPost, author_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-black mb-2">Your Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={newPost.author_email}
                      onChange={(e) => setNewPost({ ...newPost, author_email: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold">
                  Create Post
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/community" className="text-brand-gold hover:underline mb-2 inline-block">
                ← Back to Community Hub
              </Link>
              <h1 className="text-4xl md:text-5xl font-heading font-bold">
                Forum & Discussions
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                Connect with the community, share insights, and engage in meaningful conversations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-brand-black">Filter by:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setShowCreatePost(true)}
            className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading posts...</div>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-black mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Be the first to start a discussion!</p>
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-brand-gold text-brand-black hover:bg-brand-gold/90"
              >
                Create First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-brand-gold"
                onClick={() => setSelectedPost(post)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-brand-black hover:text-brand-gold">
                          {post.title}
                        </h3>
                        <Badge className="capitalize bg-brand-gold text-brand-black">
                          {post.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>By {post.author_name}</span>
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-600 ml-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.comment_count}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
