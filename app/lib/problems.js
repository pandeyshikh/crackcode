// A comprehensive database of 189 standard DSA problems across 15 categories for CP students
export const PROBLEMS_LIST = [
  // ==========================================
  // 1. Arrays & Hashing (13 problems)
  // ==========================================
  {
    id: "two-sum",
    title: "Two Sum (Sorted Array)",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    timeLimit: "1.0s",
    memoryLimit: "256MB",
    featured: true // Has pre-loaded description and buggy code
  },
  { id: "contains-duplicate", title: "Contains Duplicate", category: "Arrays & Hashing", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "valid-anagram", title: "Valid Anagram", category: "Arrays & Hashing", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "group-anagrams", title: "Group Anagrams", category: "Arrays & Hashing", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "top-k-frequent", title: "Top K Frequent Elements", category: "Arrays & Hashing", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "product-except-self", title: "Product of Array Except Self", category: "Arrays & Hashing", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "valid-sudoku", title: "Valid Sudoku", category: "Arrays & Hashing", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "encode-decode-strings", title: "Encode and Decode Strings", category: "Arrays & Hashing", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "longest-consecutive", title: "Longest Consecutive Sequence", category: "Arrays & Hashing", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "check-subarray-sum", title: "Subarray Sum Equals K", category: "Arrays & Hashing", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "subarray-divisible-k", title: "Subarray Sums Divisible by K", category: "Arrays & Hashing", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "first-missing-positive", title: "First Missing Positive", category: "Arrays & Hashing", difficulty: "Hard", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "max-consecutive-ones", title: "Max Consecutive Ones", category: "Arrays & Hashing", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },

  // ==========================================
  // 2. Two Pointers (12 problems)
  // ==========================================
  { id: "valid-palindrome", title: "Valid Palindrome", category: "Two Pointers", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "three-sum", title: "3Sum", category: "Two Pointers", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "container-with-most-water", title: "Container With Most Water", category: "Two Pointers", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "trapping-rain-water", title: "Trapping Rain Water", category: "Two Pointers", difficulty: "Hard", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "two-sum-ii", title: "Two Sum II - Input Array Is Sorted", category: "Two Pointers", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "remove-duplicates-sorted", title: "Remove Duplicates from Sorted Array", category: "Two Pointers", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "remove-element", title: "Remove Element", category: "Two Pointers", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "move-zeroes", title: "Move Zeroes", category: "Two Pointers", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "sort-colors", title: "Sort Colors (Dutch National Flag)", category: "Two Pointers", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "rotate-array", title: "Rotate Array", category: "Two Pointers", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "valid-palindrome-ii", title: "Valid Palindrome II", category: "Two Pointers", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "bag-of-tokens", title: "Bag of Tokens", category: "Two Pointers", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },

  // ==========================================
  // 3. Sliding Window (12 problems)
  // ==========================================
  { id: "best-time-buy-sell-stock", title: "Best Time to Buy and Sell Stock", category: "Sliding Window", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "longest-substring-without-repeats", title: "Longest Substring Without Repeating Characters", category: "Sliding Window", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", category: "Sliding Window", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "permutation-in-string", title: "Permutation in String", category: "Sliding Window", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "minimum-window-substring", title: "Minimum Window Substring", category: "Sliding Window", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "sliding-window-maximum", title: "Sliding Window Maximum", category: "Sliding Window", difficulty: "Hard", timeLimit: "2.5s", memoryLimit: "512MB" },
  { id: "minimum-size-subarray-sum", title: "Minimum Size Subarray Sum", category: "Sliding Window", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "find-all-anagrams", title: "Find All Anagrams in a String", category: "Sliding Window", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "max-consecutive-ones-iii", title: "Max Consecutive Ones III", category: "Sliding Window", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "substring-with-concatenation", title: "Substring with Concatenation of All Words", category: "Sliding Window", difficulty: "Hard", timeLimit: "3.0s", memoryLimit: "512MB" },
  { id: "number-of-subarrays-k-odds", title: "Number of Subarrays with K Odd Numbers", category: "Sliding Window", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "fruits-into-baskets", title: "Fruits into Baskets", category: "Sliding Window", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },

  // ==========================================
  // 4. Stack & Queue (13 problems)
  // ==========================================
  {
    id: "valid-parentheses",
    title: "Valid Parentheses (Stacks)",
    category: "Stack & Queue",
    difficulty: "Easy",
    timeLimit: "1.0s",
    memoryLimit: "128MB",
    featured: true
  },
  { id: "min-stack", title: "Min Stack Design", category: "Stack & Queue", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "evaluate-reverse-polish-notation", title: "Evaluate Reverse Polish Notation", category: "Stack & Queue", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "generate-parentheses", title: "Generate Parentheses", category: "Stack & Queue", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "daily-temperatures", title: "Daily Temperatures", category: "Stack & Queue", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "car-fleet", title: "Car Fleet", category: "Stack & Queue", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "largest-rectangle-in-histogram", title: "Largest Rectangle in Histogram", category: "Stack & Queue", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "implement-queue-using-stacks", title: "Implement Queue using Stacks", category: "Stack & Queue", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "online-stock-span", title: "Online Stock Span", category: "Stack & Queue", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "next-greater-element-i", title: "Next Greater Element I", category: "Stack & Queue", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "next-greater-element-ii", title: "Next Greater Element II", category: "Stack & Queue", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "asteroid-collision", title: "Asteroid Collision", category: "Stack & Queue", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "sliding-window-maximum-stack", title: "Sliding Window Maximum (Monotonic Queue)", category: "Stack & Queue", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },

  // ==========================================
  // 5. Binary Search (12 problems)
  // ==========================================
  {
    id: "binary-search",
    title: "Binary Search",
    category: "Binary Search",
    difficulty: "Easy",
    timeLimit: "0.5s",
    memoryLimit: "128MB",
    featured: true
  },
  { id: "search-2d-matrix", title: "Search a 2D Matrix", category: "Binary Search", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "koko-eating-bananas", title: "Koko Eating Bananas", category: "Binary Search", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "search-rotated-sorted", title: "Search in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "find-min-rotated-sorted", title: "Find Minimum in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "time-based-key-value", title: "Time Based Key-Value Store", category: "Binary Search", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "median-two-sorted-arrays", title: "Median of Two Sorted Arrays", category: "Binary Search", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "512MB" },
  { id: "find-peak-element", title: "Find Peak Element", category: "Binary Search", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "first-last-position-sorted", title: "Find First and Last Position of Element in Sorted Array", category: "Binary Search", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "capacity-to-ship-packages", title: "Capacity To Ship Packages Within D Days", category: "Binary Search", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "split-array-largest-sum", title: "Split Array Largest Sum", category: "Binary Search", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "aggressive-cows", title: "Aggressive Cows (SPOJ)", category: "Binary Search", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },

  // ==========================================
  // 6. Linked List (12 problems)
  // ==========================================
  { id: "reverse-linked-list", title: "Reverse Linked List", category: "Linked List", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", category: "Linked List", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "linked-list-cycle", title: "Linked List Cycle Detection", category: "Linked List", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "reorder-list", title: "Reorder List", category: "Linked List", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "remove-nth-node-from-end", title: "Remove Nth Node From End of List", category: "Linked List", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "copy-list-with-random-pointer", title: "Copy List with Random Pointer", category: "Linked List", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "add-two-numbers-list", title: "Add Two Numbers", category: "Linked List", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "linked-list-cycle-ii", title: "Linked List Cycle II", category: "Linked List", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "find-duplicate-number", title: "Find the Duplicate Number (Floyd's)", category: "Linked List", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "lru-cache", title: "LRU Cache Design", category: "Linked List", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "512MB" },
  { id: "merge-k-sorted-lists", title: "Merge k Sorted Lists", category: "Linked List", difficulty: "Hard", timeLimit: "2.5s", memoryLimit: "512MB" },
  { id: "reverse-nodes-in-k-group", title: "Reverse Nodes in k-Group", category: "Linked List", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },

  // ==========================================
  // 7. Trees & BST (13 problems)
  // ==========================================
  { id: "invert-binary-tree", title: "Invert Binary Tree", category: "Trees & BST", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "maximum-depth-binary-tree", title: "Maximum Depth of Binary Tree", category: "Trees & BST", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "diameter-binary-tree", title: "Diameter of Binary Tree", category: "Trees & BST", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "balanced-binary-tree", title: "Balanced Binary Tree", category: "Trees & BST", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "same-tree", title: "Same Tree", category: "Trees & BST", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "subtree-another-tree", title: "Subtree of Another Tree", category: "Trees & BST", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "lowest-common-ancestor-bst", title: "Lowest Common Ancestor of a Binary Search Tree", category: "Trees & BST", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "binary-tree-level-order", title: "Binary Tree Level Order Traversal", category: "Trees & BST", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "binary-tree-right-side-view", title: "Binary Tree Right Side View", category: "Trees & BST", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "count-good-nodes-binary-tree", title: "Count Good Nodes in Binary Tree", category: "Trees & BST", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "validate-binary-search-tree", title: "Validate Binary Search Tree", category: "Trees & BST", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "kth-smallest-element-bst", title: "Kth Smallest Element in a BST", category: "Trees & BST", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", category: "Trees & BST", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "512MB" },

  // ==========================================
  // 8. Tries (12 problems)
  // ==========================================
  { id: "implement-trie", title: "Implement Trie (Prefix Tree)", category: "Tries", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "design-add-search-words", title: "Design Add and Search Words Data Structure", category: "Tries", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "word-search-ii", title: "Word Search II", category: "Tries", difficulty: "Hard", timeLimit: "3.0s", memoryLimit: "512MB" },
  { id: "replace-words", title: "Replace Words", category: "Tries", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "prefix-and-suffix-search", title: "Prefix and Suffix Search", category: "Tries", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "512MB" },
  { id: "map-sum-pairs", title: "Map Sum Pairs", category: "Tries", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "maximum-xor-two-numbers", title: "Maximum XOR of Two Numbers in an Array", category: "Tries", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "stream-of-characters", title: "Stream of Characters", category: "Tries", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "longest-word-in-dictionary", title: "Longest Word in Dictionary", category: "Tries", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "trie-suffix-tree", title: "Suffix Tree Construction", category: "Tries", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "palindrome-pairs-trie", title: "Palindrome Pairs", category: "Tries", difficulty: "Hard", timeLimit: "3.0s", memoryLimit: "512MB" },
  { id: "count-triplets-xor-two-arrays", title: "Count Triplets That Can Form Two Blocks of Equal XOR", category: "Tries", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },

  // ==========================================
  // 9. Heap / Priority Queue (12 problems)
  // ==========================================
  { id: "kth-largest-element-stream", title: "Kth Largest Element in a Stream", category: "Heap / Priority Queue", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "last-stone-weight", title: "Last Stone Weight", category: "Heap / Priority Queue", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "k-closest-points-origin", title: "K Closest Points to Origin", category: "Heap / Priority Queue", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "kth-largest-element-array", title: "Kth Largest Element in an Array", category: "Heap / Priority Queue", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "task-scheduler", title: "Task Scheduler", category: "Heap / Priority Queue", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "design-twitter", title: "Design Twitter (News Feed)", category: "Heap / Priority Queue", difficulty: "Medium", timeLimit: "2.5s", memoryLimit: "512MB" },
  { id: "find-median-data-stream", title: "Find Median from Data Stream", category: "Heap / Priority Queue", difficulty: "Hard", timeLimit: "2.5s", memoryLimit: "256MB" },
  { id: "merge-k-sorted-arrays", title: "Merge K Sorted Arrays", category: "Heap / Priority Queue", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "reorganize-string", title: "Reorganize String", category: "Heap / Priority Queue", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "furthest-building-you-can-reach", title: "Furthest Building You Can Reach", category: "Heap / Priority Queue", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "swim-in-rising-water", title: "Swim in Rising Water (Dijkstra-Heap)", category: "Heap / Priority Queue", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "minimum-cost-connect-sticks", title: "Minimum Cost to Connect Sticks", category: "Heap / Priority Queue", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },

  // ==========================================
  // 10. Backtracking (12 problems)
  // ==========================================
  { id: "subsets", title: "Subsets Generation", category: "Backtracking", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "combination-sum", title: "Combination Sum", category: "Backtracking", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "permutations", title: "Permutations of Array", category: "Backtracking", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "subsets-ii", title: "Subsets II (With Duplicates)", category: "Backtracking", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "combination-sum-ii", title: "Combination Sum II", category: "Backtracking", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "word-search", title: "Word Search DFS", category: "Backtracking", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "palindrome-partitioning", title: "Palindrome Partitioning", category: "Backtracking", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "letter-combinations-phone", title: "Letter Combinations of a Phone Number", category: "Backtracking", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "n-queens", title: "N-Queens Puzzle", category: "Backtracking", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "sudoku-solver", title: "Sudoku Solver", category: "Backtracking", difficulty: "Hard", timeLimit: "3.0s", memoryLimit: "256MB" },
  { id: "generate-ip-addresses", title: "Restore IP Addresses", category: "Backtracking", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "matchsticks-to-square", title: "Matchsticks to Square", category: "Backtracking", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },

  // ==========================================
  // 11. Graphs (BFS, DFS, Dijkstra, Union-Find) (13 problems)
  // ==========================================
  {
    id: "cycle-detection",
    title: "Cycle Detection in Directed Graph (DFS)",
    category: "Graphs (BFS, DFS, Dijkstra, Union-Find)",
    difficulty: "Medium",
    timeLimit: "2.0s",
    memoryLimit: "256MB",
    featured: true
  },
  { id: "number-of-islands", title: "Number of Islands", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "clone-graph", title: "Clone Graph", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "max-area-island", title: "Max Area of Island", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "pacific-atlantic-water-flow", title: "Pacific Atlantic Water Flow", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "surrounded-regions", title: "Surrounded Regions (DFS/BFS)", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "rotting-oranges", title: "Rotting Oranges Multi-Source BFS", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "walls-and-gates", title: "Walls and Gates", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "course-schedule", title: "Course Schedule", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "course-schedule-ii", title: "Course Schedule II (Topo Sort)", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "redundant-connection", title: "Redundant Connection (DSU)", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "number-of-connected-components", title: "Number of Connected Components in Graph", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "graph-valid-tree", title: "Graph Valid Tree", category: "Graphs (BFS, DFS, Dijkstra, Union-Find)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },

  // ==========================================
  // 12. Advanced Graphs (Topological Sort, MST) (12 problems)
  // ==========================================
  { id: "network-delay-time", title: "Network Delay Time (Dijkstra)", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "min-cost-connect-points", title: "Min Cost to Connect All Points (Prim/Kruskal)", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "cheapest-flights-within-k-stops", title: "Cheapest Flights Within K Stops", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "reconstruct-itinerary", title: "Reconstruct Itinerary (Eulerian Path)", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "alien-dictionary", title: "Alien Dictionary", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Hard", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "critical-connections-network", title: "Critical Connections in a Network (Tarjan)", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Hard", timeLimit: "2.5s", memoryLimit: "256MB" },
  { id: "bellman-ford", title: "Bellman Ford shortest path", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "floyd-warshall", title: "Floyd Warshall All-Pairs Shortest Path", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "kosaraju-scc", title: "Kosaraju Algorithm for Strongly Connected Components", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "articulation-points", title: "Articulation Points in Graph", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "eulerian-path-undirected", title: "Eulerian Path in Undirected Graph", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Hard", timeLimit: "2.0s", memoryLimit: "256MB" },
  { id: "bipartite-graph-check", title: "Is Graph Bipartite?", category: "Advanced Graphs (Topological Sort, MST)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },

  // ==========================================
  // 13. Dynamic Programming (1D & 2D) (13 problems)
  // ==========================================
  {
    id: "fibonacci-dp",
    title: "Fibonacci Number (Recursion + Memo)",
    category: "Dynamic Programming (1D & 2D)",
    difficulty: "Easy",
    timeLimit: "1.0s",
    memoryLimit: "256MB",
    featured: true
  },
  { id: "climbing-stairs", title: "Climbing Stairs", category: "Dynamic Programming (1D & 2D)", difficulty: "Easy", timeLimit: "0.5s", memoryLimit: "128MB" },
  { id: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", category: "Dynamic Programming (1D & 2D)", difficulty: "Easy", timeLimit: "0.5s", memoryLimit: "128MB" },
  { id: "house-robber", title: "House Robber", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "house-robber-ii", title: "House Robber II (Circular)", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "longest-palindromic-substring", title: "Longest Palindromic Substring", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "palindromic-substrings-count", title: "Palindromic Substrings Count", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "decode-ways", title: "Decode Ways", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "coin-change", title: "Coin Change", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "maximum-product-subarray", title: "Maximum Product Subarray", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "word-break", title: "Word Break", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "longest-increasing-subsequence", title: "Longest Increasing Subsequence (LIS)", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "partition-equal-subset-sum", title: "Partition Equal Subset Sum (0-1 Knapsack)", category: "Dynamic Programming (1D & 2D)", difficulty: "Medium", timeLimit: "2.0s", memoryLimit: "256MB" },

  // ==========================================
  // 14. Greedy (12 problems)
  // ==========================================
  {
    id: "merge-intervals",
    title: "Merge Intervals (Greedy/Sorting)",
    category: "Greedy",
    difficulty: "Medium",
    timeLimit: "1.5s",
    memoryLimit: "256MB",
    featured: true
  },
  { id: "maximum-subarray", title: "Maximum Subarray (Kadane's)", category: "Greedy", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "jump-game", title: "Jump Game", category: "Greedy", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "jump-game-ii", title: "Jump Game II", category: "Greedy", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "gas-station", title: "Gas Station Circuit", category: "Greedy", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "hand-of-straights", title: "Hand of Straights", category: "Greedy", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "non-overlapping-intervals", title: "Non-overlapping Intervals", category: "Greedy", difficulty: "Medium", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "partition-labels", title: "Partition Labels", category: "Greedy", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "valid-parenthesis-string-greedy", title: "Valid Parenthesis String", category: "Greedy", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "candy", title: "Candy Distribution", category: "Greedy", difficulty: "Hard", timeLimit: "1.5s", memoryLimit: "256MB" },
  { id: "assign-cookies", title: "Assign Cookies", category: "Greedy", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "lemonade-change", title: "Lemonade Change", category: "Greedy", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },

  // ==========================================
  // 15. Bit Manipulation & Math (13 problems)
  // ==========================================
  { id: "single-number", title: "Single Number", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "number-of-1-bits", title: "Number of 1 Bits (Hamming Weight)", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "0.5s", memoryLimit: "128MB" },
  { id: "counting-bits", title: "Counting Bits", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "256MB" },
  { id: "reverse-bits", title: "Reverse Bits of 32-bit Integer", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "missing-number-bit", title: "Missing Number", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "sum-two-integers-bit", title: "Sum of Two Integers (Bitwise Sum)", category: "Bit Manipulation & Math", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "reverse-integer-math", title: "Reverse Integer", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "palindrome-number-math", title: "Palindrome Number", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "pow-x-n", title: "Pow(x, n) binary exponentiation", category: "Bit Manipulation & Math", difficulty: "Medium", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "sqrt-x", title: "Sqrt(x)", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "plus-one-math", title: "Plus One", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "happy-number-math", title: "Happy Number", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "1.0s", memoryLimit: "128MB" },
  { id: "gcd-lcm", title: "Greatest Common Divisor (Euclidean)", category: "Bit Manipulation & Math", difficulty: "Easy", timeLimit: "0.5s", memoryLimit: "128MB" }
];

// Map containing preloaded details of featured problems (keys are the problem IDs)
export const FEATURED_DETAILS = {
  "two-sum": {
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.
    
Return the indices of the two numbers, \`[index1, index2]\`, added by one as an integer array of length 2.

Your solution must use only **O(1) extra space** and run in **O(N) time** complexity.`,
    defaultCode: `#include <vector>
#include <iostream>
using namespace std;

// Find two indices that sum to target
vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;
    
    while (left < right) {
        int current_sum = numbers[left] + numbers[right];
        if (current_sum == target) {
            return {left + 1, right + 1}; // 1-indexed return
        }
        if (current_sum < target) {
            left++; // Buggy pointer transition: what happens on updates?
        } else {
            right--;
        }
    }
    return {};
}`,
    defaultTraceInput: `{"initialState": [2, 7, 11, 15], "target": 9}`
  },
  "binary-search": {
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log N)** runtime complexity.`,
    defaultCode: `#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    // Buggy: Standard binary search loop condition
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        }
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    defaultTraceInput: `{"initialState": [-1, 0, 3, 5, 9, 12], "target": 9}`
  },
  "fibonacci-dp": {
    description: `The Fibonacci numbers, commonly denoted \`F(n)\`, form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.
    
Compute \`F(n)\`. Solve this using **recursion with memoization** to avoid the exponential O(2^N) complexity bottleneck and reduce it to **O(N)**.`,
    defaultCode: `#include <vector>
using namespace std;

int fibHelper(int n, vector<int>& memo) {
    if (n <= 1) return n;
    
    if (memo[n] != -1) return memo[n];
    
    // Buggy recursion: fails to cache results in memo!
    return fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
}

int fib(int n) {
    vector<int> memo(n + 1, -1);
    return fibHelper(n, memo);
}`,
    defaultTraceInput: `{"initialState": [0, 1, 1, 2, 3, 5, 8], "n": 6}`
  },
  "valid-parentheses": {
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.
An input string is valid if open brackets are closed by the same type of brackets and closed in the correct order.

Solve this in **O(N)** time and space.`,
    defaultCode: `#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            // Buggy check: what if the stack is already empty?
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) {
                return false;
            }
        }
    }
    // Buggy: returns true regardless of leftover stack elements!
    return true;
}`,
    defaultTraceInput: `{"initialState": ["(", "{", "}", ")"], "s": "({})"}`
  },
  "merge-intervals": {
    description: `Given an array of intervals where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

Your solution must run in **O(N log N)** time complexity.`,
    defaultCode: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    
    // Buggy: forgets to sort intervals by start time first!
    // sort(intervals.begin(), intervals.end());
    
    vector<vector<int>> merged;
    merged.push_back(intervals[0]);
    
    for (int i = 1; i < intervals.size(); i++) {
        vector<int>& last = merged.back();
        // Buggy overlapping condition checks
        if (intervals[i][0] <= last[1]) {
            last[1] = max(last[1], intervals[i][1]);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}`,
    defaultTraceInput: `{"initialState": [[1,3],[2,6],[8,10],[15,18]], "intervals": [[1,3],[2,6],[8,10],[15,18]]}`
  },
  "cycle-detection": {
    description: `Given a directed graph represented as an adjacency list of vertices, write a function to detect if it contains a cycle.
Return \`true\` if a cycle exists, else \`false\`. Use **DFS** traversal.

Time Complexity: **O(V + E)**`,
    defaultCode: `#include <vector>
using namespace std;

bool dfs(int u, vector<vector<int>>& adj, vector<bool>& visited, vector<bool>& in_stack) {
    visited[u] = true;
    in_stack[u] = true;
    
    for (int v : adj[u]) {
        if (!visited[v]) {
            if (dfs(v, adj, visited, in_stack)) return true;
        } else if (in_stack[v]) {
            return true; // Cycle detected
        }
    }
    // Buggy: Forgets to pop the element out of the recursion stack!
    // in_stack[u] = false;
    return false;
}

bool hasCycle(int n, vector<vector<int>>& adj) {
    vector<bool> visited(n, false);
    vector<bool> in_stack(n, false);
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            if (dfs(i, adj, visited, in_stack)) return true;
        }
    }
    return false;
}`,
    defaultTraceInput: `{"initialState": [[0,1],[1,2],[2,0]], "adj": [[1],[2],[0]]}`
  }
};
