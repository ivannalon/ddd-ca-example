import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswerRepository {
  findById(answerId: string): Promise<Answer | null>
  findManyByQuestionId(params: PaginationParams, questionId: string): Promise<Answer[]>
  create(answer: Answer): Promise<void>
  update(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}
