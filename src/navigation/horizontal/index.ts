// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    icon: HomeOutline,
    path: '/home'
  }
]

export default navigation
