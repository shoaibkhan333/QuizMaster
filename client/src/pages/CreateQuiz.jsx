import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

const CreateQuiz = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    timeLimit: 10,
    isPublic: true,
    questions: []
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId) {
      fetchQuiz();
    }
  }, [editId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/quizzes/${editId}/with-answers`);
      setFormData({
        title: res.data.title,
        description: res.data.description || '',
        category: res.data.category,
        difficulty: res.data.difficulty,
        timeLimit: res.data.timeLimit,
        isPublic: res.data.isPublic,
        questions: res.data.questions || []
      });
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert(error.response?.data?.message || 'Error loading quiz. You may not have permission to edit this quiz.');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: '',
          questionType: 'multiple-choice',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          points: 1,
          explanation: '',
          correctAnswer: ''
        }
      ]
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...formData.questions];
    if (field === 'isCorrect') {
      // Uncheck other options for multiple-choice
      if (newQuestions[questionIndex].questionType === 'multiple-choice') {
        newQuestions[questionIndex].options.forEach(opt => opt.isCorrect = false);
      }
      newQuestions[questionIndex].options[optionIndex][field] = value;
    } else {
      newQuestions[questionIndex].options[optionIndex][field] = value;
    }
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editId) {
        await axios.put(`/api/quizzes/${editId}`, formData);
      } else {
        await axios.post('/api/quizzes', formData);
      }
      navigate('/quizzes');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg ||
                          'Error saving quiz. Please check all fields are filled correctly.';
      alert(errorMessage);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        {editId ? 'Edit Quiz' : 'Create New Quiz'}
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Quiz Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                  placeholder="e.g., Science, History, Math"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="input-field"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                  className="input-field"
                  min="1"
                  required
                />
              </div>

              <div className="flex items-center mt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Make quiz public</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn-primary"
            >
              <FiPlus className="inline mr-1" />
              Add Question
            </button>
          </div>

          {formData.questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No questions yet. Click "Add Question" to get started.</p>
          ) : (
            <div className="space-y-6">
              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Question Text *</label>
                      <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Question Type</label>
                        <select
                          value={question.questionType}
                          onChange={(e) => {
                            updateQuestion(qIndex, 'questionType', e.target.value);
                            if (e.target.value === 'true-false') {
                              updateQuestion(qIndex, 'options', [
                                { text: 'True', isCorrect: false },
                                { text: 'False', isCorrect: false }
                              ]);
                            }
                          }}
                          className="input-field"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Points</label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                          className="input-field"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    {(question.questionType === 'multiple-choice' || question.questionType === 'true-false') && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Options *</label>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                className="input-field flex-1"
                                placeholder={`Option ${oIndex + 1}`}
                                required
                              />
                              <label className="flex items-center whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={option.isCorrect}
                                  onChange={(e) => updateOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                                  className="mr-2"
                                />
                                Correct
                              </label>
                            </div>
                          ))}
                          {question.questionType === 'multiple-choice' && (
                            <button
                              type="button"
                              onClick={() => addOption(qIndex)}
                              className="text-primary-600 hover:underline text-sm"
                            >
                              + Add Option
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {question.questionType === 'short-answer' && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Correct Answer *</label>
                        <input
                          type="text"
                          value={question.correctAnswer || ''}
                          onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Explanation (optional)</label>
                      <textarea
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                        className="input-field"
                        rows="2"
                        placeholder="Explain why this is the correct answer..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || formData.questions.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            <FiSave className="inline mr-1" />
            {saving ? 'Saving...' : editId ? 'Update Quiz' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;

