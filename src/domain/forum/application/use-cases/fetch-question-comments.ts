import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comments-repository";

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

interface FetchQuestionCommentsUseCaseResponse {
  questionComments: QuestionComment[]
}

export class FetchQuestionCommentsUseCase {
  constructor(private questionRepository: QuestionCommentRepository) {}
  async execute({
    page,
    questionId
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionRepository.findManyByQuestionId({ page }, questionId);

    return { questionComments };
  }
}
