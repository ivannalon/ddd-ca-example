import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

interface FetchAnswerCommentsUseCaseResponse {
  answerComments: AnswerComment[]
}

export class FetchAnswerCommentsUseCase {
  constructor(private answerRepository: AnswerCommentRepository) {}
  async execute({
    page,
    answerId
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerRepository.findManyByAnswerId({ page }, answerId);

    return { answerComments };
  }
}
