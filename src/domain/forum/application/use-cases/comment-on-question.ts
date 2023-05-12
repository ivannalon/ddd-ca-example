import { QuestionRepository } from "../repositories/questions-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comments-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

interface CommentOnQuestionUseCaseResponse {
  questionComment: QuestionComment;
}

export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentRepository
  ) {}
  async execute({
    questionId,
    content,
    authorId,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const questionComment = QuestionComment.create({
        authorId: new UniqueEntityId(authorId),
        questionId: question.id,
        content
    })

    await this.questionCommentRepository.create(questionComment)

    return {
        questionComment
    }
  }
}
