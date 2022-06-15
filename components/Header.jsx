import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = () => {
  const router = useRouter()

  const isActive = (pathname) => router.pathname === pathname

  return(
    <>
    </>
  )
}

export default Header
