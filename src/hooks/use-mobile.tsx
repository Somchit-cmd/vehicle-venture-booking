
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkMobile()
      setInitialized(true)
      
      // Set up event listener
      window.addEventListener('resize', checkMobile)
      
      // Clean up
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Returns false during server-side rendering
  return initialized ? isMobile : false
}
