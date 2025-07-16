export interface IForm {
  namePerson: string
  title: string
  description: string
  portfolios: Array<{
    nameCompany: string
    position: string
    nameProject: string
    description: string
    startDate: string | null
    endDate: string | null
  }>
}

export interface IListTable extends IForm {
  id: string
  photoProfile: string
  photoCover: string
}
