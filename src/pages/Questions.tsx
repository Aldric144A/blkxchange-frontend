import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ThumbsUp, Eye, Plus, CheckCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { api } from '../api';
import { useToast } from '../hooks/use-toast';

interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  author_name: string;
  author_email: string;
  views: number;
  upvotes: number;
  answer_count: number;
  has_accepted_answer: boolean;
  created_at: string;
}

interface Answer {
  id: string;
  question_id: string;
  content: string;
  author_name: string;
  author_email: string;
  upvotes: number;
  is_accepted: boolean;
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

export function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: 'general',
    author_name: '',
    author_email: ''
  });

  const [newAnswer, setNewAnswer] = useState({
    content: '',
    author_name: '',
    author_email: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedQuestion) {
      fetchAnswers(selectedQuestion.id);
    }
  }, [selectedQuestion]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await api.get(`/api/questions${params}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load questions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async (questionId: string) => {
    try {
      const response = await api.get(`/api/questions/${questionId}/answers`);
      setAnswers(response.data);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestion.title || !newQuestion.content || !newQuestion.author_name || !newQuestion.author_email) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.post('/api/questions', newQuestion);
      toast({
        title: 'Success',
        description: 'Question posted successfully!'
      });
      setNewQuestion({ title: '', content: '', category: 'general', author_name: '', author_email: '' });
      setShowCreateQuestion(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: 'Error',
        description: 'Failed to post question',
        variant: 'destructive'
      });
    }
  };

  const handleCreateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAnswer.content || !newAnswer.author_name || !newAnswer.author_email) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.post('/api/answers', {
        ...newAnswer,
        question_id: selectedQuestion?.id
      });
      toast({
        title: 'Success',
        description: 'Answer posted successfully!'
      });
      setNewAnswer({ content: '', author_name: '', author_email: '' });
      if (selectedQuestion) {
        fetchAnswers(selectedQuestion.id);
        const updatedQuestion = await api.get(`/api/questions/${selectedQuestion.id}`);
        setSelectedQuestion(updatedQuestion.data);
      }
    } catch (error) {
      console.error('Error creating answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to post answer',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (selectedQuestion) {
    return (
      <div className="min-h-screen bg-brand-ivory">
        <div className="bg-brand-black text-brand-ivory py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              onClick={() => setSelectedQuestion(null)}
              className="mb-4 bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Q&A
            </Button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              {selectedQuestion.title}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="capitalize bg-brand-gold text-brand-black">
                  {selectedQuestion.category}
                </Badge>
                {selectedQuestion.has_accepted_answer && (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Answered
                  </Badge>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedQuestion.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {selectedQuestion.upvotes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {selectedQuestion.answer_count}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Asked by <span className="font-semibold">{selectedQuestion.author_name}</span> on {formatDate(selectedQuestion.created_at)}
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedQuestion.content}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Post Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAnswer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name"
                    value={newAnswer.author_name}
                    onChange={(e) => setNewAnswer({ ...newAnswer, author_name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={newAnswer.author_email}
                    onChange={(e) => setNewAnswer({ ...newAnswer, author_email: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Write your answer..."
                  value={newAnswer.content}
                  onChange={(e) => setNewAnswer({ ...newAnswer, content: e.target.value })}
                  rows={6}
                />
                <Button type="submit" className="bg-brand-gold text-brand-black hover:bg-brand-gold/90">
                  Post Answer
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-brand-black">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
            {answers.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-600">
                  No answers yet. Be the first to answer!
                </CardContent>
              </Card>
            ) : (
              answers.map((answer) => (
                <Card key={answer.id} className={answer.is_accepted ? 'border-2 border-green-500' : ''}>
                  <CardContent className="p-6">
                    {answer.is_accepted && (
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-green-600">Accepted Answer</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-brand-black">{answer.author_name}</span>
                      <span className="text-sm text-gray-600">{formatDate(answer.created_at)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap mb-3">{answer.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-brand-gold transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{answer.upvotes}</span>
                      </button>
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

  if (showCreateQuestion) {
    return (
      <div className="min-h-screen bg-brand-ivory">
        <div className="bg-brand-black text-brand-ivory py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              onClick={() => setShowCreateQuestion(false)}
              className="mb-4 bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Q&A
            </Button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              Ask a Question
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleCreateQuestion} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">Question Title</label>
                  <Input
                    placeholder="What's your question?"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">Category</label>
                  <Select value={newQuestion.category} onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}>
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
                  <label className="block text-sm font-semibold text-brand-black mb-2">Details</label>
                  <Textarea
                    placeholder="Provide more details about your question..."
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    rows={8}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-black mb-2">Your Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={newQuestion.author_name}
                      onChange={(e) => setNewQuestion({ ...newQuestion, author_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-black mb-2">Your Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={newQuestion.author_email}
                      onChange={(e) => setNewQuestion({ ...newQuestion, author_email: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold">
                  Post Question
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
                Q&A Hub
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                Ask questions, get expert answers, and help others in the community
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
            onClick={() => setShowCreateQuestion(true)}
            className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ask Question
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading questions...</div>
          </div>
        ) : questions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-black mb-2">No questions yet</h3>
              <p className="text-gray-600 mb-4">Be the first to ask a question!</p>
              <Button
                onClick={() => setShowCreateQuestion(true)}
                className="bg-brand-gold text-brand-black hover:bg-brand-gold/90"
              >
                Ask First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Card
                key={question.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-brand-gold"
                onClick={() => setSelectedQuestion(question)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-brand-black hover:text-brand-gold">
                          {question.title}
                        </h3>
                        <Badge className="capitalize bg-brand-gold text-brand-black">
                          {question.category}
                        </Badge>
                        {question.has_accepted_answer && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Answered
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{question.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>By {question.author_name}</span>
                        <span>•</span>
                        <span>{formatDate(question.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-600 ml-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {question.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {question.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {question.answer_count}
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
