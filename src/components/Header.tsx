import React from 'react';
import { Newspaper } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Newspaper className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">AI News Hub</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <a 
              href="#latest" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Latest
            </a>
            <a 
              href="#trending" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Trending
            </a>
            <a 
              href="#about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}