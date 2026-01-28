import { Problem } from '@/types/problem';

export const problemsData: Omit<Problem, 'id'>[] = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'array',
    pattern: 'hash-table',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of two numbers that add up to the target value.

You may assume that each input will have exactly one valid solution, and you cannot use the same element twice.

The order of the returned indices does not matter.`,
    constraints: `- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] equals 9, we return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6.',
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'Both elements are the same value and add up to the target.',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here

}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Your solution here
    pass`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Your solution here

}`,
    },
    solution: {
      approach: `The brute force approach would check every pair of numbers, resulting in O(n^2) time complexity.

A more efficient approach uses a hash table (object/dictionary) to store numbers we've seen along with their indices. As we iterate through the array:

1. For each number, calculate its complement (target - current number)
2. Check if the complement exists in our hash table
3. If it does, we found our pair - return both indices
4. If not, add the current number and its index to the hash table

This allows us to find the answer in a single pass through the array.`,
      complexity: {
        time: 'O(n) - We traverse the array once',
        space: 'O(n) - We store at most n elements in the hash table',
      },
      code: {
        javascript: `function twoSum(nums, target) {
  const seen = {};

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (complement in seen) {
      return [seen[complement], i];
    }

    seen[nums[i]] = i;
  }

  return [];
}`,
        python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
  const seen: Record<number, number> = {};

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (complement in seen) {
      return [seen[complement], i];
    }

    seen[nums[i]] = i;
  }

  return [];
}`,
      },
    },
    testCases: [
      { input: '[[2,7,11,15], 9]', expected: '[0,1]', description: 'Basic case' },
      { input: '[[3,2,4], 6]', expected: '[1,2]', description: 'Target in middle' },
      { input: '[[3,3], 6]', expected: '[0,1]', description: 'Duplicate numbers' },
      { input: '[[1,2,3,4,5], 9]', expected: '[3,4]', description: 'Larger array' },
      { input: '[[-1,-2,-3,-4,-5], -8]', expected: '[2,4]', description: 'Negative numbers' },
    ],
    hints: [
      'Think about what information you need to track as you iterate through the array.',
      'For each number, what other number would you need to find to reach the target?',
      'A hash table can give you O(1) lookup time for checking if a number exists.',
    ],
    isPremium: false,
    order: 1,
  },
  {
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    category: 'array',
    pattern: 'sliding-window',
    description: `You are given an array \`prices\` where \`prices[i]\` represents the price of a stock on day \`i\`.

You want to maximize profit by choosing a single day to buy and a different day in the future to sell.

Return the maximum profit achievable from this transaction. If no profit is possible, return 0.`,
    constraints: `- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4`,
    examples: [
      {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6). Profit = 6 - 1 = 5.',
      },
      {
        input: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
        explanation: 'Prices only decrease, so no profitable transaction is possible.',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // Your solution here

}`,
      python: `def maxProfit(prices: list[int]) -> int:
    # Your solution here
    pass`,
      typescript: `function maxProfit(prices: number[]): number {
  // Your solution here

}`,
    },
    solution: {
      approach: `The key insight is that we want to find the maximum difference between a later price and an earlier price.

We can solve this in one pass by tracking:
1. The minimum price seen so far (potential buy day)
2. The maximum profit achievable

For each price:
- Update the minimum if current price is lower
- Calculate potential profit (current price - minimum)
- Update maximum profit if this profit is higher

