import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EditAnswerUseCase } from "./edit-answer";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let answerRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;
let newAnswer: Answer;

describe("Edit Answer", () => {
  beforeEach(async () => {
    answerRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(answerRepository);

    newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("answer-01")
    );

    await answerRepository.create(newAnswer);
  });

  it("should be able to edit a answer", async () => {
    await sut.execute({
      answerId: "answer-01",
      authorId: "example-01",
      content: "New content",
    });

    expect(answerRepository.answers[0]).toMatchObject({
      content: "New content",
    });
  });

  it("should not be able to edit a answer from another user", async () => {
    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "example-02",
      content: "New content",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  });
});
