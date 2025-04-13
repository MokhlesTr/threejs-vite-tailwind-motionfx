import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const codeSnippets = [
  "async function processInput(userQuery) {\n  const embeddingVector = await embedText(userQuery);\n  const context = await retrieveFromKnowledgeBase(embeddingVector);\n  return generateResponse(context, userQuery);\n}",
  "class AttentionMechanism {\n  constructor(dimensions) {\n    this.queryMatrix = initializeWeights(dimensions);\n    this.keyMatrix = initializeWeights(dimensions);\n    this.valueMatrix = initializeWeights(dimensions);\n  }\n\n  forward(input) {\n    // Multi-head attention calculation\n    const attention = softmax(matrixMultiply(input, this.queryMatrix));\n    return attention;\n  }\n}",
  "function transformerLayer(input, params) {\n  // Self-attention mechanism\n  const attentionOutput = multiHeadAttention(input);\n  const normalized = layerNorm(input + attentionOutput);\n  \n  // Feed-forward network\n  const ffnOutput = feedForward(normalized);\n  return layerNorm(normalized + ffnOutput);\n}",
  'const model = await tf.loadLayersModel("https://ai-models/gpt-nano.json");\nconst tokenizedInput = tokenizer.encode(text);\nconst predictions = model.predict(tokenizedInput);\nreturn decodeOutput(predictions);',
  "def train_diffusion_model(dataset, epochs=100):\n    model = UNet(channels=128, attention_levels=[2,4,8])\n    optimizer = Adam(lr=1e-4)\n    \n    for epoch in range(epochs):\n        for batch in dataset:\n            noise = add_noise(batch, noise_schedule)\n            loss = model(batch, noise)\n            loss.backward()\n            optimizer.step()",
];

const commands = [
  "Loading sentiment analysis module...",
  "Initializing context window...",
  "Calibrating embedding vectors...",
  "Processing knowledge graph...",
  "Training attention heads...",
  "Optimizing transformer weights...",
  "Analyzing text patterns...",
  "Computing token probabilities...",
  "Retrieving from context window...",
  "Executing reasoning pipeline...",
  "Generating coherent response...",
  "Validating output tokens...",
];

// Terminal theme colors
const colors = {
  background: "#0b1021",
  text: "#a9b8d5",
  promptSymbol: "#64ffda",
  command: "#82aaff",
  success: "#7ce3b1",
  error: "#ff5370",
  highlight: "#c792ea",
};

const AITerminal = ({ className = "", height = 400 }) => {
  const [lines, setLines] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLine, setCurrentLine] = useState("");
  const [showingCode, setShowingCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [progress, setProgress] = useState(0);
  const terminalRef = useRef(null);

  // Simulate terminal activity
  useEffect(() => {
    const simulateTerminal = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      while (true) {
        setLines([]);
        setProgress(0);

        await addLineWithTypingEffect("> whoami", colors.success, 30);
        await addLineWithTypingEffect(
          "I'm a Software Engineering student ",
          colors.text,
          40
        );

        await addLineWithTypingEffect(
          '> echo "Passion & Skills"',
          colors.command,
          30
        );
        await addLineWithTypingEffect(
          "Full Stack JavaScript Developer",
          colors.text,
          30
        );
        await addLineWithTypingEffect(
          "Specialized in building scalable web & mobile apps",
          colors.text,
          30
        );

        await addLineWithTypingEffect(
          "> tech-stack --list",
          colors.command,
          30
        );
        await addLine(
          "✔ React · Node.js · React Native · Express · MongoDB · TypeScript",
          colors.success
        );
        await addLine(
          "✔ REST APIs · Expo · Redux · Tailwind · Recharts",
          colors.success
        );
        await addLine("", "");

        await addLineWithTypingEffect("> mission", colors.command, 30);
        await addLineWithTypingEffect(
          "Deliver clean, maintainable code and bring ideas to life 💡",
          colors.text,
          30
        );

        await addLineWithTypingEffect(
          "> collab --cross-functional",
          colors.command,
          30
        );
        await addLine(
          "✔ Collaborates seamlessly with designers, devs and stakeholders",
          colors.success
        );
        await addLine("", "");

        await addLineWithTypingEffect("> status", colors.command, 30);
        await addLineWithTypingEffect(
          "Always learning. Always building. Always leveling up.",
          colors.text,
          30
        );
        await addLineWithTypingEffect(
          "hmm ok let's clear :')",
          colors.error,
          30
        );

        setProgress(1);

        const snippetIndex = Math.floor(Math.random() * codeSnippets.length);
        setCodeSnippet(codeSnippets[snippetIndex]);
        setShowingCode(true);

        await new Promise((resolve) => setTimeout(resolve, 6000));
        setShowingCode(false);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    };

    simulateTerminal();
  }, []);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines, currentLine, showingCode]);

  // Function to add a line with a typing effect
  const addLineWithTypingEffect = async (text, color, speed = 50) => {
    setIsTyping(true);
    setCurrentLine("");

    for (let i = 0; i < text.length; i++) {
      setCurrentLine((prev) => prev + text[i]);
      // Random typing speed variation
      await new Promise((resolve) =>
        setTimeout(resolve, speed * (0.5 + Math.random() * 0.8))
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    setIsTyping(false);
    setLines((prev) => [...prev, { text, color }]);
    setCurrentLine("");
  };

  // Function to add a line instantly
  const addLine = async (text, color) => {
    setLines((prev) => [...prev, { text, color }]);
    await new Promise((resolve) => setTimeout(resolve, 200));
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div
        className="relative w-full h-full rounded-lg overflow-hidden"
        style={{
          transform: "perspective(1000px) rotateX(10deg)",
          transformOrigin: "center center",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Terminal header */}
        <div className="h-8 flex items-center px-4 bg-gray-800">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-400 text-sm font-mono">
            welcome to my world terminal
          </div>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="w-full h-[calc(100%-32px)] overflow-y-auto p-4 font-mono text-sm"
          style={{ backgroundColor: colors.background, color: colors.text }}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              style={{ color: line.color }}
              className="whitespace-pre-wrap"
            >
              {line.text}
            </div>
          ))}

          {isTyping && (
            <div
              style={{
                color: currentLine.startsWith("$")
                  ? colors.command
                  : colors.text,
              }}
            >
              {currentLine}
              <span className="animate-pulse">▌</span>
            </div>
          )}

          {showingCode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 rounded-md"
              style={{ backgroundColor: "rgba(20, 30, 60, 0.7)" }}
            >
              <pre className="text-xs overflow-x-auto whitespace-pre">
                <code className="text-blue-300">{codeSnippet}</code>
              </pre>
            </motion.div>
          )}
        </div>

        {/* Progress bar at the bottom */}
        <div
          className="absolute bottom-0 left-0 h-1"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: "#64ffda",
            boxShadow: "0 0 10px rgba(100, 255, 218, 0.7)",
            transition: "width 0.5s ease-out",
          }}
        />

        {/* Reflection effect */}
        <div
          className="absolute bottom-0 left-0 w-full h-full opacity-70"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0, 30, 60, 0.15) 85%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default AITerminal;