This is similar to the sliding window pattern where we're maintaining a window from the minimum price to the current price.`,
      complexity: {
        time: 'O(n) - Single pass through the array',
        space: 'O(1) - Only storing two variables',
      },
      code: {
        javascript: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else {
      const profit = price - minPrice;
      maxProfit = Math.max(maxProfit, profit);
    }
  }

  return maxProfit;
}`,
        python: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        if price < min_price:
            min_price = price
        else:
            profit = price - min_price
            max_profit = max(max_profit, profit)

    return max_profit`,
        typescript: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else {
      const profit = price - minPrice;
      maxProfit = Math.max(maxProfit, profit);
    }
  }

  return maxProfit;
}`,
      },
    },
    testCases: [
      { input: '[[7,1,5,3,6,4]]', expected: '5', description: 'Basic case with profit' },
      { input: '[[7,6,4,3,1]]', expected: '0', description: 'Decreasing prices' },
      { input: '[[1,2]]', expected: '1', description: 'Two elements ascending' },
      { input: '[[2,1]]', expected: '0', description: 'Two elements descending' },
      { input: '[[3,3,3,3,3]]', expected: '0', description: 'All same prices' },
      { input: '[[1,4,2,7,5,3]]', expected: '6', description: 'Multiple peaks' },
    ],
    hints: [
      'You must buy before you sell. Think about what the best buying day would be.',
      'Track the minimum price seen so far as you iterate.',
      'For each day, calculate the profit if you sold on that day (having bought at the minimum).',
    ],
    isPremium: false,
    order: 2,
  },
  {
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'easy',
    category: 'array',
    pattern: 'hash-table',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.`,
    constraints: `- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9`,
    examples: [
      {
        input: 'nums = [1, 2, 3, 1]',
        output: 'true',
        explanation: 'The value 1 appears at index 0 and index 3.',
      },
      {
        input: 'nums = [1, 2, 3, 4]',
        output: 'false',
        explanation: 'All elements are distinct.',
      },
      {
        input: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]',
        output: 'true',
        explanation: 'Multiple values appear more than once.',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  // Your solution here

}`,
      python: `def containsDuplicate(nums: list[int]) -> bool:
    # Your solution here
    pass`,
      typescript: `function containsDuplicate(nums: number[]): boolean {
  // Your solution here

}`,
    },
    solution: {
      approach: `There are multiple approaches to solve this problem:

1. **Brute Force**: Compare each element with every other element. O(n^2) time.

2. **Sorting**: Sort the array and check adjacent elements. O(n log n) time.

3. **Hash Set (Optimal)**: Use a Set to track seen numbers. As we iterate:
   - If the current number is already in the Set, we found a duplicate
   - Otherwise, add it to the Set

The hash set approach is optimal because it gives us O(1) average lookup and insertion time.`,
      complexity: {
        time: 'O(n) - Single pass through the array',
        space: 'O(n) - In the worst case, we store all n elements in the Set',
      },
      code: {
        javascript: `function containsDuplicate(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }

  return false;
}

// Alternative one-liner:
// const containsDuplicate = nums => new Set(nums).size !== nums.length;`,
        python: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()

    for num in nums:
        if num in seen:
            return True
        seen.add(num)

    return False

# Alternative one-liner:
# return len(set(nums)) != len(nums)`,
        typescript: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }

  return false;
}`,
      },
    },
    testCases: [
      { input: '[[1,2,3,1]]', expected: 'true', description: 'Has duplicate' },
      { input: '[[1,2,3,4]]', expected: 'false', description: 'All unique' },
      { input: '[[1,1,1,3,3,4,3,2,4,2]]', expected: 'true', description: 'Multiple duplicates' },
      { input: '[[1]]', expected: 'false', description: 'Single element' },
      { input: '[[1,1]]', expected: 'true', description: 'Two same elements' },
    ],
    hints: [
      'What data structure allows O(1) lookup to check if we\'ve seen an element before?',
      'A Set automatically handles uniqueness - how can you use this property?',
      'Consider what happens when you add elements to a Set that already exist.',
    ],
    isPremium: false,
    order: 3,
  },
  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'easy',
    category: 'string',
    pattern: 'hash-table',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.`,
    constraints: `- 1 <= s.length, t.length <= 5 * 10^4
- s and t consist of lowercase English letters`,
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Both strings contain: a(3), n(1), g(1), r(1), m(1).',
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
        explanation: '"rat" has a t, while "car" has a c. They are not anagrams.',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  // Your solution here

}`,
      python: `def isAnagram(s: str, t: str) -> bool:
    # Your solution here
    pass`,
      typescript: `function isAnagram(s: string, t: string): boolean {
  // Your solution here

}`,
    },
    solution: {
      approach: `Two strings are anagrams if they contain the same characters with the same frequencies.

**Approach 1 - Sorting**: Sort both strings and compare. If they're equal, they're anagrams.

**Approach 2 - Hash Table (Character Count)**:
1. First, check if lengths are equal (quick fail)
2. Count character frequencies in the first string
3. Decrement counts while iterating through the second string
4. If any count goes negative, they're not anagrams
5. If all counts reach zero, they are anagrams

The hash table approach is more efficient for large strings since sorting is O(n log n).`,
      complexity: {
        time: 'O(n) - We traverse each string once',
        space: 'O(1) - The character count map has at most 26 keys (lowercase letters)',
      },
      code: {
        javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) {
    return false;
  }

  const charCount = {};

  for (const char of s) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  for (const char of t) {
    if (!charCount[char]) {
      return false;
    }
    charCount[char]--;
  }

  return true;
}`,
        python: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    char_count = {}

    for char in s:
        char_count[char] = char_count.get(char, 0) + 1

    for char in t:
        if char not in char_count or char_count[char] == 0:
            return False
        char_count[char] -= 1

    return True

