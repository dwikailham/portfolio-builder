/** MUI Imports */
import { CardContent, Typography, Card, CardMedia, Box, Avatar } from '@mui/material'

/** Third Party Imports */
import dayjs from 'dayjs'

/** Type Imports */
import { IForm } from '../../types'

type TProps = {
  dataPreview: IForm
  imageProfile: string
  imageCover: string
}

const Preview = (props: TProps) => {
  /** Props */
  const { dataPreview, imageProfile, imageCover } = props
  const { portfolios, description, namePerson, title } = dataPreview

  /** Functions */
  const formatDate = (val: string) => {
    if (val) {
      return dayjs(val).format('MMMM YYYY')
    }

    return ''
  }

  return (
    <Card>
      <CardMedia sx={{ height: 240 }} image={imageCover} title='no-preview' />
      <Avatar
        src={imageProfile}
        sx={{
          width: 160,
          height: 160,
          mx: 'auto',
          mt: -20,
          border: '2px solid white'
        }}
        alt='no-image'
      />
      <CardContent>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontWeight={'bold'}>
            {namePerson}
          </Typography>
          <Typography variant='h6' color={'#878787'} fontWeight={'bold'}>
            {title}
          </Typography>
          <Typography variant='body1' gutterBottom>
            {description}
          </Typography>
        </Box>
        <Typography variant='h6' fontWeight={'bold'} gutterBottom>
          {'Portfolio'}
        </Typography>
        {portfolios.map((el, idx) => (
          <Card sx={{ mb: 3 }} key={idx}>
            <CardContent>
              <Typography variant='h6' fontWeight={'bold'}>
                {el.position}
              </Typography>
              <Typography variant='h6' color={'#878787'}>
                {el.nameCompany}
              </Typography>
              <Typography variant='body2' gutterBottom>
                {`${formatDate(el.startDate || '')} - ${formatDate(el.endDate || '')}`}
              </Typography>
              <Typography gutterBottom>{el.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default Preview
