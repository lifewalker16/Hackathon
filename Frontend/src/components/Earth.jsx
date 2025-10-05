import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Earth(props) {
  const { nodes, materials } = useGLTF('/Earth.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_4.geometry} material={materials['Scene_-_Root']} scale={1.128} />
    </group>
  )
}

useGLTF.preload('/Earth.gltf')
