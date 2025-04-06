import { useEffect, useRef, useState, useCallback } from 'react';

const NeuralNetwork = ({ layers = [6, 8, 12, 8, 4], width = 600, height = 400, active = true }) => {
  const canvasRef = useRef(null);
  const [animationId, setAnimationId] = useState(null);
  const [neurons, setNeurons] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activations, setActivations] = useState([]);
  const lastFrameTimeRef = useRef(0);
  const isVisibleRef = useRef(false);
  
  // Initialize the neural network - memoized with useCallback
  const initializeNetwork = useCallback(() => {
    if (!canvasRef.current) return;
    
    // Calculate neuron positions based on layers
    const neuronPositions = [];
    const connectionList = [];
    const activationsList = [];
    
    // Calculate horizontal spacing
    const layerSpacing = width / (layers.length + 1);
    
    // Create neurons for each layer
    layers.forEach((numNeurons, layerIndex) => {
      const verticalSpacing = height / (numNeurons + 1);
      
      // Add neurons for this layer
      for (let i = 0; i < numNeurons; i++) {
        const neuron = {
          x: layerSpacing * (layerIndex + 1),
          y: verticalSpacing * (i + 1),
          radius: 4 + Math.random() * 2, // Slightly smaller radius
          layer: layerIndex,
          id: neuronPositions.length
        };
        
        neuronPositions.push(neuron);
        
        // Create connections to previous layer
        if (layerIndex > 0) {
          const prevLayerStartIndex = neuronPositions.findIndex(n => n.layer === layerIndex - 1);
          const prevLayerCount = layers[layerIndex - 1];
          
          // Limit connections for better performance
          const connectionCount = Math.min(prevLayerCount, 5); // Limit to max 5 connections per neuron
          const connectionIndices = [];
          
          // Select random nodes to connect to
          while (connectionIndices.length < connectionCount) {
            const randomIndex = Math.floor(Math.random() * prevLayerCount);
            if (!connectionIndices.includes(randomIndex)) {
              connectionIndices.push(randomIndex);
            }
          }
          
          // Create the connections
          connectionIndices.forEach(j => {
            const prevNeuronIndex = prevLayerStartIndex + j;
            connectionList.push({
              from: prevNeuronIndex,
              to: neuronPositions.length - 1,
              strength: Math.random(),
              active: false,
              progress: 0
            });
          });
        }
      }
    });
    
    // Create initial activations (fewer)
    for (let i = 0; i < Math.min(3, layers[0]); i++) {
      activationsList.push({
        neuronId: i,
        value: Math.random(),
        decay: 0.95 + Math.random() * 0.04
      });
    }
    
    setNeurons(neuronPositions);
    setConnections(connectionList);
    setActivations(activationsList);
  }, [layers, width, height]);
  
  // Intersection Observer to only animate when visible
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    observer.observe(canvasRef.current);
    
    return () => {
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
    };
  }, []);
  
  // Initialize network
  useEffect(() => {
    initializeNetwork();
  }, [initializeNetwork]);
  
  // Animation loop with frame limiting
  useEffect(() => {
    if (!canvasRef.current || !active || neurons.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = (timestamp) => {
      // Skip frame if not visible
      if (!isVisibleRef.current) {
        setAnimationId(requestAnimationFrame(draw));
        return;
      }
      
      // Limit to 30fps for better performance
      if (timestamp - lastFrameTimeRef.current < 33) { // ~30fps
        setAnimationId(requestAnimationFrame(draw));
        return;
      }
      
      lastFrameTimeRef.current = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update connections and activations
      setConnections(prevConnections => {
        return prevConnections.map(conn => {
          // If connection is active, update progress
          if (conn.active) {
            const newProgress = conn.progress + 0.05; // Fixed increment for consistency
            
            // If connection completed, activate the target neuron
            if (newProgress >= 1) {
              setActivations(prevActivations => {
                // Limit total activations for performance
                if (prevActivations.length > 20) {
                  const filtered = prevActivations
                    .filter(a => a.value > 0.2) // Keep only more active ones
                    .slice(0, 15); // Hard limit
                  
                  return [
                    ...filtered,
                    {
                      neuronId: conn.to,
                      value: 0.8 + Math.random() * 0.2,
                      decay: 0.95 + Math.random() * 0.03
                    }
                  ];
                }
                
                return [
                  ...prevActivations,
                  {
                    neuronId: conn.to,
                    value: 0.8 + Math.random() * 0.2,
                    decay: 0.95 + Math.random() * 0.03
                  }
                ];
              });
              
              return { ...conn, active: false, progress: 0 };
            }
            
            return { ...conn, progress: newProgress };
          }
          
          return conn;
        });
      });
      
      // Update and decay activations less frequently
      setActivations(prevActivations => {
        const updatedActivations = prevActivations
          .map(activation => ({
            ...activation,
            value: activation.value * activation.decay
          }))
          .filter(activation => activation.value > 0.1); // Increased threshold
        
        // Randomly activate connections from active neurons (less frequently)
        if (Math.random() < 0.7) { // Only update 70% of the time
          setConnections(prevConnections => {
            return prevConnections.map(conn => {
              const sourceNeuron = neurons[conn.from];
              const sourceActivation = updatedActivations.find(a => a.neuronId === sourceNeuron.id);
              
              // If source neuron is active and connection is not already active, activate with probability
              if (sourceActivation && !conn.active && Math.random() < 0.02 * sourceActivation.value) {
                return { ...conn, active: true, progress: 0 };
              }
              
              return conn;
            });
          });
        }
        
        // Randomly add new activations to input layer (less frequently)
        if (Math.random() < 0.01 && updatedActivations.length < 15) {
          const inputLayerNeurons = neurons.filter(n => n.layer === 0);
          const randomNeuronIndex = Math.floor(Math.random() * inputLayerNeurons.length);
          
          return [
            ...updatedActivations,
            {
              neuronId: inputLayerNeurons[randomNeuronIndex].id,
              value: 0.7 + Math.random() * 0.3,
              decay: 0.94 + Math.random() * 0.04
            }
          ];
        }
        
        return updatedActivations;
      });
      
      // Draw connections more efficiently
      const activeConnections = connections.filter(conn => conn.active);
      const inactiveConnections = connections.filter(conn => !conn.active);
      
      // Draw inactive connections in batches
      ctx.beginPath();
      ctx.strokeStyle = `rgba(50, 50, 200, 0.03)`;
      ctx.lineWidth = 0.5;
      
      inactiveConnections.forEach(conn => {
        const fromNeuron = neurons[conn.from];
        const toNeuron = neurons[conn.to];
        
        ctx.moveTo(fromNeuron.x, fromNeuron.y);
        ctx.lineTo(toNeuron.x, toNeuron.y);
      });
      ctx.stroke();
      
      // Draw active connections individually
      activeConnections.forEach(conn => {
        const fromNeuron = neurons[conn.from];
        const toNeuron = neurons[conn.to];
        
        const startX = fromNeuron.x;
        const startY = fromNeuron.y;
        const endX = toNeuron.x;
        const endY = toNeuron.y;
        
        // Calculate signal position using progress
        const signalX = startX + (endX - startX) * conn.progress;
        const signalY = startY + (endY - startY) * conn.progress;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(100, 100, 255, ${0.1 + conn.strength * 0.2})`;
        ctx.lineWidth = 0.5 + conn.strength;
        ctx.stroke();
        
        // Draw signal
        ctx.beginPath();
        ctx.arc(signalX, signalY, 2 + conn.strength * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${0.7 + conn.progress * 0.3})`;
        ctx.fill();
      });
      
      // Draw neurons - batch inactive ones
      ctx.beginPath();
      ctx.fillStyle = `rgba(50, 50, 150, 0.2)`;
      
      neurons.forEach(neuron => {
        const activation = activations.find(a => a.neuronId === neuron.id);
        const isActive = activation !== undefined;
        
        if (!isActive) {
          ctx.moveTo(neuron.x + neuron.radius, neuron.y);
          ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
        }
      });
      ctx.fill();
      
      // Draw active neurons individually
      neurons.forEach(neuron => {
        const activation = activations.find(a => a.neuronId === neuron.id);
        const isActive = activation !== undefined;
        
        if (isActive) {
          // Active neuron
          const intensity = activation.value;
          
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, ${100 + intensity * 155}, 255, ${0.4 + intensity * 0.6})`;
          
          // Add glow effect for active neurons (simpler)
          if (intensity > 0.5) { // Only add glow for highly active neurons
            ctx.shadowColor = `rgba(100, 200, 255, ${intensity * 0.5})`;
            ctx.shadowBlur = 8 * intensity;
          }
          
          ctx.fill();
          ctx.shadowBlur = 0;  // Reset shadow
        }
      });
      
      const id = requestAnimationFrame(draw);
      setAnimationId(id);
    };
    
    const id = requestAnimationFrame(draw);
    setAnimationId(id);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [neurons, active]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      className="w-full h-full"
    />
  );
};

export default NeuralNetwork; 