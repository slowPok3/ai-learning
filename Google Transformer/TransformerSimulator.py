import torch
import torch.nn.functional as F
import math

print("--- 🤖 Google Transformer: Self-Attention Simulation --- \n")

# 1. Imagine our input sentence has 3 tokens (words): ["AI", "is", "awesome"]
# We will represent each word as a simple 4-dimensional vector (Embedding)
# Shape: [3 words, 4 features]
words = torch.tensor([
    [1.0, 0.0, 1.0, 0.0],  # "AI"
    [0.0, 2.0, 0.0, 1.0],  # "is"
    [1.0, 1.0, 1.0, 1.0]   # "awesome"
], dtype=torch.float32)

print("Original Word Embeddings:")
print(words, "\n")

# 2. In a real Transformer, linear layers create Queries, Keys, and Values.
# For this simulation, let's pretend our model has already generated them.
Q = words * 1.0  # Queries: What each word is hunting for
K = words * 1.0  # Keys: What each word contains
V = words * 2.0  # Values: The actual content meaning to pass forward

# 3. Calculate Attention Scores (Q multiplied by Transposed K)
# This calculates how much every word cares about every other word.
raw_scores = torch.matmul(Q, K.transpose(0, 1))
print("Raw Connectivity Scores (QK^T):")
print(raw_scores, "\n")

# 4. Scale the scores down based on vector dimension (sqrt of d_k, which is sqrt(4) = 2)
# This keeps our math stable.
d_k = K.shape[-1]
scaled_scores = raw_scores / math.sqrt(d_k)

# 5. Softmax turns raw scores into clean percentages (probabilities)
attention_weights = F.softmax(scaled_scores, dim=-1)
print("Attention Weights (Softmax Percentages) - Who looks at who:")
print(f"            ['AI',   'is',  'awesome']")
print(f"'AI'     : {attention_weights[0].tolist()}")
print(f"'is'     : {attention_weights[1].tolist()}")
print(f"'awesome': {attention_weights[2].tolist()}\n")

# 6. Multiply weights by Values to get the final context-aware output
output = torch.matmul(attention_weights, V)
print("Final Contextual Output Vector:")
print(output)