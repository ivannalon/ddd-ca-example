import { AnswerRepository } from "../repositories/answers-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/questions-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface ChoseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChoseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChoseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answersRepository: AnswerRepository
  ) {}
  async execute({
    answerId,
    authorId,
  }: ChoseQuestionBestAnswerUseCaseRequest): Promise<ChoseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString()
    );

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id;

    await this.questionRepository.update(question);

    return right({
      question,
    });
  }
}
