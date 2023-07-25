import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  public answerAttachment: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string) {
    const answerAttachment = this.answerAttachment.filter(
      (answerAttachment) =>
        answerAttachment.answerId.toString() === answerId
    );

    return answerAttachment;
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachment = this.answerAttachment.filter(
      (answerAttachment) =>
        answerAttachment.answerId.toString() !== answerId
    );

    this.answerAttachment = answerAttachment
  }
}
