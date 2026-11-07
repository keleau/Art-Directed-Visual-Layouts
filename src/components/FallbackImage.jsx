import { PLACEHOLDER_IMG } from '../data'

export function FallbackImage({ src, alt, className = '', loading, ...rest }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      {...rest}
      onError={(event) => {
        const img = event.currentTarget
        if (img.dataset.fallback) return
        img.dataset.fallback = '1'
        img.src = PLACEHOLDER_IMG
      }}
    />
  )
}