# Alternative using Counter:
# from collections import Counter
# return Counter(s) == Counter(t)`,
        typescript: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false;
  }

  const charCount: Record<string, number> = {};

  for (const char of s) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  for (const char of t) {
    if (!charCount[char]) {
      return false;
    }
    charCount[char]--;
  }

  return true;
}`,
      },
    },
    testCases: [
      { input: '["anagram", "nagaram"]', expected: 'true', description: 'Valid anagram' },
      { input: '["rat", "car"]', expected: 'false', description: 'Different characters' },
      { input: '["a", "a"]', expected: 'true', description: 'Single character same' },
      { input: '["ab", "ba"]', expected: 'true', description: 'Two characters swapped' },
      { input: '["aacc", "ccac"]', expected: 'false', description: 'Same chars, different counts' },
    ],
    hints: [
      'What defines an anagram? Same characters, same frequency.',
      'How can you efficiently count character frequencies?',
      'If the strings have different lengths, can they be anagrams?',
    ],
    isPremium: false,
    order: 4,
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'string',
    pattern: 'stack',
    description: `Given a string \`s\` containing only the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

A string is valid if:
1. Open brackets are closed by the same type of brackets.
2. Open brackets are closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: `- 1 <= s.length <= 10^4
- s consists of parentheses only: '(){}[]'`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Single pair of matching parentheses.',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Three pairs of matching brackets in sequence.',
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Opening parenthesis does not match closing bracket.',
      },
      {
        input: 's = "([)]"',
        output: 'false',
        explanation: 'Brackets are closed in wrong order.',
      },
      {
        input: 's = "{[]}"',
        output: 'true',
        explanation: 'Nested brackets are properly matched.',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your solution here

}`,
      python: `def isValid(s: str) -> bool:
    # Your solution here
    pass`,
      typescript: `function isValid(s: string): boolean {
  // Your solution here

}`,
    },
    solution: {
      approach: `This is a classic stack problem. The key insight is that the most recently opened bracket must be closed first (LIFO - Last In, First Out).

Algorithm:
1. Create a mapping of closing brackets to their opening counterparts
2. Use a stack to track opening brackets
3. For each character:
   - If it's an opening bracket, push it onto the stack
   - If it's a closing bracket:
     - Check if the stack is empty (no matching opener)
     - Check if the top of stack matches (correct type)
     - Pop from stack if valid
4. At the end, the stack should be empty (all brackets matched)

The stack naturally handles nesting because we always check against the most recent unmatched opening bracket.`,
      complexity: {
        time: 'O(n) - Single pass through the string',
        space: 'O(n) - In worst case, all characters are opening brackets',
      },
      code: {
        javascript: `function isValid(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char in pairs) {
      // Closing bracket
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      // Opening bracket
      stack.push(char);
    }
  }

  return stack.length === 0;
}`,
        python: `def isValid(s: str) -> bool:
    stack = []
    pairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    }

    for char in s:
        if char in pairs:
            # Closing bracket
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            # Opening bracket
            stack.append(char)

    return len(stack) == 0`,
        typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char in pairs) {
      // Closing bracket
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      // Opening bracket
      stack.push(char);
    }
  }

  return stack.length === 0;
}`,
      },
    },
    testCases: [
      { input: '["()"]', expected: 'true', description: 'Simple valid' },
      { input: '["()[]{}"]', expected: 'true', description: 'Multiple pairs' },
      { input: '["(]"]', expected: 'false', description: 'Mismatched types' },
      { input: '["([)]"]', expected: 'false', description: 'Wrong order' },
      { input: '["{[]}"]', expected: 'true', description: 'Nested brackets' },
      { input: '["("]', expected: 'false', description: 'Unclosed bracket' },
      { input: '[")"]', expected: 'false', description: 'No opener' },
    ],
    hints: [
      'What data structure follows Last-In-First-Out (LIFO) principle?',
      'When you see an opening bracket, what should you do?',
      'When you see a closing bracket, what must be true about the most recent opening bracket?',
      'What should be true about the stack at the end if all brackets are matched?',
    ],
    isPremium: false,
    order: 5,
  },
];

export default problemsData;
