import { AnswerRepository } from "../repositories/answers-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

interface CommentOnAnswerUseCaseResponse {
  answerComment: AnswerComment;
}

export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerCommentRepository: AnswerCommentRepository
  ) {}
  async execute({
    answerId,
    content,
    authorId,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    const answerComment = AnswerComment.create({
        authorId: new UniqueEntityId(authorId),
        answerId: answer.id,
        content
    })

    await this.answerCommentRepository.create(answerComment)

    return {
        answerComment
    }
  }
}
