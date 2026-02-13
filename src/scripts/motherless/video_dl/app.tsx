import useCreateUis from '@/hooks/ui'

const selector = 'div.view-right'

function getVideoDownloadUrl(): string | null {
  const video = document.querySelector<HTMLVideoElement>('#ml-main-video_html5_api')

  if (!video) {
    console.warn('ml-vid: video element not found')
    return null
  }

  const sources = video.querySelectorAll<HTMLSourceElement>('source')

  // First, try to find 720p source
  const source720p = Array.from(sources).find((s) => s.getAttribute('res') === '720p' || s.getAttribute('label') === 'HD')

  if (source720p?.src) {
    console.log('ml-vid: found 720p source')
    return source720p.src
  }

  // Fall back to 480p source
  const source480p = Array.from(sources).find((s) => s.getAttribute('res') === '480p' || s.getAttribute('label') === 'SD')

  if (source480p?.src) {
    console.log('ml-vid: falling back to 480p source')
    return source480p.src
  }

  // If no quality-specific source found, use first available source
  if (sources.length > 0 && sources[0].src) {
    console.log('ml-vid: using first available source')
    return sources[0].src
  }

  // Last resort: use video src attribute
  if (video.src) {
    console.log('ml-vid: using video src attribute')
    return video.src
  }

  console.warn('ml-vid: no video source found')
  return null
}

function DownloadButton() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    // Wait for video element to be available
    const checkVideo = setInterval(() => {
      const url = getVideoDownloadUrl()
      if (url) {
        setDownloadUrl(url)
        clearInterval(checkVideo)
      }
    }, 500)

    // Clear interval after 10 seconds to avoid infinite checking
    const timeout = setTimeout(() => clearInterval(checkVideo), 10000)

    return () => {
      clearInterval(checkVideo)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <li>
      <a
        href='#'
        onClick={(e) => {
          e.preventDefault()
          if (downloadUrl) {
            // Extract filename from URL or use default
            const filename = downloadUrl.split('/').pop()?.split('?')[0] || 'video.mp4'
            // Download to 'abc' subfolder
            GM_download(downloadUrl, `abc/${filename}`)
          }
        }}
        title={downloadUrl ? 'Download Video' : 'Loading video...'}
        style={{
          opacity: downloadUrl ? 1 : 0.5,
          cursor: downloadUrl ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <i className='i-bx--download' style={{ marginRight: '6px' }} />
        Download
      </a>
    </li>
  )
}

export default function App() {
  useCreateUis(selector, async (element) => {
    return createShadowRootUi({
      name: 'ml-vid-download-menu',
      position: 'inline',
      anchor: element,
      append: 'first',
      onMount: (container, shadowRoot, shadowHost) => {
        shadowHost.style.display = 'contents'

        return reactRenderInShadowRoot(
          { uiContainer: container, shadow: shadowRoot, shadowHost },
          <DownloadButton />,
        )
      },
    })
  })

  return null
}
