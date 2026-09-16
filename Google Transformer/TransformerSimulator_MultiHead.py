import torch
import torch.nn.functional as F
import math

print("--- 🤖 Google Transformer: Multi-Head Attention Simulation --- \n")

# 1. Same 3-word sentence as the single-head simulator: ["AI", "is", "awesome"]
# Shape: [3 words, 4 features]
words = torch.tensor([
    [1.0, 0.0, 1.0, 0.0],  # "AI"
    [0.0, 2.0, 0.0, 1.0],  # "is"
    [1.0, 1.0, 1.0, 1.0]   # "awesome"
], dtype=torch.float32)

print("Original Word Embeddings:")
print(words, "\n")

# 2. Multi-head attention splits the embedding dimension across N independent
# heads instead of running one attention pass over the whole vector. Here we
# split the 4 features into 2 heads of 2 features each:
#   Head 1 sees columns [0:2]   Head 2 sees columns [2:4]
# In a real Transformer, each head also gets its OWN learned Q/K/V projection
# matrices, so heads don't just see different slices — they learn to extract
# different kinds of relationships from the same input. We keep the
# Q = K = words, V = words * 2 simplification from the single-head version,
# just applied per-slice, so the two heads stay easy to compare by hand.
NUM_HEADS = 2
head_size = words.shape[-1] // NUM_HEADS  # 4 // 2 = 2 features per head


def run_attention_head(head_name, words_slice, feature_range):
    """Runs the same 4-step attention mechanism as the single-head simulator,
    scoped to one head's slice of the embedding."""
    Q = words_slice * 1.0
    K = words_slice * 1.0
    V = words_slice * 2.0

    raw_scores = torch.matmul(Q, K.transpose(0, 1))
    d_k = K.shape[-1]
    scaled_scores = raw_scores / math.sqrt(d_k)
    attention_weights = F.softmax(scaled_scores, dim=-1)
    output = torch.matmul(attention_weights, V)

    print(f"--- {head_name} (original embedding features {feature_range}) ---")
    print("Raw Connectivity Scores (QK^T):")
    print(raw_scores)
    print("Attention Weights (Softmax Percentages):")
    print(f"            ['AI',   'is',  'awesome']")
    print(f"'AI'     : {attention_weights[0].tolist()}")
    print(f"'is'     : {attention_weights[1].tolist()}")
    print(f"'awesome': {attention_weights[2].tolist()}")
    print(f"{head_name} Output:")
    print(output, "\n")

    return output


# 3. Run each head independently on its own slice of the embedding.
head_outputs = []
for i in range(NUM_HEADS):
    start = i * head_size
    end = start + head_size
    slice_i = words[:, start:end]
    output_i = run_attention_head(f"Head {i + 1}", slice_i, f"[{start}:{end}]")
    head_outputs.append(output_i)

# 4. Concatenate the heads' outputs back together along the feature dimension.
# In a real Transformer this concatenated result then passes through one more
# learned linear layer; we skip that here to keep the focus on the splitting/
# concatenating mechanic itself.
final_output = torch.cat(head_outputs, dim=-1)

print("=== Concatenated Multi-Head Output (all heads combined) ===")
print(final_output)
print(f"\nShape check: {NUM_HEADS} heads x {head_size} features each = {final_output.shape[-1]} features",
      f"-> matches original embedding width ({words.shape[-1]})")
