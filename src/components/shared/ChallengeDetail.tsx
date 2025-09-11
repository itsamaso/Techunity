import { useState } from "react";
import { IChallenge, IUserChallengeAttempt } from "@/types";
import CodeEditor from "./CodeEditor";
import { Button } from "@/components/ui/button";

type ChallengeDetailProps = {
  challenge: IChallenge;
  userAttempts: IUserChallengeAttempt[];
  onSubmitAttempt: (code: string, language: 'javascript' | 'python' | 'java' | 'cpp') => void;
  isSubmitting?: boolean;
  lastAttempt?: IUserChallengeAttempt;
};

const ChallengeDetail = ({
  challenge,
  userAttempts,
  onSubmitAttempt,
  isSubmitting = false,
  lastAttempt,
}: ChallengeDetailProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard':
        return '!bg-red-100 !text-red-800 !border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'arrays':
        return '📊';
      case 'strings':
        return '📝';
      case 'math':
        return '🔢';
      case 'logic':
        return '🧠';
      case 'loops':
        return '🔄';
      case 'functions':
        return '⚙️';
      default:
        return '💻';
    }
  };

  const getStarterCode = (language: string) => {
    // Get the base function name and parameters from the JavaScript starter code
    const jsCode = challenge.starterCode || '';
    const functionMatch = jsCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);
    const functionName = functionMatch ? functionMatch[1] : 'solution';
    const params = functionMatch ? functionMatch[2] : 'input';
    
    switch (language) {
      case 'javascript':
        return `function ${functionName}(${params}) {
  // Your code here
  
}`;
      case 'python':
        return `def ${functionName}(${params}):
    # Your code here
    pass`;
      case 'java':
        return `public class Solution {
    public static int ${functionName}(int ${params}) {
        // Your code here
        
    }
}`;
      case 'cpp':
        return `#include <iostream>
using namespace std;

int ${functionName}(int ${params}) {
    // Your code here
    
}`;
      default:
        return `// Your code here`;
    }
  };

  const getSolutionCode = (language: string) => {
    // Get the base function name and parameters from the JavaScript starter code
    const jsCode = challenge.starterCode || '';
    const functionMatch = jsCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);
    const functionName = functionMatch ? functionMatch[1] : 'solution';
    const params = functionMatch ? functionMatch[2] : 'input';
    
    // Extract the solution logic from the JavaScript solution
    const jsSolution = challenge.solution || '';
    const solutionMatch = jsSolution.match(/function\s+\w+\s*\([^)]*\)\s*\{([\s\S]*)\}/);
    const solutionBody = solutionMatch ? solutionMatch[1].trim() : 'return input;';
    
    switch (language) {
      case 'javascript':
        return `function ${functionName}(${params}) {
${solutionBody}
}`;
      case 'python':
        // Convert JavaScript solution to Python
        const pythonBody = solutionBody
          .replace(/return\s+([^;]+);?/g, 'return $1')
          .replace(/;\s*$/, '')
          .replace(/\{|\}/g, '')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('//'))
          .map(line => `    ${line}`)
          .join('\n');
        return `def ${functionName}(${params}):
${pythonBody}`;
      case 'java':
        // Convert JavaScript solution to Java
        const javaBody = solutionBody
          .replace(/return\s+([^;]+);?/g, 'return $1;')
          .replace(/\{|\}/g, '')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('//'))
          .map(line => `        ${line}`)
          .join('\n');
        return `public class Solution {
    public static int ${functionName}(int ${params}) {
${javaBody}
    }
}`;
      case 'cpp':
        // Convert JavaScript solution to C++
        const cppBody = solutionBody
          .replace(/return\s+([^;]+);?/g, 'return $1;')
          .replace(/\{|\}/g, '')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('//'))
          .map(line => `    ${line}`)
          .join('\n');
        return `#include <iostream>
using namespace std;

int ${functionName}(int ${params}) {
${cppBody}
}`;
      default:
        return challenge.solution || '// Solution not available';
    }
  };

  const isSolved = userAttempts.some(attempt => attempt.isCorrect);
  const correctAttempts = userAttempts.filter(attempt => attempt.isCorrect).length;
  const totalAttempts = userAttempts.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Challenge Header */}
      <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {getCategoryIcon(challenge.category)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-light-1 mb-2">
                {challenge.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-light-3">
                <span className="capitalize">{challenge.category}</span>
                <span>•</span>
                <span>{challenge.points} points</span>
                <span>•</span>
                <span>{challenge.testCases.length} test cases</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyColor(challenge.difficulty)}`}
              style={challenge.difficulty === 'Hard' ? { backgroundColor: '#fecaca', color: '#991b1b', borderColor: '#fca5a5' } : {}}
            >
              {challenge.difficulty}
            </div>
            {isSolved && (
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Solved!
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-light-3">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            {correctAttempts}/{totalAttempts} attempts
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {challenge.points} points
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6">
            <h2 className="text-xl font-bold text-light-1 mb-4">Problem Description</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-light-2 leading-relaxed whitespace-pre-wrap">
                {challenge.description}
              </p>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6">
            <h2 className="text-xl font-bold text-light-1 mb-4">Test Cases</h2>
            <div className="space-y-3">
              {challenge.testCases.map((testCase, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-semibold text-light-1 mb-2">
                    Test Case {index + 1}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium text-light-2">Input:</span>
                      <code className="ml-2 bg-white px-2 py-1 rounded text-gray-800">
                        {testCase.input}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium text-light-2">Expected Output:</span>
                      <code className="ml-2 bg-white px-2 py-1 rounded text-gray-800">
                        {testCase.expectedOutput}
                      </code>
                    </div>
                    {testCase.description && (
                      <div className="text-light-3 text-xs mt-2">
                        {testCase.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hints */}
          <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-light-1">Hints</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
            {showHints && (
              <div className="space-y-3">
                {challenge.hints.map((hint, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold text-sm">💡</span>
                      <span className="text-sm text-yellow-800">{hint}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Solution */}
          <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-light-1">Solution</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </Button>
            </div>
            {showSolution && (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{getSolutionCode(selectedLanguage)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-light-1">Code Editor</h2>
            <div className="flex items-center gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="px-3 py-1 border border-light-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          <CodeEditor
            key={selectedLanguage} // Force re-render when language changes
            initialCode={getStarterCode(selectedLanguage)}
            language={selectedLanguage}
            onCodeChange={() => {}}
            onSubmit={(code) => onSubmitAttempt(code, selectedLanguage)}
            isSubmitting={isSubmitting}
            isCorrect={lastAttempt?.isCorrect}
            testResults={[]} // This would be populated with actual test results
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
