import dayjs, { ManipulateType } from 'dayjs'

export const sumDate = (
  date: string | Date,
  addition: number,
  unit: ManipulateType,
) => {
  return dayjs(date).add(addition, unit).toDate()
}
