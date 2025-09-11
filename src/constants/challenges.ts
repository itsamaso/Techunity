import { IChallenge, IAchievement } from "@/types";

// Sample challenges for beginners
export const sampleChallenges: IChallenge[] = [
  {
    id: "1",
    title: "Sum of Two Numbers",
    description: "Write a function that takes two numbers as input and returns their sum.\n\nExample:\nInput: 5, 3\nOutput: 8",
    difficulty: "Easy",
    category: "math",
    points: 10,
    testCases: [
      {
        input: "5, 3",
        expectedOutput: "8",
        description: "Basic addition"
      },
      {
        input: "10, -5",
        expectedOutput: "5",
        description: "Addition with negative number"
      },
      {
        input: "0, 0",
        expectedOutput: "0",
        description: "Adding zeros"
      }
    ],
    starterCode: "function sum(a, b) {\n  // Your code here\n  return a + b;\n}",
    solution: "function sum(a, b) {\n  return a + b;\n}",
    hints: [
      "Use the + operator to add two numbers",
      "Make sure to return the result"
    ],
    tags: ["math", "basic", "addition"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Find the Largest Number",
    description: "Write a function that takes an array of numbers and returns the largest number.\n\nExample:\nInput: [3, 7, 2, 9, 1]\nOutput: 9",
    difficulty: "Easy",
    category: "arrays",
    points: 15,
    testCases: [
      {
        input: "[3, 7, 2, 9, 1]",
        expectedOutput: "9",
        description: "Array with positive numbers"
      },
      {
        input: "[-1, -5, -3, -2]",
        expectedOutput: "-1",
        description: "Array with negative numbers"
      },
      {
        input: "[42]",
        expectedOutput: "42",
        description: "Single element array"
      }
    ],
    starterCode: "function findLargest(numbers) {\n  // Your code here\n  return Math.max(...numbers);\n}",
    solution: "function findLargest(numbers) {\n  return Math.max(...numbers);\n}",
    hints: [
      "You can use Math.max() to find the largest number",
      "Use the spread operator (...) to pass array elements as arguments",
      "Alternatively, you can loop through the array and compare each element"
    ],
    tags: ["arrays", "math", "loops"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Calculate Factorial",
    description: "Write a function that calculates the factorial of a number.\n\nExample:\nInput: 5\nOutput: 120 (5! = 5 × 4 × 3 × 2 × 1)",
    difficulty: "Medium",
    category: "math",
    points: 25,
    testCases: [
      {
        input: "5",
        expectedOutput: "120",
        description: "Factorial of 5"
      },
      {
        input: "3",
        expectedOutput: "6",
        description: "Factorial of 3"
      },
      {
        input: "0",
        expectedOutput: "1",
        description: "Factorial of 0 is 1"
      }
    ],
    starterCode: "function factorial(n) {\n  // Your code here\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
    solution: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
    hints: [
      "Use recursion or a loop",
      "Base case: factorial of 0 or 1 is 1",
      "Recursive case: n! = n × (n-1)!"
    ],
    tags: ["math", "recursion", "loops"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Find Duplicates",
    description: "Write a function that finds all duplicate elements in an array.\n\nExample:\nInput: [1, 2, 2, 3, 4, 4, 5]\nOutput: [2, 4]",
    difficulty: "Medium",
    category: "arrays",
    points: 30,
    testCases: [
      {
        input: "[1, 2, 2, 3, 4, 4, 5]",
        expectedOutput: "[2, 4]",
        description: "Array with duplicates"
      },
      {
        input: "[1, 2, 3, 4, 5]",
        expectedOutput: "[]",
        description: "Array with no duplicates"
      },
      {
        input: "[1, 1, 1, 1]",
        expectedOutput: "[1]",
        description: "Array with same element repeated"
      }
    ],
    starterCode: "function findDuplicates(arr) {\n  // Your code here\n  const seen = new Set();\n  const duplicates = new Set();\n  \n  for (let item of arr) {\n    if (seen.has(item)) {\n      duplicates.add(item);\n    } else {\n      seen.add(item);\n    }\n  }\n  \n  return Array.from(duplicates);\n}",
    solution: "function findDuplicates(arr) {\n  const seen = new Set();\n  const duplicates = new Set();\n  \n  for (let item of arr) {\n    if (seen.has(item)) {\n      duplicates.add(item);\n    } else {\n      seen.add(item);\n    }\n  }\n  \n  return Array.from(duplicates);\n}",
    hints: [
      "Use a Set to track seen elements",
      "Use another Set to track duplicates",
      "Convert the duplicates Set back to an array"
    ],
    tags: ["arrays", "sets", "loops"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Binary Tree Maximum Path Sum",
    description: "Given a binary tree, find the maximum path sum. The path may start and end at any node in the tree.\n\nExample:\nInput: [1,2,3]\nOutput: 6 (path: 2 -> 1 -> 3)\n\nNote: A path is a sequence of nodes where each pair of adjacent nodes has an edge connecting them.",
    difficulty: "Hard",
    category: "logic",
    points: 50,
    testCases: [
      {
        input: "[1,2,3]",
        expectedOutput: "6",
        description: "Simple binary tree with positive values"
      },
      {
        input: "[-10,9,20,null,null,15,7]",
        expectedOutput: "42",
        description: "Tree with negative values and complex structure"
      },
      {
        input: "[-3]",
        expectedOutput: "-3",
        description: "Single node tree"
      }
    ],
    starterCode: "function maxPathSum(root) {\n  // Your code here\n  let maxSum = -Infinity;\n  \n  function dfs(node) {\n    if (!node) return 0;\n    \n    const leftSum = Math.max(0, dfs(node.left));\n    const rightSum = Math.max(0, dfs(node.right));\n    \n    const currentPathSum = node.val + leftSum + rightSum;\n    maxSum = Math.max(maxSum, currentPathSum);\n    \n    return node.val + Math.max(leftSum, rightSum);\n  }\n  \n  dfs(root);\n  return maxSum;\n}",
    solution: "function maxPathSum(root) {\n  let maxSum = -Infinity;\n  \n  function dfs(node) {\n    if (!node) return 0;\n    \n    const leftSum = Math.max(0, dfs(node.left));\n    const rightSum = Math.max(0, dfs(node.right));\n    \n    const currentPathSum = node.val + leftSum + rightSum;\n    maxSum = Math.max(maxSum, currentPathSum);\n    \n    return node.val + Math.max(leftSum, rightSum);\n  }\n  \n  dfs(root);\n  return maxSum;\n}",
    hints: [
      "Use depth-first search (DFS) to traverse the tree",
      "For each node, calculate the maximum path sum that goes through that node",
      "Consider both paths that go through the node and paths that don't",
      "Use Math.max to find the maximum value at each step"
    ],
    tags: ["trees", "recursion", "dynamic-programming", "algorithms"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Longest Increasing Subsequence",
    description: "Given an integer array, find the length of the longest strictly increasing subsequence.\n\nExample:\nInput: [10,9,2,5,3,7,101,18]\nOutput: 4 (subsequence: [2,3,7,18])\n\nNote: A subsequence is derived by deleting some or no elements without changing the order of remaining elements.",
    difficulty: "Hard",
    category: "arrays",
    points: 45,
    testCases: [
      {
        input: "[10,9,2,5,3,7,101,18]",
        expectedOutput: "4",
        description: "Array with multiple increasing subsequences"
      },
      {
        input: "[0,1,0,3,2,3]",
        expectedOutput: "4",
        description: "Array with repeated values"
      },
      {
        input: "[7,7,7,7,7,7,7]",
        expectedOutput: "1",
        description: "Array with all same values"
      }
    ],
    starterCode: "function lengthOfLIS(nums) {\n  // Your code here\n  if (nums.length === 0) return 0;\n  \n  const dp = new Array(nums.length).fill(1);\n  \n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n  }\n  \n  return Math.max(...dp);\n}",
    solution: "function lengthOfLIS(nums) {\n  if (nums.length === 0) return 0;\n  \n  const dp = new Array(nums.length).fill(1);\n  \n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n  }\n  \n  return Math.max(...dp);\n}",
    hints: [
      "Use dynamic programming approach",
      "Create a dp array where dp[i] represents the length of LIS ending at index i",
      "For each element, check all previous elements to see if they can extend the subsequence",
      "Use nested loops to compare each element with all previous elements"
    ],
    tags: ["arrays", "dynamic-programming", "algorithms", "optimization"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Sample achievements
export const sampleAchievements: IAchievement[] = [
  {
    id: "first_challenge",
    name: "First Steps",
    description: "Complete your first coding challenge",
    icon: "🎯",
    category: "milestone",
    requirement: {
      type: "challenges_solved",
      value: 1,
    },
    points: 10,
    rarity: "common",
  },
  {
    id: "five_challenges",
    name: "Getting Started",
    description: "Complete 5 coding challenges",
    icon: "🚀",
    category: "milestone",
    requirement: {
      type: "challenges_solved",
      value: 5,
    },
    points: 50,
    rarity: "common",
  },
  {
    id: "ten_challenges",
    name: "On a Roll",
    description: "Complete 10 coding challenges",
    icon: "🔥",
    category: "milestone",
    requirement: {
      type: "challenges_solved",
      value: 10,
    },
    points: 100,
    rarity: "rare",
  },
  {
    id: "fifty_challenges",
    name: "Coding Master",
    description: "Complete 50 coding challenges",
    icon: "👑",
    category: "milestone",
    requirement: {
      type: "challenges_solved",
      value: 50,
    },
    points: 500,
    rarity: "epic",
  },
  {
    id: "hundred_points",
    name: "Point Collector",
    description: "Earn 100 points",
    icon: "⭐",
    category: "milestone",
    requirement: {
      type: "points_earned",
      value: 100,
    },
    points: 25,
    rarity: "common",
  },
  {
    id: "five_hundred_points",
    name: "High Scorer",
    description: "Earn 500 points",
    icon: "💎",
    category: "milestone",
    requirement: {
      type: "points_earned",
      value: 500,
    },
    points: 100,
    rarity: "rare",
  },
  {
    id: "three_day_streak",
    name: "Consistent Coder",
    description: "Maintain a 3-day coding streak",
    icon: "🔥",
    category: "streak",
    requirement: {
      type: "streak_days",
      value: 3,
    },
    points: 30,
    rarity: "common",
  },
  {
    id: "week_streak",
    name: "Dedicated Developer",
    description: "Maintain a 7-day coding streak",
    icon: "💪",
    category: "streak",
    requirement: {
      type: "streak_days",
      value: 7,
    },
    points: 100,
    rarity: "rare",
  },
  {
    id: "array_master",
    name: "Array Master",
    description: "Complete 5 array challenges",
    icon: "📊",
    category: "category",
    requirement: {
      type: "category_mastery",
      value: 5,
      category: "arrays",
    },
    points: 75,
    rarity: "rare",
  },
  {
    id: "string_master",
    name: "String Master",
    description: "Complete 5 string challenges",
    icon: "📝",
    category: "category",
    requirement: {
      type: "category_mastery",
      value: 5,
      category: "strings",
    },
    points: 75,
    rarity: "rare",
  },
  {
    id: "math_master",
    name: "Math Master",
    description: "Complete 5 math challenges",
    icon: "🔢",
    category: "category",
    requirement: {
      type: "category_mastery",
      value: 5,
      category: "math",
    },
    points: 75,
    rarity: "rare",
  },
  {
    id: "perfect_solver",
    name: "Perfect Solver",
    description: "Solve a challenge on the first attempt",
    icon: "🎯",
    category: "special",
    requirement: {
      type: "perfect_score",
      value: 1,
    },
    points: 50,
    rarity: "epic",
  },
  {
    id: "legendary_coder",
    name: "Legendary Coder",
    description: "Complete 100 coding challenges",
    icon: "🏆",
    category: "milestone",
    requirement: {
      type: "challenges_solved",
      value: 100,
    },
    points: 1000,
    rarity: "legendary",
  },
];