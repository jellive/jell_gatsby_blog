'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

/**
 * FontAwesome Icon Wrapper Component
 *
 * A thin wrapper around FontAwesomeIcon for consistent icon usage throughout
 * the application
 *
 * @example
 * ```tsx
 * import { Fa } from '@/components/FontAwesome/Fa'
 * import { faHome } from '@fortawesome/free-solid-svg-icons'
 *
 * <Fa icon={faHome} />
 * <Fa icon={faHome} className="text-lg text-primary" />
 * ```
 */

interface FaProps {
  icon: IconDefinition
  className?: string
  size?:
    | 'xs'
    | 'sm'
    | 'lg'
    | 'xl'
    | '2x'
    | '3x'
    | '4x'
    | '5x'
    | '6x'
    | '7x'
    | '8x'
    | '9x'
    | '10x'
  fixedWidth?: boolean
  spin?: boolean
  pulse?: boolean
  rotation?: 90 | 180 | 270
  flip?: 'horizontal' | 'vertical' | 'both'
  title?: string
  'aria-label'?: string
}

export const Fa = ({
  icon,
  className,
  size,
  fixedWidth,
  spin,
  pulse,
  rotation,
  flip,
  title,
  'aria-label': ariaLabel,
}: FaProps) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      size={size}
      fixedWidth={fixedWidth}
      spin={spin}
      pulse={pulse}
      rotation={rotation}
      flip={flip}
      title={title}
      aria-label={ariaLabel}
    />
  )
}
