/** React Imports */
import { useState, useEffect, useMemo } from 'react'

/** Next Imports */
import { useRouter } from 'next/router'

/** Third Party Imports */
import { useForm } from 'react-hook-form'

/** Custom Component Imports */
import { Preview } from '../components'
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
  const [photoProfile, setPhotoProfile] = useState<string>('')
  const [photoCover, setPhotoCover] = useState<string>('')

  /** Stores */
  const { watch, setValue } = useForm<IForm>({ defaultValues: DEFAULT_VALUES })
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

  return <Preview dataPreview={watchState} imageProfile={photoProfile} imageCover={photoCover} />
}

export default PortfolioBuilder
