import { render } from "@testing-library/react";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Mode3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x5b00ff)

    const loader = new THREE.TextureLoader();
    loader.load(
      "https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg",
      function (texture) {
        scene.background = texture;
      }
    );

    const camera = new THREE.PerspectiveCamera(25, width / height, 0.01, 1000);
    scene.add(camera);
    camera.position.z = 6;
    camera.position.x = 6;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x0f2c64 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.lookAt(cube.position);

    const ambientalLight = new THREE.PointLight(0x404040);
    scene.add(ambientalLight);

    const pointLight = new THREE.PointLight(0xff0000, 15);
    pointLight.position.set(8, 8, 8);
    scene.add(pointLight);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapseTime = clock.getElapsedTime();
      cube.rotation.y = elapseTime;
      cube.rotation.x = elapseTime;
      cube.position.y = Math.sin(elapseTime);

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const resize = () => {
      const updateWidth = currentRef.clientWidth;
      const updateHeight = currentRef.clientHeight;
      renderer.setSize(updateWidth, updateHeight);
      camera.aspect = updateWidth / updateHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    animate();
    renderer.render(scene, camera);

    return () => {
      currentRef.removeChild(renderer.domElement);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }}></div>;
};

export default Mode3D;
