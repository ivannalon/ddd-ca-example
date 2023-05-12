import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentRepository {
  public answerComments: AnswerComment[] = [];

  async findById(answerAnswerId: string) {
    const answerComment = this.answerComments.find(
      (answerComment) => answerComment.id.toString() === answerAnswerId
    );

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async findManyByAnswerId({ page }: PaginationParams, answerId: string) {
    const answerComments = this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments
  }

  async create(answerComment: AnswerComment) {
      this.answerComments.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const index = this.answerComments.findIndex(
      (item) => item.id === answerComment.id
    );

    this.answerComments.splice(index, 1);
  }
}
