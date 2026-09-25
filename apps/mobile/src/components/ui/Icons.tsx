import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName = 'home' | 'play' | 'heart' | 'mail' | 'sparkle';

type Props = { name: IconName; color: string; size?: number; filled?: boolean };

const HEART =
  'M12 20.5s-7.5-4.8-7.5-10.4a4.1 4.1 0 0 1 7.5-2.3 4.1 4.1 0 0 1 7.5 2.3c0 5.6-7.5 10.4-7.5 10.4z';

/** Íconos dibujados a mano (trazo fino, esquinas redondeadas) para la barra de pestañas. */
export function Icon({ name, color, size = 24, filled = false }: Props) {
  const stroke = {
    stroke: color,
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  } as const;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {name === 'home' && (
        <Path
          d="M4 11l8-7 8 7v8.5a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"
          {...stroke}
          fill={filled ? color : 'none'}
        />
      )}
      {name === 'play' && (
        <>
          <Circle cx="12" cy="12" r="8.5" {...stroke} />
          <Path d="M10.3 8.6l5.4 3.4-5.4 3.4z" {...stroke} fill={color} />
        </>
      )}
      {name === 'heart' && <Path d={HEART} {...stroke} fill={filled ? color : 'none'} />}
      {name === 'mail' && (
        <>
          <Rect x="3.5" y="5.5" width="17" height="13" rx="2.5" {...stroke} />
          <Path d="M4 7.5l8 5.5 8-5.5" {...stroke} />
        </>
      )}
      {name === 'sparkle' && (
        <Path
          d="M12 3.5c.6 4.6 3.4 7.6 8.5 8.5-5.100.9-7.900 3.900-8.500 8.500-.6-4.600-3.400-7.600-8.500-8.500 5.100-.9 7.900-3.900 8.500-8.500z"
          {...stroke}
          fill={filled ? color : 'none'}
        />
      )}
    </Svg>
  );
}

/** Corazón sólido decorativo (mismo trazo que el ícono de la marca). */
export function HeartMark({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Path
        d="M32 51 C11 37 9 22 20 16 C26 12.5 31 15.5 32 20 C33 15.5 38 12.5 44 16 C55 22 53 37 32 51 Z"
        fill={color}
      />
    </Svg>
  );
}
