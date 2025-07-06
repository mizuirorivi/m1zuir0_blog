import Link from '../ui/Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import BloomFilterNixieDisplay from '@/components/analytics/BloomFilterNixieDisplay'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <BloomFilterNixieDisplay />
        </div>
      </div>
    </footer>
  )
}
