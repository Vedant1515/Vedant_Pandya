import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc?v=2",
          "MyCharacter12"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                const nameLower = mesh.name.toLowerCase();

                // Try to make the cap look like hair instead of hiding it, because hiding it removes the top of the skull
                // and makes the model look non-human.
                if (nameLower.includes("hat") || nameLower.includes("cap") || nameLower.includes("headwear")) {
                  const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color("#1E293B"); // Same as hair color
                  newMat.roughness = 0.5;
                  mesh.material = newMat;
                  
                  // Hide the brim of the cap (often a separate sub-mesh) if possible by shrinking it,
                  // or just let it blend in. We'll try to shrink CAP.001 if it's the brim.
                  if (mesh.name === "CAP.001") {
                    // Let's assume CAP.002 is the dome and CAP.001 is the brim.
                    // We can squash the brim to hide it.
                    mesh.scale.set(0.01, 0.01, 0.01);
                  }
                } else if (mesh.material && mesh.visible) {
                  // Attempting to match various parts to stylize them uniquely
                  if (mesh.name === "BODY.SHIRT" || nameLower.includes("shirt") || nameLower.includes("top")) {
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#4F46E5"); // Vibrant Indigo
                    newMat.roughness = 0.6;
                    newMat.metalness = 0.2;
                    mesh.material = newMat;
                  } else if (mesh.name === "Pant" || nameLower.includes("pant") || nameLower.includes("bottom")) {
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#111827"); // Slate / Dark gray
                    newMat.roughness = 0.8;
                    mesh.material = newMat;
                  } else if (nameLower.includes("shoe") || nameLower.includes("footwear")) {
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#F3F4F6"); // Off-white
                    mesh.material = newMat;
                  } else if (nameLower.includes("hair")) {
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#1E293B"); // Very dark, slick hair
                    newMat.roughness = 0.5;
                    mesh.material = newMat;
                  } else if (nameLower.includes("glass") || nameLower.includes("spectacle")) {
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#000000"); 
                    newMat.metalness = 0.9;
                    newMat.roughness = 0.1;
                    mesh.material = newMat;
                  }
                }

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                // Add a robust smile to the character if morph targets are available
                if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
                  for (const key in mesh.morphTargetDictionary) {
                    const k = key.toLowerCase();
                    // Include any ARKit/RPM blendshapes that make the character smile brightly
                    if (
                      k.includes("smile") || 
                      k.includes("mouthcornerpull") || 
                      k.includes("mouthsmileleft") || 
                      k.includes("mouthsmileright") ||
                      k.includes("cheekpuff") ||
                      k.includes("mouthdimple")
                    ) {
                      const index = mesh.morphTargetDictionary[key];
                      mesh.morphTargetInfluences[index] = 1.0;
                    }
                  }
                }
              }
            });
            
            let neck: THREE.Object3D | undefined;
            character.traverse((child) => {
              if ((child as THREE.Bone).isBone && (child.name === "spine.005" || child.name === "spine.006" || child.name === "Neck")) {
                if (!neck) neck = child; // grab the first valid neck/upper spine bone
              }
            });

            if (neck && !neck.getObjectByName("CustomScarf")) {
              const scarfGroup = new THREE.Group();
              scarfGroup.name = "CustomScarf";
              
              const scarfMat = new THREE.MeshStandardMaterial({ 
                color: "#27272a", // Dark Gray like the user image
                roughness: 0.9,
                metalness: 0.1,
                side: THREE.DoubleSide
              });
              
              // 1. The wrapped part around the neck (Torus)
              // Since the camera is at Y=13 and character foot is at Y=3.36, the scale is likely much larger than 1.
              // We'll scale the base base radius from 0.08 to a much larger relative size (approx 1.2 base).
              const scaleMult = 15.0; // Assuming 1 unit = 10cm or Model height ~ 18 units
              const scarfRadius = 0.08 * scaleMult;
              const scarfThickness = 0.035 * scaleMult;
              const neckRingGeo = new THREE.TorusGeometry(scarfRadius, scarfThickness, 16, 64);
              // Squish the torus slightly so it forms better to the neck
              neckRingGeo.scale(1, 1, 1.2);
              const neckRing = new THREE.Mesh(neckRingGeo, scarfMat);
              // Orient the torus to sit flat around the neck
              neckRing.rotation.x = Math.PI / 2;
              neckRing.rotation.y = -Math.PI / 20; // Slight tilt
              neckRing.position.set(0, 0.0 * scaleMult, 0.01 * scaleMult);
              neckRing.castShadow = true;
              neckRing.receiveShadow = true;
              scarfGroup.add(neckRing);

              // 2. Left hanging tail
              // Using a curved tube squashed flat to simulate cloth
              const leftCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.06 * scaleMult, 0.01 * scaleMult, 0.10 * scaleMult),   // top near neck
                new THREE.Vector3(-0.07 * scaleMult, -0.1 * scaleMult, 0.14 * scaleMult),   // over chest curve
                new THREE.Vector3(-0.07 * scaleMult, -0.25 * scaleMult, 0.12 * scaleMult),  // mid chest
                new THREE.Vector3(-0.06 * scaleMult, -0.4 * scaleMult, 0.09 * scaleMult),   // bottom dangling
              ]);
              const leftTailGeo = new THREE.TubeGeometry(leftCurve, 20, 0.035 * scaleMult, 12, false);
              leftTailGeo.scale(1.2, 1, 0.2); // flat like a scarf, wider
              const leftTail = new THREE.Mesh(leftTailGeo, scarfMat);
              leftTail.castShadow = true;
              leftTail.receiveShadow = true;
              scarfGroup.add(leftTail);

              // 3. Right hanging tail (slightly longer for natural asymmetry)
              const rightCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.06 * scaleMult, 0.01 * scaleMult, 0.10 * scaleMult),    // top near neck
                new THREE.Vector3(0.07 * scaleMult, -0.12 * scaleMult, 0.14 * scaleMult),   // over chest curve
                new THREE.Vector3(0.08 * scaleMult, -0.25 * scaleMult, 0.12 * scaleMult),   // mid chest
                new THREE.Vector3(0.08 * scaleMult, -0.45 * scaleMult, 0.08 * scaleMult),   // bottom dangling
              ]);
              const rightTailGeo = new THREE.TubeGeometry(rightCurve, 20, 0.035 * scaleMult, 12, false);
              rightTailGeo.scale(1.2, 1, 0.2); // flat like a scarf, wider
              const rightTail = new THREE.Mesh(rightTailGeo, scarfMat);
              rightTail.castShadow = true;
              rightTail.receiveShadow = true;
              scarfGroup.add(rightTail);
              
              neck.add(scarfGroup);
            }

            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;

            // Monitor scale is handled by GsapScroll.ts animations

            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
