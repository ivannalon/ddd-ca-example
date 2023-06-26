import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  public questionAttachment: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    const questionAttachment = this.questionAttachment.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() === questionId
    );

    return questionAttachment;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachment = this.questionAttachment.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() !== questionId
    );

    this.questionAttachment = questionAttachment
  }
}
