import { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, Apple, History, Trash2 } from 'lucide-react';

interface MealPlan {
  id: number;
  title: string;
  plan_content: string;
  created_at: string;
  is_active: boolean;
}

function MealPlan() {
  const [prompt, setPrompt] = useState('Create a 7-day healthy meal plan for a vegetarian looking to lose 5kg.');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<MealPlan[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/meals/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);

      // Load active plan if exists
      const activePlan = response.data.find((p: MealPlan) => p.is_active);
      if (activePlan) {
        setPlan(activePlan.plan_content);
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/meals/generate',
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(response.data.plan_content);
      fetchHistory(); // Refresh history
    } catch (error) {
      console.error(error);
      alert('Error generating meal plan');
    } finally {
      setLoading(false);
    }
  };

  const loadPlan = (mealPlan: MealPlan) => {
    setPlan(mealPlan.plan_content);
    setShowHistory(false);
  };

  const deletePlan = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/meals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
      if (history.find(p => p.id === id)?.is_active) {
        setPlan('');
      }
    } catch (error) {
      alert('Failed to delete plan');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-50 to-teal-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <Apple className="text-green-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
                Nutrition Guide
              </h1>
              <p className="text-green-700 text-sm mt-1">AI-powered personalized meal plans</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center px-5 py-2.5 bg-green-100 text-green-900 rounded-lg hover:bg-green-200 transition-all shadow-md border border-green-200"
          >
            <History className="mr-2" size={18} />
            {showHistory ? 'Hide' : 'Show'} History
            <span className="ml-2 px-2 py-0.5 bg-green-200 rounded-full text-xs font-semibold">{history.length}</span>
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border-2 border-green-200 hover:shadow-xl transition-all">
          <h3 className="text-xl font-bold mb-4 flex items-center text-green-900">
            <History className="mr-2 text-green-600" size={24} />
            Previous Meal Plans
          </h3>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Apple className="mx-auto text-green-300 mb-3" size={48} />
              <p className="text-green-600">No meal plans yet. Generate your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:shadow-md transition-all border-2 border-green-200"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => loadPlan(item)}>
                    <p className="font-semibold text-green-900 flex items-center gap-2">
                      <Apple className="text-green-600" size={18} />
                      {item.title}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {item.is_active && <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-bold">Active</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePlan(item.id)}
                    className="p-2.5 text-red-500 hover:bg-red-100 rounded-lg transition-all border border-red-200"
                    title="Delete plan"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border-2 border-green-200 hover:shadow-xl transition-all">
        <h3 className="text-lg font-bold mb-4 text-green-900">Describe Your Nutrition Goals</h3>
        <textarea
          className="w-full p-4 border-2 border-green-200 bg-green-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all resize-none hover:border-green-300 text-green-900"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Create a 7-day healthy meal plan for a vegetarian looking to lose 5kg, with 1800 calories per day..."
        />
        <button
          onClick={generatePlan}
          disabled={loading}
          className="mt-5 px-8 py-3.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2 font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Apple size={20} />
              Generate Meal Plan
            </>
          )}
        </button>
      </div>

      {plan && (
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-200 hover:shadow-xl transition-all">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-xl mr-4 border border-green-200">
              <Apple className="text-green-600" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-green-900">
              Your Personalized Meal Plan
            </h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-green-800 leading-relaxed">
              {plan}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealPlan;
