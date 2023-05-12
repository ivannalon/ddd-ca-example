import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentRepository
{
  public questionComments: QuestionComment[] = [];

  async findById(questionCommentId: string) {
    const questionComment = this.questionComments.find(
      (questionComment) => questionComment.id.toString() === questionCommentId
    );

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  async findManyByQuestionId({ page }: PaginationParams, questionId: string) {
    const questionComments = this.questionComments
      .filter((questionComment) => questionComment.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.questionComments.push(questionComment);
  }

  async delete(questionComment: QuestionComment) {
    const index = this.questionComments.findIndex(
      (item) => item.id === questionComment.id
    );

    this.questionComments.splice(index, 1);
  }
}
