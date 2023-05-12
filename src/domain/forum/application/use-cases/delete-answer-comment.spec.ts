import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment", () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();

    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository);
  });

  it("should be able to delete a answer comment", async () => {
    const answerComment = makeAnswerComment();

    await answerCommentsRepository.create(answerComment);

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(answerCommentsRepository.answerComments).toHaveLength(0);
  });

  it("should not be able to delete another user answer comment", async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId("author-01"),
    });

    await answerCommentsRepository.create(answerComment);

    await expect(() =>
      sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: "author-02",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
