import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";

let commentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments", () => {
  beforeEach(() => {
    commentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(commentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    await commentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-01") })
    );
    await commentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-01") })
    );
    await commentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-01") })
    );

    const result = await sut.execute({
      questionId: "question-01",
      page: 1,
    });

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3);
  });

  it("should be able to fetch paginanted question comments", async () => {
    for (let index = 1; index <= 22; index++) {
      await commentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId("question-01") })
      );
    }

    const result = await sut.execute({
      questionId: "question-01",
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2);
  });
});
