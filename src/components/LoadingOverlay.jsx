import { useAppSelector } from '../app/hooks'

function LoadingOverlay () {
  const { loading, error } = useAppSelector((state) => state.ui)

  return (
    <>
      {loading > 0 && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '0.85rem 1rem',
            borderRadius: 12,
            boxShadow: '0 10px 25px rgb(185 28 28 / 0.25)',
            zIndex: 1001
          }}
        >
          {error}
        </div>
      )}
    </>
  )
}

export default LoadingOverlay
