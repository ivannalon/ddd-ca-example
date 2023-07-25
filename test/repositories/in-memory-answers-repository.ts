import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswerRepository {
  public answers: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentRepository
  ) {}

  async findById(answerId: string): Promise<Answer | null> {
    const answer = this.answers.find(
      (answer) => answer.id.toString() === answerId
    );

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId({ page }: PaginationParams, questionId: string) {
    const answers = this.answers
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers
  }

  async delete(answer: Answer): Promise<void> {
    const index = this.answers.findIndex((item) => item.id === answer.id);

    this.answers.splice(index, 1);

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async update(answer: Answer) {
    const index = this.answers.findIndex((item) => item.id === answer.id);

    this.answers[index] = answer;
  }

  async create(answer: Answer) {
    this.answers.push(answer);
  }
}
