// curriculum_data.js

// This file contains your curriculum in an easy-to-update Markdown format.
// Because browsers block loading standard .md files directly from your computer,
// wrapping the Markdown inside a JavaScript variable (`curriculumMarkdown`)
// allows it to load seamlessly without needing a local web server!

const curriculumMarkdown = `

# Foundations

## 1. What is Intelligence?
- Biological vs artificial: Exploring how human cognition differs from machine computation.
- Turing Test: Alan Turing's famous behavioral benchmark for assessing machine intelligence.
- Chinese Room argument: A philosophical thought experiment on whether machines can truly "understand" or just simulate.

## 2. History of AI
- Symbolic AI era: The early days focusing on logic, rules, and expert systems.
- AI winters: Periods of reduced funding and interest due to unmet expectations.
- Connectionist revival: The comeback of neural networks and biologically inspired models.
- Modern AI boom: The current era driven by big data, immense compute, and deep learning.

## 3. AI vs ML vs Deep Learning
- Definitions: Breaking down the core differences between the three nested fields.
- Relationships: How ML sits inside AI, and Deep Learning sits inside ML.
- When to use what: Practical guidelines for choosing the right approach for your problem.

## 4. Types of AI Systems
- Narrow AI: Systems designed to handle one specific task brilliantly.
- General AI (AGI): Hypothetical AI that can understand and learn any intellectual task a human can.
- Superintelligence: AI that vastly surpasses human cognitive capabilities.

## 5. AI Applications
- Computer vision: Enabling machines to interpret and analyze visual information.
- NLP: Teaching machines to understand, interpret, and generate human language.
- Robotics: Combining AI with physical hardware to interact with the real world.
- Recommendation systems: Algorithms that suggest content tailored to user preferences.
- Generative AI: Systems capable of creating new text, images, and media from scratch.

# Mathematics

## 1. Linear Algebra
- Vectors & matrices: The fundamental data structures for representing numbers in ML.
- Matrix multiplication: The core mathematical operation powering neural network layers.
- Dot products: Measuring the similarity and projection between two vectors.
- Eigenvalues: Understanding linear transformations and their core properties.

## 2. Calculus
- Derivatives: Measuring how a function changes as its input changes.
- Partial derivatives: Evaluating change in systems with multiple variables.
- Chain rule: The mathematical engine that makes backpropagation possible.
- Gradients: Vectors indicating the direction of steepest ascent or descent.

## 3. Probability
- Sample spaces: The set of all possible outcomes in an experiment.
- Probability rules: The basic laws governing how we combine and calculate odds.
- Conditional probability: Calculating the likelihood of an event given that another has occurred.
- Bayes theorem: A mathematical framework for updating our beliefs based on new evidence.

## 4. Statistics
- Distributions: How data points are spread out and clustered across different values.
- Mean & variance: Measuring the center and the spread of your datasets.
- Hypothesis testing: Statistical methods for proving or disproving assumptions about data.
- Confidence intervals: Estimating the range where a true population parameter likely falls.

## 5. Information Theory
- Entropy: Measuring the amount of uncertainty or surprise in a variable.
- Cross-entropy: Comparing two probability distributions to calculate loss.
- KL divergence: Quantifying exactly how much one distribution differs from another.
- Mutual information: Measuring how much knowing one variable tells you about another.

## 6. Optimization
- Cost functions: Mathematical representations of how "wrong" a model's predictions are.
- Convexity: Problem shapes that guarantee we can find the absolute best solution.
- Local vs global minima: The challenge of finding the best overall solution without getting stuck.
- Lagrange multipliers: Finding the maximum or minimum of a function subject to strict constraints.

# Data

## 1. What is Data?
- Structured vs unstructured: Tabular databases vs messy text, images, and audio.
- Data types: Categorical, numerical, time-series, and text data formats.

## 2. Data Collection
- Surveys & scraping: Gathering data manually or automatically from the web.
- Sensors & APIs: Pulling real-time information from hardware and software interfaces.
- Labeling: The human-in-the-loop process of annotating data for supervised learning.

## 3. Preprocessing
- Cleaning: Removing errors, duplicates, and inconsistencies from datasets.
- Missing values: Strategies for handling empty data points via imputation or dropping.
- Outlier detection: Identifying anomalous data points that could skew models.

## 4. Feature Engineering
- Feature selection: Picking the most impactful variables to train on.
- Extraction: Creating completely new features from existing raw data.
- Encoding: Converting categorical text into numbers that models can calculate.

## 5. Data Splitting
- Train/val/test: The golden rule of dividing data to properly train and evaluate models.
- K-fold CV: Rotating through data subsets to ensure robust performance metrics.
- Data leakage: The dangerous mistake of letting test information seep into training.

## 6. EDA
- Summary statistics: Quick numerical snapshots of a dataset's characteristics.
- Visualization: Graphing data to spot trends, patterns, and anomalies visually.
- Correlation: Measuring how strongly two different variables move together.

## 7. Data Imbalance
- Oversampling: Duplicating minority class examples to balance the dataset.
- SMOTE: Synthetically generating new minority examples instead of copying.
- Class weights: Forcing the model to pay more attention to rare, important examples.

# Core ML

## 1. Learning Paradigms
- Supervised: Training models with clear inputs and labeled answers.
- Unsupervised: Letting algorithms find hidden patterns in unlabeled data.
- Semi-supervised: Blending a small amount of labeled data with lots of unlabeled data.
- Reinforcement: Training agents via rewards and penalties in an environment.

## 2. ML Pipeline
- Problem framing: Translating a business objective into a solvable ML task.
- Data to model: The iterative cycle of prepping data and training algorithms.
- Evaluation: Rigorously testing models to ensure they meet performance goals.
- Deployment: Moving a trained model into a live production environment.

## 3. Bias vs Variance
- Underfitting: When a model is too simple to capture the data's underlying trend.
- Overfitting: When a model memorizes the training data but fails on unseen data.
- The tradeoff: Finding the sweet spot between a model that is too rigid and too flexible.

## 4. Regularization
- L1 Lasso: Shrinking less important feature weights down to absolute zero.
- L2 Ridge: Penalizing large weights to keep the model smooth and generalizable.
- Elastic Net: Combining the strengths of both L1 and L2 regularization methods.
- Dropout: Randomly turning off neurons during training to prevent over-reliance.

## 5. Loss Functions
- MSE & MAE: Standard metrics for measuring error in continuous regression tasks.
- Cross-entropy: The go-to loss function for categorical classification problems.
- Hinge loss: Maximizing the margin between classes, heavily utilized by SVMs.

## 6. Eval Metrics
- Accuracy: The basic percentage of overall correct predictions.
- Precision & recall: Balancing false positives against false negatives.
- F1: The harmonic mean bridging precision and recall into one robust metric.
- ROC-AUC: Evaluating a classifier's performance across all classification thresholds.

## 7. Hyperparameters
- Grid search: Exhaustively testing every possible combination of network settings.
- Random search: Sampling random combinations to find good settings faster.
- Bayesian optimization: Intelligently picking the next settings to test based on past results.

# Classic Algorithms

## 1. Linear Regression
- Simple & multiple: Predicting a continuous value from one or more inputs.
- OLS: Ordinary Least Squares, the mathematical method for fitting the best line.
- Gradient descent: Iteratively tweaking the line to minimize errors step-by-step.

## 2. Logistic Regression
- Sigmoid function: Squashing outputs between 0 and 1 for probability scores.
- Decision boundary: The invisible line separating different predicted classes.
- Multiclass: Extending binary classification to handle three or more categories.

## 3. Decision Trees
- Gini & entropy: Metrics used to figure out the best questions to split the data.
- Depth: Controlling how many questions the tree is allowed to ask.
- Pruning: Cutting back overgrown branches to prevent the tree from overfitting.

## 4. Ensemble Methods
- Random Forests: Building a democratic voting system out of many randomized decision trees.
- XGBoost: An extremely fast and powerful implementation of gradient boosting.
- AdaBoost: Iteratively training models that focus specifically on previous mistakes.
- Gradient Boosting: Building trees sequentially where each corrects the errors of the last.

## 5. SVMs
- Hyperplanes: The multi-dimensional surfaces used to slice and separate data.
- Margins: The safety buffer area between different classes.
- Kernels: Clever mathematical tricks to separate data that isn't linearly separable.

## 6. k-Nearest Neighbors
- Distance metrics: Calculating how far apart data points are.
- Choosing k: Deciding how many neighbors get a vote in the final prediction.
- Curse of dimensionality: Why distance-based algorithms struggle when you have too many features.

## 7. Clustering
- k-Means: Grouping data into 'k' distinct clusters around central points.
- DBSCAN: Finding clusters based on the density of data points in a region.
- Hierarchical: Building a tree-like hierarchy of nested data clusters.
- Silhouette score: Measuring how well-defined and separated your resulting clusters are.

## 8. Dimensionality Reduction
- PCA: Squashing data into fewer dimensions while preserving the most variance.
- t-SNE: A technique specifically designed for visualizing high-dimensional data in 2D or 3D.
- UMAP: A faster, modern alternative to t-SNE that better preserves global data structure.

# Neural Networks

## 1. Biological Neuron
- Brain inspiration: How biological synapses inspired the architecture of AI.
- Perceptron history: The 1950s invention that started the neural network revolution.

## 2. Artificial Neurons
- Weights & biases: The adjustable dials and knobs a network learns during training.
- ReLU, sigmoid, tanh, softmax: Activation functions that introduce non-linear learning capability.

## 3. Feedforward Networks
- Input, hidden, output layers: The basic architectural layers of a deep network.
- Forward pass: The journey of data flowing forward through the network to generate a prediction.

## 4. Backpropagation
- Chain rule: Applying calculus backward through the network layers.
- Computing gradients: Calculating exactly how much each weight contributed to the error.

## 5. Gradient Descent
- Batch SGD: Updating weights using the entire dataset at once.
- Mini-batch: Striking a balance by updating weights using small chunks of data.
- Momentum: Helping the algorithm push past small bumps in the loss landscape.
- Adam: A popular, adaptive optimizer that automatically adjusts its own learning rate.

## 6. Initialization
- Xavier: A technique to keep signals from exploding or vanishing in standard networks.
- He initialization: The preferred method for initializing networks using ReLU activations.

## 7. Batch Norm & Dropout
- Batch normalization: Standardizing inputs between layers to speed up and stabilize training.
- Dropout mechanics: Randomly turning off neurons to force the network to learn robust features.

# Deep Learning

## 1. CNNs
- Convolution & pooling: Scanning images for features and downsampling the results.
- Filters: Small grids that learn to detect edges, shapes, and complex objects.
- ResNet, VGG: Famous, foundational CNN architectures that pushed the field forward.

## 2. RNNs
- Sequential data: Processing data where the order matters, like time series or text.
- Hidden states: The "memory" mechanism that gets passed from one time step to the next.
- Vanishing gradient: The critical flaw that prevents basic RNNs from remembering long sequences.

## 3. LSTMs & GRUs
- Long-term dependencies: Advanced architectures designed to remember things across long gaps.
- Gating mechanisms: Internal valves that learn what information to keep and what to forget.

## 4. Autoencoders
- Encoder-decoder: Networks that compress data down and try to reconstruct it.
- Latent space: The compressed, lower-dimensional representation of the original data.

## 5. GANs
- Generator: The network tasked with creating fake data that looks perfectly real.
- Discriminator: The network acting as a detective, trying to spot the fakes.
- Training dynamics: The adversarial cat-and-mouse game that pushes both models to improve.

## 6. Attention
- Query, key, value: The mechanism that lets models weigh the importance of different inputs.
- Attention intuition: Why letting models focus on specific parts of context was a massive breakthrough.

## 7. Transformers
- Self-attention: Letting sequence elements look at each other to understand context.
- Multi-head attention: Running several attention mechanisms in parallel to capture different patterns.
- Positional encoding: Giving Transformers a sense of order without processing things sequentially.

## 8. Transfer Learning
- Pre-trained models: Leveraging massive models that have already learned general features.
- Fine-tuning: Gently tweaking a pre-trained model to excel at your specific task.
- Feature extraction: Using a model as a fixed feature detector without updating its core weights.

# Modern AI

## 1. LLMs
- Scale & emergence: How simply making models massive unlocked unexpected reasoning capabilities.
- GPT family: The foundational models from OpenAI that sparked the generative AI boom.
- BERT: Google's breakthrough model for deeply understanding the context of words.
- LLaMA: Meta's open-weight models that democratized large language model research.

## 2. Tokenization
- Tokens vs words: Why models process text in sub-word chunks rather than full words.
- Byte-pair encoding: The algorithmic process used to create efficient, compressed vocabularies.
- Vocabulary: The fixed dictionary of tokens a specific language model understands.

## 3. Embeddings
- Word2Vec: Early methods for mapping words to dense math vectors based on context.
- GloVe: Global vectors capturing semantic relationships across an entire corpus.
- Contextual embeddings: Advanced vectors that change meaning based on the surrounding sentence.

## 4. Fine-tuning
- Self-supervised pre-training: Training on vast unlabelled data by predicting hidden text.
- Task fine-tuning: Adapting a base model to perform specific formats, like Q&A or summarization.
- RLHF: Reinforcement Learning from Human Feedback, the secret sauce for safe and helpful chat models.

## 5. Prompt Engineering
- Zero-shot: Asking a model to perform a task without giving it any examples.
- Few-shot: Providing a handful of high-quality examples to guide the model's output.
- Chain-of-thought: Forcing the model to explain its reasoning step-by-step for better accuracy.

## 6. RAG
- Vector databases: Specialized storage systems designed for incredibly fast similarity search.
- Semantic search: Finding documents based on their underlying meaning, not just exact keywords.
- Grounding: Forcing language models to base their answers on retrieved, factual documents.

## 7. PEFT
- LoRA: Low-Rank Adaptation, a lightweight technique for fine-tuning massive models efficiently.
- QLoRA: Combining quantization with LoRA to train LLMs on standard consumer GPUs.
- Adapters: Tiny neural network layers slotted into frozen pre-trained models.

## 8. AI Agents
- Tool use: Teaching models how to trigger APIs, run code, and search the web.
- Planning: Empowering models to break complex goals down into sequential steps.
- Memory: Giving agents the ability to remember past interactions and context.
- Multi-agent: Designing systems where different specialized AI personas collaborate.

# ML Engineering

## 1. Frameworks
- PyTorch: Meta's dynamic, researcher-friendly deep learning framework.
- TensorFlow: Google's robust, production-ready machine learning ecosystem.
- scikit-learn: The industry standard library for classic machine learning algorithms.
- HuggingFace: The central hub and toolkit for downloading and utilizing open-source models.

## 2. Experiment Tracking
- MLflow: An open-source platform to log metrics, artifacts, and model versions.
- Weights & Biases: A collaborative developer tool for tracking deep learning experiments visually.
- Versioning: Treating your datasets and models like code with strict version control.

## 3. Deployment
- REST APIs: Standard web interfaces used to serve model predictions over the internet.
- FastAPI: A modern, high-performance web framework perfectly suited for serving AI.
- Docker: Containerizing your models and dependencies to ensure they run identically everywhere.
- Cloud platforms: Deploying scalable AI solutions via AWS, GCP, or Azure services.

## 4. MLOps
- CI/CD for ML: Automating the testing and deployment pipelines specifically for ML models.
- Model monitoring: Watching live models for performance degradation or errors.
- Data drift: Detecting when real-world incoming data changes significantly from the training data.
- Retraining: Establishing automated triggers to refresh models when performance slips.

## 5. Scalability
- GPUs & TPUs: Specialized hardware accelerators designed for parallel mathematical operations.
- Distributed training: Splitting massive model training workloads across hundreds of chips.
- Quantization: Shrinking model precision to make them faster and cheaper to run.

# Ethics & Safety

## 1. Bias in AI
- Sources of bias: How human prejudices and historical data flaws infect machine learning models.
- Representation: Ensuring datasets reflect the diverse reality of the populations they serve.
- Mitigation: Techniques for measuring and reducing discriminatory behavior in algorithms.

## 2. Fairness
- Definitions: The mathematical and philosophical challenges of defining what "fair" actually means.
- Fairness tradeoffs: Why making a model fairer for one group can sometimes reduce overall accuracy.
- Case studies: Real-world examples of AI systems failing spectacularly due to lack of fairness.

## 3. Explainability
- SHAP: A game-theoretic approach explaining exactly how much each feature contributed to a prediction.
- LIME: Approximating complex models locally to understand specific, individual predictions.
- Model cards: Standardized documentation detailing a model's performance characteristics and limitations.

## 4. Privacy
- Differential privacy: Adding statistical noise to datasets to protect individual identities.
- Federated learning: Training models on decentralized data without ever moving raw data centrally.
- Anonymization: The process (and pitfalls) of stripping identifying information from datasets.

## 5. AI Safety
- Alignment problem: The immense challenge of ensuring an AI's goals perfectly match human values.
- Reward hacking: When an AI finds unintended, harmful shortcuts to maximize its given reward.
- Goal misgeneralization: When an AI learns the right behavior in training but applies it wrongly in reality.

## 6. Regulation
- EU AI Act: The world's first comprehensive legal framework categorizing AI systems by risk.
- Responsible disclosure: The ethical process of reporting AI vulnerabilities to creators before the public.
- AI auditing: Independent evaluations of AI systems to ensure compliance with ethical and legal standards.

`;
