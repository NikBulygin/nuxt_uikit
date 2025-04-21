import { WagonData } from '@prisma/client'

export interface ApiResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
}

export interface WagonDataResponse extends ApiResponse<WagonData> {}

export interface WagonDataFilters {
  startDate?: string
  endDate?: string
  invoiceNumber?: string
  gtdNumber?: string
  page?: number
  perPage?: number
}

export interface WagonDataInput extends Omit<WagonData, 'id' | 'createdAt' | 'updatedAt'> {}

export interface WagonDataUpdate extends WagonDataInput {
  id: number
} 