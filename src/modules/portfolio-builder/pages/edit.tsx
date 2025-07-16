/** React Imports */
import { useState, useEffect, useMemo } from 'react'

/** MUI Imports */
import {
  Button,
  CardContent,
  CardHeader,
  Typography,
  Card,
  Grid,
  Box,
  TextField,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material'
import { useCallback } from 'react'
import { Close } from '@mui/icons-material'
import { useRouter } from 'next/router'

/** Third Party Imports */
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

/** Custom Component Imports */
import { fileToBase64 } from '../utils'
import { Uploader, Preview } from '../components'
import { IForm, IListTable } from '../types'

const DEFAULT_VALUES: IForm = {
  description: '',
  namePerson: '',
  title: '',
  portfolios: [{ description: '', endDate: null, nameCompany: '', startDate: null, nameProject: '', position: '' }]
}

const PortfolioBuilder = () => {
  /** Hooks */
  const router = useRouter()
  const idParams = (router.query?.id as string) || ''
  const dataTable = useMemo(
    (): IListTable[] => JSON.parse(window.localStorage.getItem('dataTablePortfolio') || '[]') || [],
    []
  )

  /** States */
  const [snackBarState, setSnackBarState] = useState<{ open: boolean; messages: string; variant: 'success' | 'error' }>(
    { open: false, messages: '', variant: 'success' }
  )
  const [photoProfile, setPhotoProfile] = useState<string>('')
  const [photoCover, setPhotoCover] = useState<string>('')

  /** Stores */
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<IForm>({ defaultValues: DEFAULT_VALUES })
  const { append, fields, remove } = useFieldArray({ control, name: 'portfolios' })
  const watchState = watch()

  /** Side Effects */
  useEffect(() => {
    if (idParams) {
      const dataSelected = dataTable.find(el => el.id === idParams)
      if (dataSelected) {
        setValue('description', dataSelected.description)
        setValue('namePerson', dataSelected.namePerson)
        setValue('portfolios', dataSelected.portfolios)
        setValue('title', dataSelected.title)
        setPhotoProfile(dataSelected.photoProfile)
        setPhotoCover(dataSelected.photoCover)
      }
    }
  }, [dataTable, idParams, setValue])

  /** Functions */
  const onSubmit = useCallback(
    (val: IForm) => {
      const updated = dataTable.find(el => el.id === idParams)
      const dataSubmit = {
        id: uuidv4(),
        ...val,
        photoProfile,
        photoCover
      }
      if (updated) {
        const temp = dataTable.map(el =>
          el.id === updated.id
            ? {
                id: idParams,
                description: dataSubmit.description,
                namePerson: dataSubmit.namePerson,
                photoCover,
                photoProfile,
                portfolios: dataSubmit.portfolios,
                title: dataSubmit.title
              }
            : el
        )
        window.localStorage.setItem('dataTablePortfolio', JSON.stringify(temp))
        setSnackBarState({ messages: 'Success updated data', open: true, variant: 'success' })
      } else {
        dataTable.push(dataSubmit)
        window.localStorage.setItem('dataTablePortfolio', JSON.stringify(dataTable))
        setSnackBarState({ messages: 'Success save data', open: true, variant: 'success' })
      }
    },
    [dataTable, idParams, photoCover, photoProfile]
  )

  const onHandleAddPortfolio = useCallback(() => {
    append(DEFAULT_VALUES.portfolios[0])
  }, [append])

  const onUploadPhotoProfile = useCallback(async (file: File, type: 'cover' | 'profile') => {
    const base64 = await fileToBase64(file)
    if (type === 'profile') {
      setPhotoProfile(base64)
    } else {
      setPhotoCover(base64)
    }
  }, [])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6'>Editor</Typography>
              <Button variant='contained' onClick={handleSubmit(onSubmit)}>
                Simpan Perubahan
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Background Image' />
              <CardContent>
                <Uploader onUpload={(file: File) => onUploadPhotoProfile(file, 'cover')} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Profile Image' />
              <CardContent>
                <Uploader onUpload={(file: File) => onUploadPhotoProfile(file, 'profile')} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Profile' />
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Controller
                      name='namePerson'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label='Nama' error={Boolean(errors.namePerson)} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='title'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label='Title' error={Boolean(errors.title)} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='description'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          rows={4}
                          multiline
                          fullWidth
                          label='Deskripsi'
                          error={Boolean(errors.description)}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {fields.map((el, index) => (
            <Grid item xs={12} key={el.id}>
              <Card>
                <CardHeader
                  title={`Portfolio ${index + 1}`}
                  action={
                    <IconButton disabled={fields.length === 1} onClick={() => remove(index)}>
                      <Close />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Controller
                        name={`portfolios.${index}.nameProject`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label='Nama'
                            error={Boolean(errors?.portfolios?.[index]?.nameProject)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name={`portfolios.${index}.position`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label='Posisi'
                            error={Boolean(errors?.portfolios?.[index]?.position)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name={`portfolios.${index}.nameCompany`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label='Perusahaan'
                            error={Boolean(errors?.portfolios?.[index]?.nameCompany)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Controller
                        name={`portfolios.${index}.startDate`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type='date'
                            InputLabelProps={{
                              shrink: true
                            }}
                            fullWidth
                            label='Start Date'
                            error={Boolean(errors?.portfolios?.[index]?.startDate)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Controller
                        name={`portfolios.${index}.endDate`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            disabled={!watchState.portfolios[index].startDate}
                            type='date'
                            InputProps={{
                              inputProps: {
                                min: watchState.portfolios[index].startDate
                              }
                            }}
                            fullWidth
                            label='End Date'
                            InputLabelProps={{
                              shrink: true
                            }}
                            error={Boolean(errors?.portfolios?.[index]?.endDate)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name={`portfolios.${index}.description`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            rows={4}
                            multiline
                            fullWidth
                            label='Deskripsi'
                            error={Boolean(errors?.portfolios?.[index]?.description)}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='outlined' disabled={fields.length === 10} onClick={onHandleAddPortfolio}>
                Tambah Portfolio
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' gutterBottom>
                Preview
              </Typography>
              <Button variant='outlined' onClick={() => router.back()}>
                Back to menu
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Preview dataPreview={watchState} imageProfile={photoProfile} imageCover={photoCover} />
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={snackBarState.open}
        autoHideDuration={6000}
        onClose={() => setSnackBarState({ messages: '', open: false, variant: 'success' })}
      >
        <Alert
          onClose={() => setSnackBarState({ messages: '', open: false, variant: 'success' })}
          severity={snackBarState.variant}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snackBarState.messages}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default PortfolioBuilder
