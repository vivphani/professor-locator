"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2, Plus, Save, X, ShieldAlert, Lock } from 'lucide-react';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Database State
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- AUTHENTICATION FUNCTION ---
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setIsAuthenticated(true);
      fetchProfessors(); // Only fetch data AFTER logging in
    } else {
      alert("Incorrect password!");
      setPasswordInput('');
    }
  }

  // --- DATABASE FUNCTIONS ---
  async function fetchProfessors() {
    setLoading(true);
    const { data } = await supabase.from('professors').select('*').order('name');
    setProfessors(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await supabase.from('professors').update({ name, staffroom_location: location, department }).eq('id', editingId);
      setEditingId(null);
    } else {
      const { error } = await supabase.from('professors').insert([{ id, name, staffroom_location: location, department }]);
      if (error) {
        alert(`Error: ${error.message}`);
        return;
      }
    }
    resetForm();
    fetchProfessors();
  }

  async function handleDelete(deleteId: string) {
    if (window.confirm('Are you sure you want to remove this professor?')) {
      await supabase.from('professors').delete().eq('id', deleteId);
      fetchProfessors();
    }
  }

  function handleEditSetup(prof: any) {
    setEditingId(prof.id);
    setId(prof.id);
    setName(prof.name);
    setLocation(prof.staffroom_location);
    setDepartment(prof.department);
  }

  function resetForm() {
    setEditingId(null);
    setId('');
    setName('');
    setLocation('');
    setDepartment('');
  }

  // --- IF NOT LOGGED IN: SHOW PASSWORD SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-gray-500 mb-6 text-sm">Please enter the master password to continue.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
              placeholder="••••••••"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- IF LOGGED IN: SHOW ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
              <p className="text-gray-500 text-sm">Manage staff directory and locations.</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Lock Session
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: The Input Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">
              {editingId ? 'Edit Record' : 'Add New Record'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Faculty ID / Code</label>
                <input required value={id} onChange={e => setId(e.target.value)} disabled={!!editingId} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500" placeholder="e.g. CS-101" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Dr. Jane Smith" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Staffroom Location</label>
                <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Room 402B, Main Block" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                <input required value={department} onChange={e => setDepartment(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Computer Science" />
              </div>
              
              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-medium flex justify-center items-center">
                  {editingId ? <><Save className="w-4 h-4 mr-2"/> Update</> : <><Plus className="w-4 h-4 mr-2"/> Add to Directory</>}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition flex items-center">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: The Data Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">Current Directory</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <p className="text-gray-500">Loading records...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {professors.map(prof => (
                  <div key={prof.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-100 hover:bg-blue-50/30 transition group">
                    <div>
                      <h3 className="font-semibold text-gray-800">{prof.name}</h3>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600">{prof.id}</span>
                        <span>•</span>
                        <span>{prof.department}</span>
                        <span>•</span>
                        <span className="text-gray-700 font-medium">{prof.staffroom_location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditSetup(prof)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(prof.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {professors.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-gray-500">No professors in the database yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}