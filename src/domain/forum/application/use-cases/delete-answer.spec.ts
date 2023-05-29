import { DeleteAnswerUseCase } from "./delete-answer"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let answerRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(answerRepository);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("answer-01")
    );

    await answerRepository.create(newAnswer);

    await sut.execute({
      answerId: "answer-01",
      authorId: "example-01",
    });

    expect(answerRepository.answers).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("answer-01")
    );

    await answerRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "example-02",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  });
});
