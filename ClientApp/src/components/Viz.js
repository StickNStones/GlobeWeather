import React, { Component, Suspense } from 'react';

import { Canvas } from "@react-three/fiber";
import "./styles.css";
import { OrbitControls, useGLTF } from "@react-three/drei";

import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const Vizcanvas = {
        width: '100vw',
        height: '100vh',
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -9999,
        };

function Model(props) {
    const { scene } = useGLTF("/Stick.glb");
    return <primitive object={scene} />;
}

export default function Viz() {

        return (
            <Canvas pixelRatio={[1, 2]} camera={{ position: [0, 30, 30], fov: 1 }}>
                <ambientLight intensity={1} />
                <Suspense fallback={null}>
                    <Model />
                </Suspense>
                <OrbitControls />
            </Canvas>
        );
  
}
