import { PaginationParams } from "@/core/repositories/pagination-params"
import { Question } from "../../enterprise/entities/question" 

export interface QuestionRepository {
  findById(questionId: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  create(question: Question): Promise<void>
  update(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
