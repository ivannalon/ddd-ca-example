import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let answersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Question Answers", () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(answersRepository);
  });

  it("should be able to fetch question answers", async () => {
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-01") })
    );
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-01") })
    );
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-01") })
    );

    const { answers } = await sut.execute({
      questionId: "question-01",
      page: 1,
    });

    expect(answers).toHaveLength(3);
  });

  it("should be able to fetch paginanted question answers", async () => {
    for (let index = 1; index <= 22; index++) {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId("question-01") })
      );
    }

    const { answers } = await sut.execute({
      questionId: "question-01",
      page: 2,
    });

    expect(answers).toHaveLength(2);
  });
});
