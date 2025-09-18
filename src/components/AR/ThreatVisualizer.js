import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreatVisualizer = ({ threats = [], networkData = {} }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    // Check AR support
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => setArSupported(supported));
    }

    // Initialize 3D scene
    initializeScene();
    animate();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const initializeScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(800, 600);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create network visualization
    createNetworkVisualization(scene);
    
    // Create threat indicators
    createThreatIndicators(scene, threats);

    camera.position.z = 5;
    
    sceneRef.current = { scene, camera, renderer };
    rendererRef.current = renderer;
  };

  const createNetworkVisualization = (scene) => {
    // Central node (main system)
    const centralGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const centralMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const centralNode = new THREE.Mesh(centralGeometry, centralMaterial);
    scene.add(centralNode);

    // Network nodes
    const nodePositions = [
      [-2, 1, 0], [2, 1, 0], [-1, -1, 0], [1, -1, 0],
      [0, 2, 0], [-2, -1, 0], [2, -1, 0]
    ];

    nodePositions.forEach((pos, index) => {
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ 
        color: Math.random() > 0.7 ? 0xff0000 : 0x0088ff 
      });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(...pos);
      scene.add(node);

      // Connection lines
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...pos)];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });
  };

  const createThreatIndicators = (scene, threats) => {
    threats.forEach((threat, index) => {
      const geometry = new THREE.ConeGeometry(0.1, 0.3, 8);
      const material = new THREE.MeshBasicMaterial({ 
        color: threat.severity === 'high' ? 0xff0000 : 
               threat.severity === 'medium' ? 0xffaa00 : 0xffff00 
      });
      const indicator = new THREE.Mesh(geometry, material);
      
      const angle = (index / threats.length) * Math.PI * 2;
      indicator.position.set(
        Math.cos(angle) * 3,
        Math.sin(angle) * 3,
        0.5
      );
      
      scene.add(indicator);
    });
  };

  const animate = () => {
    requestAnimationFrame(animate);
    
    if (sceneRef.current) {
      // Rotate the entire scene slowly
      sceneRef.current.scene.rotation.y += 0.005;
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    }
  };

  const startAR = async () => {
    if (!arSupported) {
      alert('AR not supported on this device');
      return;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar');
      // AR session handling would go here
      console.log('AR session started');
    } catch (error) {
      console.error('AR session failed:', error);
    }
  };

  return (
    <div className="threat-visualizer bg-black rounded-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900">
        <h3 className="text-white text-lg font-semibold mb-2">3D Threat Visualization</h3>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Threats: {threats.length} | Network Nodes: 8
          </div>
          {arSupported && (
            <button
              onClick={startAR}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Launch AR View
            </button>
          )}
        </div>
      </div>
      
      <div ref={mountRef} className="flex justify-center items-center bg-gray-900" />
      
      <div className="p-4 bg-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-green-400 text-xl font-bold">
              {threats.filter(t => t.severity === 'low').length}
            </div>
            <div className="text-xs text-gray-400">Low Risk</div>
          </div>
          <div>
            <div className="text-yellow-400 text-xl font-bold">
              {threats.filter(t => t.severity === 'medium').length}
            </div>
            <div className="text-xs text-gray-400">Medium Risk</div>
          </div>
          <div>
            <div className="text-red-400 text-xl font-bold">
              {threats.filter(t => t.severity === 'high').length}
            </div>
            <div className="text-xs text-gray-400">High Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatVisualizer;
