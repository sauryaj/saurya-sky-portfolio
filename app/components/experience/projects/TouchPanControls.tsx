import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

/**
 * Claude generated this. Very good code ngl.
 *
 * @returns
 */
export const TouchPanControls = () => {
  const { camera } = useThree()
  const touchStartRef = useRef({ x: 0, y: 0 })
  const cameraRotationRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  // Set initial camera and target rotation values
  useEffect(() => {
    cameraRotationRef.current = {
      x: camera.rotation.y,
      y: camera.rotation.x
    }
    targetRotationRef.current = {
      x: camera.rotation.y,
      y: camera.rotation.x
    }
  }, [camera])

  // Animation loop for smooth camera movement
  useFrame((_, delta) => {
    camera.rotation.y = THREE.MathUtils.damp(
      camera.rotation.y,
      targetRotationRef.current.x,
      7,
      delta
    )
    camera.rotation.x = THREE.MathUtils.damp(
      camera.rotation.x,
      targetRotationRef.current.y,
      7,
      delta
    )
  })

  // Handle touch events
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
        // Remember current rotation as starting point
        cameraRotationRef.current = {
          x: targetRotationRef.current.x,
          y: targetRotationRef.current.y
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return

      // Calculate touch movement delta
      const touchX = e.touches[0].clientX
      const deltaX = touchX - touchStartRef.current.x

      // Update target rotation with sensitivity adjustment
      const sensitivity = 0.005
      const newRotationY = cameraRotationRef.current.x + deltaX * sensitivity

      // Apply rotation limits to prevent over-rotation
      const maxRotation = Math.PI / 3
      targetRotationRef.current.x = Math.max(Math.min(newRotationY, maxRotation), -maxRotation)
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
      cameraRotationRef.current = {
        x: targetRotationRef.current.x,
        y: targetRotationRef.current.y
      }
    }

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [camera])

  return null
}
