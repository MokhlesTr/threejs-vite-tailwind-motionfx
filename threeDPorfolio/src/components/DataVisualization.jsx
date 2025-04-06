import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const generateRandomData = (length = 20, min = 10, max = 90) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

const DataVisualization = ({ className = '' }) => {
  const [data, setData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [confidenceData, setConfidenceData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0
  });
  const svgRef = useRef(null);
  
  // Initialize and update data
  useEffect(() => {
    // Initial data
    const initialData = generateRandomData(24, 10, 90);
    setData(initialData);
    
    // Generate predictions with some "error"
    const predictData = initialData.map(val => {
      const error = Math.random() * 20 - 10; // -10 to +10
      return Math.max(5, Math.min(95, Math.round(val + error)));
    });
    setPredictions(predictData);
    
    // Generate confidence scores
    setConfidenceData(initialData.map(() => 50 + Math.random() * 45));
    
    // Calculate metrics
    setMetrics({
      accuracy: 70 + Math.random() * 25,
      precision: 65 + Math.random() * 30,
      recall: 60 + Math.random() * 35,
      f1Score: 65 + Math.random() * 30
    });
    
    // Update data periodically
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        // Update a random subset of points
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * newData.length);
          // Smooth transition (don't change too drastically)
          const currentVal = newData[idx];
          const change = Math.random() * 20 - 10; // -10 to +10
          newData[idx] = Math.max(10, Math.min(90, Math.round(currentVal + change)));
        }
        return newData;
      });
      
      setPredictions(prevPredictions => {
        const newPreds = [...prevPredictions];
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * newPreds.length);
          const currentVal = newPreds[idx];
          const change = Math.random() * 15 - 7.5;
          newPreds[idx] = Math.max(5, Math.min(95, Math.round(currentVal + change)));
        }
        return newPreds;
      });
      
      // Update confidence values occasionally
      setConfidenceData(prevConfidence => {
        const newConfidence = [...prevConfidence];
        for (let i = 0; i < 3; i++) {
          const idx = Math.floor(Math.random() * newConfidence.length);
          // Confidence should generally increase over time
          const currentVal = newConfidence[idx];
          const change = Math.random() * 10 - 2; // Bias toward increase
          newConfidence[idx] = Math.max(50, Math.min(98, Math.round(currentVal + change)));
        }
        return newConfidence;
      });
      
      // Slowly improve metrics
      setMetrics(prevMetrics => ({
        accuracy: Math.min(99, prevMetrics.accuracy + (Math.random() * 0.5 - 0.1)),
        precision: Math.min(99, prevMetrics.precision + (Math.random() * 0.6 - 0.2)),
        recall: Math.min(99, prevMetrics.recall + (Math.random() * 0.5 - 0.1)),
        f1Score: Math.min(99, prevMetrics.f1Score + (Math.random() * 0.4 - 0.1))
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // SVG dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  
  // Calculate scaling
  const xScale = (width - padding * 2) / (data.length - 1);
  const yScale = (height - padding * 2) / 100;
  
  // Create line paths
  const createLinePath = (dataPoints) => {
    return dataPoints.map((point, i) => {
      const x = i * xScale + padding;
      const y = height - (point * yScale + padding);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  
  const actualLinePath = createLinePath(data);
  const predictionLinePath = createLinePath(predictions);
  
  // Event handlers
  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    
    // Calculate which data point is closest
    const dataPointWidth = (width - padding * 2) / (data.length - 1);
    const index = Math.round((mouseX - padding) / dataPointWidth);
    
    if (index >= 0 && index < data.length) {
      setActiveIndex(index);
    }
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  return (
    <div className={`bg-gray-900 rounded-lg shadow-xl overflow-hidden p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-200 mb-6">AI Prediction Performance</h3>
      
      {/* Main graph */}
      <div className="relative overflow-x-auto">
        <svg 
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = height - (i * 20 * yScale + padding);
            return (
              <g key={`grid-${i}`}>
                <line 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="rgba(100, 100, 150, 0.1)" 
                  strokeDasharray="4 4"
                />
                <text x={padding - 10} y={y + 5} textAnchor="end" fill="rgba(150, 150, 200, 0.8)" fontSize="12">
                  {i * 20}%
                </text>
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((_, i) => {
            if (i % 4 === 0 || i === data.length - 1) {
              const x = i * xScale + padding;
              return (
                <text 
                  key={`x-label-${i}`} 
                  x={x} 
                  y={height - padding + 20} 
                  textAnchor="middle" 
                  fill="rgba(150, 150, 200, 0.8)" 
                  fontSize="12"
                >
                  {i}
                </text>
              );
            }
            return null;
          })}
          
          {/* Confidence area */}
          <motion.path 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            d={`${createLinePath(data.map((val, i) => val + (100 - confidenceData[i]) / 2))} 
                L ${(data.length - 1) * xScale + padding} ${height - padding} 
                L ${padding} ${height - padding} Z`}
            fill="url(#confidenceGradient)"
          />
          
          {/* Lines */}
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
            d={actualLinePath}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
            d={predictionLinePath}
            fill="none"
            stroke="#f472b6"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          
          {/* Data points */}
          {data.map((point, i) => {
            const x = i * xScale + padding;
            const y = height - (point * yScale + padding);
            const predY = height - (predictions[i] * yScale + padding);
            
            const isActive = activeIndex === i;
            
            return (
              <g key={`point-${i}`}>
                <motion.circle 
                  cx={x} 
                  cy={y} 
                  r={isActive ? 5 : 3}
                  fill="#60a5fa"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.8, 
                    scale: isActive ? 1.2 : 1,
                    fill: isActive ? "#3b82f6" : "#60a5fa"
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.circle 
                  cx={x} 
                  cy={predY} 
                  r={isActive ? 5 : 3}
                  fill="#f472b6"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.7, 
                    scale: isActive ? 1.2 : 1,
                    fill: isActive ? "#db2777" : "#f472b6"
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {isActive && (
                  <>
                    <line 
                      x1={x} y1={y} x2={x} y2={predY}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeDasharray="3 2"
                    />
                    
                    <rect 
                      x={x + 10} 
                      y={Math.min(y, predY) - 55} 
                      width={110} 
                      height={100} 
                      rx={5}
                      fill="rgba(30, 41, 59, 0.9)"
                      stroke="rgba(100, 116, 139, 0.3)"
                    />
                    
                    <text x={x + 20} y={Math.min(y, predY) - 30} fill="#60a5fa" fontSize="14">Actual: {point}%</text>
                    <text x={x + 20} y={Math.min(y, predY) - 10} fill="#f472b6" fontSize="14">Predicted: {predictions[i]}%</text>
                    <text x={x + 20} y={Math.min(y, predY) + 10} fill="#a5b4fc" fontSize="14">Confidence: {confidenceData[i].toFixed(1)}%</text>
                    <text x={x + 20} y={Math.min(y, predY) + 30} fill="#cbd5e1" fontSize="14">Error: {Math.abs(point - predictions[i]).toFixed(1)}%</text>
                  </>
                )}
              </g>
            );
          })}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
          <span className="text-gray-300 text-sm">Actual Values</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-pink-400 rounded-full mr-2"></div>
          <span className="text-gray-300 text-sm">AI Predictions</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 opacity-30 rounded-full mr-2"></div>
          <span className="text-gray-300 text-sm">Confidence Range</span>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {[
          { label: 'Accuracy', value: metrics.accuracy, color: 'from-blue-500 to-indigo-600' },
          { label: 'Precision', value: metrics.precision, color: 'from-green-500 to-emerald-600' },
          { label: 'Recall', value: metrics.recall, color: 'from-purple-500 to-violet-600' },
          { label: 'F1 Score', value: metrics.f1Score, color: 'from-amber-500 to-orange-600' }
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-4 flex flex-col items-center"
          >
            <div className="text-gray-400 text-sm mb-2">{metric.label}</div>
            <div className="relative w-24 h-24 mb-2">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={`url(#${metric.label}Gradient)`}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(metric.value / 100) * 251.2} 251.2`}
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ strokeDasharray: `${(metric.value / 100) * 251.2} 251.2` }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                />
                <defs>
                  <linearGradient id={`${metric.label}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={`stop-${metric.color.split(' ')[0]}`} />
                    <stop offset="100%" className={`stop-${metric.color.split(' ')[2]}`} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="text-xl font-semibold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.2 }}
                >
                  {metric.value.toFixed(1)}%
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DataVisualization; 