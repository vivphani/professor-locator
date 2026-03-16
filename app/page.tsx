"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, MapPin, School } from 'lucide-react';

export default function Home() {
  const [professors, setProfessors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessors();
  }, []);

  async function fetchProfessors() {
    setLoading(true);
    const { data, error } = await supabase
      .from('professors')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching professors:", error);
    } else {
      setProfessors(data || []);
    }
    setLoading(false);
  }

  const filtered = professors.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    (p.department && p.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-8 text-center pt-8">
          <School className="w-12 h-12 mx-auto text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-900">Staff Locator</h1>
          <p className="text-gray-500 text-sm mt-1">Find professor staffrooms instantly.</p>
        </header>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input 
            className="w-full p-3.5 pl-12 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
            placeholder="Search by name, ID, or department..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-gray-500 py-4">Loading directory...</p>
          ) : filtered.length > 0 ? (
            filtered.map(prof => (
              <div key={prof.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{prof.name}</h3>
                  <div className="text-sm text-gray-500 flex gap-2 mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">ID: {prof.id}</span>
                    <span>{prof.department}</span>
                  </div>
                </div>
                <div className="flex items-center text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 text-right">
                  <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">{prof.staffroom_location}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4 bg-white rounded-xl border border-gray-100 border-dashed">No staff members found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
