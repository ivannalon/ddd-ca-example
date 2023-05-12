import { AnswerRepository } from "../repositories/answers-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/questions-repository";

interface ChoseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

interface ChoseQuestionBestAnswerUseCaseResponse {
  question: Question;
}

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
      throw new Error("Answer not found");
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString()
    );

    if (!question) {
      throw new Error("Question not found");
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error("Not allowed");
    }

    question.bestAnswerId = answer.id;

    await this.questionRepository.update(question);

    return {
      question,
    };
  }
}
