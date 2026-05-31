import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
}
export default function Particles({ count = 5000 }: ParticlesProps) {
  const points = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  const posArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const { clock } = state;
    const elapsedTime = clock.getElapsedTime();

    if (points.current) {
      const autoRotation = elapsedTime * 0.1;
      points.current.rotation.x = -mouse.y * (elapsedTime * 0.008);
      points.current.rotation.y = autoRotation + (mouse.x * 0.01);
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={posArray}
          itemSize={3}
          args={[posArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.001}
        color="#a4b3d6"
        transparent={true}
        blending={THREE.AdditiveBlending}
        opacity={0.5}
      />
    </points>
  );
}