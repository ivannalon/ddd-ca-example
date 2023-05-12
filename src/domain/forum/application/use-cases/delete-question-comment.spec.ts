import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();

    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository);
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment();

    await questionCommentsRepository.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(questionCommentsRepository.questionComments).toHaveLength(0);
  });

  it("should not be able to delete another user question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId("author-01"),
    });

    await questionCommentsRepository.create(questionComment);

    await expect(() =>
      sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: "author-02",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
