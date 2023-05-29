import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let commentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    commentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(commentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    await commentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId("answer-01") })
    );
    await commentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId("answer-01") })
    );
    await commentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId("answer-01") })
    );

    const result = await await sut.execute({
      answerId: "answer-01",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(3);
  });

  it("should be able to fetch paginanted answer comments", async () => {
    for (let index = 1; index <= 22; index++) {
      await commentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId("answer-01") })
      );
    }

    const result = await sut.execute({
      answerId: "answer-01",
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2);
  });
});
