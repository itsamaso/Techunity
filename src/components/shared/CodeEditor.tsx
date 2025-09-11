import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type CodeEditorProps = {
  initialCode: string;
  language: 'javascript' | 'python' | 'java' | 'cpp';
  onCodeChange: (code: string) => void;
  onSubmit: (code: string) => void;
  isSubmitting?: boolean;
  isCorrect?: boolean;
  testResults?: Array<{
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }>;
};

const CodeEditor = ({
  initialCode,
  language,
  onCodeChange,
  onSubmit,
  isSubmitting = false,
  isCorrect = false,
  testResults = [],
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [showTestResults, setShowTestResults] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    onCodeChange(value);
  };

  const handleSubmit = () => {
    onSubmit(code);
    setShowTestResults(true);
  };

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return '🟨';
      case 'python':
        return '🐍';
      case 'java':
        return '☕';
      case 'cpp':
        return '⚡';
      default:
        return '💻';
    }
  };

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return 'JavaScript';
      case 'python':
        return 'Python';
      case 'java':
        return 'Java';
      case 'cpp':
        return 'C++';
      default:
        return 'Code';
    }
  };


  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getLanguageIcon(language)}</span>
          <span className="font-semibold text-light-1">{getLanguageName(language)}</span>
        </div>
        <div className="flex items-center gap-2">
          {isCorrect && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Correct!
            </div>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !code.trim()}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </div>
            ) : (
              'Run Code'
            )}
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="w-full h-64 p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder={`Write your ${getLanguageName(language).toLowerCase()} code here...`}
          spellCheck={false}
          style={{ 
            lineHeight: '1.5',
            tabSize: 2
          }}
        />
        <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {code.length} characters
        </div>
      </div>

      {/* Test Results */}
      {showTestResults && testResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-light-1">Test Results</h4>
            <button
              onClick={() => setShowTestResults(!showTestResults)}
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              {showTestResults ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.passed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    result.passed ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {result.passed ? (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-semibold">
                    Test Case {index + 1} {result.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-medium">Input:</span> <code className="bg-gray-100 px-1 rounded">{result.input}</code>
                  </div>
                  <div>
                    <span className="font-medium">Expected:</span> <code className="bg-gray-100 px-1 rounded">{result.expected}</code>
                  </div>
                  <div>
                    <span className="font-medium">Actual:</span> <code className="bg-gray-100 px-1 rounded">{result.actual}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-semibold text-blue-800 mb-2">💡 Quick Tips</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Make sure your function returns the expected output</li>
          <li>• Test your code with the provided test cases</li>
          <li>• Use the hints if you get stuck</li>
          <li>• Check the console for any error messages</li>
        </ul>
      </div>
    </div>
  );
};

export default CodeEditor;
