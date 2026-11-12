import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { sceneColors } from './config'
import { getScroll } from '@/lib/scroll'
import dayMap from '@/assets/earth/earth_atmos.webp'
import normalMap from '@/assets/earth/earth_normal.webp'
import specularMap from '@/assets/earth/earth_specular.webp'
import cloudsMap from '@/assets/earth/earth_clouds.webp'

interface Props {
  reducedMotion: boolean
}

const RADIUS = 1.4
/** Lomé (Togo) — lat 6.13° N, lon 1.22° E */
const LOME = { lat: 6.13, lon: 1.22 }

/** Placement du globe pour chaque section (même ordre que SECTIONS). */
const KEYS: { pos: [number, number, number]; scale: number }[] = [
  { pos: [2.9, 0.1, -1.2], scale: 0.95 }, // hero — à droite du titre
  { pos: [0.4, -2.9, -4.2], scale: 0.62 }, // about — sous les colonnes, à l'écart du texte
  { pos: [0, 1.6, -9], scale: 0.7 }, // projects — au fond de l'allée
  { pos: [1.8, 1.4, -7], scale: 0.9 }, // skills
  { pos: [3.4, 0.2, -2.5], scale: 0.85 }, // journey
  { pos: [0.2, -2.1, -0.5], scale: 1.2 }, // contact — la Terre se lève sous le formulaire
]

