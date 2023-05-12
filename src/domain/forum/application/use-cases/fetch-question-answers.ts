import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string;
  page: number;
}

interface FetchQuestionAnswersUseCaseResponse {
  answers: Answer[];
}

export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}
  async execute({
    page,
    questionId
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findManyByQuestionId({ page }, questionId);

    return { answers };
  }
}