/** Point de la sphère (mapping UV de SphereGeometry) pour une latitude/longitude. */
function latLonToVec(lat: number, lon: number, r: number) {
  const phi = THREE.MathUtils.degToRad(lon + 180)
  const theta = THREE.MathUtils.degToRad(90 - lat)
  return new THREE.Vector3(
    -r * Math.cos(phi) * Math.sin(theta),
    r * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

const LOME_POS = latLonToVec(LOME.lat, LOME.lon, RADIUS)
/** angle (autour de Y) du point Lomé, mesuré depuis +Z vers +X */
const LOME_ANGLE = Math.atan2(LOME_POS.x, LOME_POS.z)

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

/** halo extérieur (sphère retournée) */
const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // face arrière : on retourne la normale -> fort près de la Terre, nul sur le bord du halo
    float i = pow(clamp(dot(-vNormal, vView), 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor, i * 0.9);
  }
`

/** voile atmosphérique sur le bord du disque */
const rimFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.2);
    gl_FragColor = vec4(uColor, f * 0.6);
  }
`

const tmp = new THREE.Vector3()
const a = new THREE.Vector3()
const b = new THREE.Vector3()
const worldPos = new THREE.Vector3()

/**
 * Globe terrestre : relief, océans brillants, nuages, atmosphère teintée par le thème.
 * Il voyage d'une section à l'autre, tourne avec le scroll, et se tourne
 * vers Lomé dans les sections Accueil et Contact.
 */
export function Globe({ reducedMotion }: Props) {
  const root = useRef<THREE.Group>(null)
  const spinner = useRef<THREE.Group>(null)
  const clouds = useRef<THREE.Mesh>(null)
  const rings = useRef<THREE.Group>(null)
  const pulse = useRef<THREE.Mesh>(null)
  const satellite = useRef<THREE.Group>(null)
  const anim = useRef({ section: 0, drift: 0, clouds: 0 })

  const [day, normal, specular, cloud] = useTexture([dayMap, normalMap, specularMap, cloudsMap])
  useMemo(() => {
    day.colorSpace = THREE.SRGBColorSpace
    ;[day, normal, specular, cloud].forEach((t) => (t.anisotropy = 8))
  }, [day, normal, specular, cloud])

  const atmoColor = sceneColors.isLight ? sceneColors.accent : sceneColors.light
  const glowUniforms = useMemo(
    () => ({ uColor: { value: atmoColor.clone() }, uPower: { value: 2.4 } }),
    [atmoColor],
  )
  const rimUniforms = useMemo(() => ({ uColor: { value: atmoColor.clone() } }), [atmoColor])

  // orientation du repère de Lomé (normal à la surface)
  const markerQuat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), LOME_POS.clone().normalize()),
    [],
  )

  useFrame((state, delta) => {
    if (!root.current || !spinner.current) return
    const d = Math.min(delta, 1 / 30)
    const t = state.clock.elapsedTime
    const sc = getScroll()
    const s = anim.current

    // déplacement entre les positions-clés
    s.section = THREE.MathUtils.damp(s.section, sc.section, 4, d)
    const last = KEYS.length - 1
    const seg = THREE.MathUtils.clamp(s.section, 0, last)
    const i = Math.min(Math.floor(seg), last - 1)
    const f = THREE.MathUtils.smoothstep(seg - i, 0, 1)
    a.fromArray(KEYS[i].pos)
    b.fromArray(KEYS[i + 1].pos)
    tmp.lerpVectors(a, b, f)
    root.current.position.copy(tmp)
    const keyScale = THREE.MathUtils.lerp(KEYS[i].scale, KEYS[i + 1].scale, f)
    root.current.scale.setScalar(keyScale)

    // Rotation : face à Lomé en Accueil/Contact, rotation libre entre les deux.
    root.current.getWorldPosition(worldPos)
    const toCam = Math.atan2(state.camera.position.x - worldPos.x, state.camera.position.z - worldPos.z)
    const face = toCam - LOME_ANGLE
    const focus = 1 - THREE.MathUtils.smoothstep(s.section, 0, 0.7) + THREE.MathUtils.smoothstep(s.section, last - 0.7, last)
    if (!reducedMotion) s.drift += d * 0.06
    const free = sc.progress * Math.PI * 2.4 + s.drift
    spinner.current.rotation.y = face + (1 - Math.min(focus, 1)) * free

    if (!reducedMotion) {
      s.clouds += d * (0.015 + Math.min(Math.abs(sc.velocity) * 0.002, 0.2))
      if (clouds.current) clouds.current.rotation.y = s.clouds

      // pulsation du repère Lomé
      if (pulse.current) {
        const p = (t * 0.6) % 1
        pulse.current.scale.setScalar(1 + p * 2.4)
        ;(pulse.current.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.9
      }

      // petit satellite en orbite
      if (satellite.current) satellite.current.rotation.y = t * 0.5 + sc.progress * Math.PI * 2
    }

    // anneaux orbitaux : ils s'inclinent et s'écartent avec le scroll
    if (rings.current) {
      rings.current.children.forEach((ring, k) => {
        const dir = k % 2 === 0 ? 1 : -1
        ring.rotation.x = Math.PI / 2 + sc.progress * Math.PI * (k + 1) * dir * 0.8
        ring.rotation.y = reducedMotion ? k * 0.6 : t * 0.1 * (k + 1) * dir + k * 0.6
        const m = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial
        m.opacity = THREE.MathUtils.damp(m.opacity, (1 - sc.local.projects * 0.9) * (0.45 - k * 0.1), 4, d)
      })
    }
  })

  return (
    <group ref={root} position={KEYS[0].pos}>
      <Float speed={reducedMotion ? 0 : 1} rotationIntensity={0.15} floatIntensity={0.4}>
        {/* axe de rotation incliné comme la vraie Terre */}
        <group rotation={[0, 0, THREE.MathUtils.degToRad(-23.4)]}>
          <group ref={spinner}>
            <mesh>
              <sphereGeometry args={[RADIUS, 96, 96]} />
              <meshPhongMaterial
                map={day}
                normalMap={normal}
                normalScale={new THREE.Vector2(0.9, 0.9)}
                specularMap={specular}
                specular={new THREE.Color('#5a7a99')}
                shininess={22}
              />
            </mesh>

            <mesh ref={clouds} scale={1.012}>
              <sphereGeometry args={[RADIUS, 72, 72]} />
              <meshPhongMaterial
                color="#ffffff"
                alphaMap={cloud}
                transparent
                opacity={0.85}
                depthWrite={false}
              />
            </mesh>

            {/* repère Lomé */}
            <group position={LOME_POS.clone().multiplyScalar(1.004)} quaternion={markerQuat}>
              <mesh>
                <circleGeometry args={[0.028, 20]} />
                <meshBasicMaterial color={sceneColors.accent} toneMapped={false} />
              </mesh>
              <mesh ref={pulse}>
                <ringGeometry args={[0.03, 0.045, 32]} />
                <meshBasicMaterial color={sceneColors.light} transparent depthWrite={false} toneMapped={false} />
              </mesh>
              <mesh position={[0, 0, 0.16]}>
                <cylinderGeometry args={[0.004, 0.004, 0.32, 6]} />
                <meshBasicMaterial color={sceneColors.accent} toneMapped={false} />
              </mesh>
            </group>
          </group>
        </group>

        {/* voile atmosphérique + halo */}
        <mesh scale={1.02}>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <shaderMaterial
            vertexShader={atmosphereVertex}
            fragmentShader={rimFragment}
            uniforms={rimUniforms}
            transparent
            depthWrite={false}
            blending={sceneColors.isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          />
        </mesh>
        <mesh scale={1.14}>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <shaderMaterial
            vertexShader={atmosphereVertex}
            fragmentShader={glowFragment}
            uniforms={glowUniforms}
            side={THREE.BackSide}
            transparent
            depthWrite={false}
            blending={sceneColors.isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          />
        </mesh>
      </Float>

      {/* orbites */}
      <group ref={rings}>
        {[2.25, 2.6, 3.0].map((r, k) => (
          <mesh key={r} rotation={[Math.PI / 2, k * 0.6, 0]}>
            <torusGeometry args={[r, 0.01 + k * 0.004, 8, 160]} />
            <meshBasicMaterial
              color={k === 1 ? sceneColors.light : sceneColors.accent}
              transparent
              opacity={0.35}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* satellite */}
      <group ref={satellite} rotation={[0.35, 0, 0.2]}>
        <mesh position={[2.6, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={sceneColors.light} toneMapped={false} />
        </mesh>
      </group>

      {/* soleil : éclaire la face visible, terminateur jour/nuit sur le côté */}
      <directionalLight position={[-4, 2.5, 6]} intensity={2.4} color="#fff6e8" />
    </group>
  )
}
