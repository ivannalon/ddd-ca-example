import { DeleteAnswerUseCase } from "./delete-answer"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let answerRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    answerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
    sut = new DeleteAnswerUseCase(answerRepository);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("answer-01")
    );

    await answerRepository.create(newAnswer);

    inMemoryAnswerAttachmentRepository.answerAttachment.push(
      makeAnswerAttachment({
        answerId: new UniqueEntityId("answer-01"),
        attachmentId: new UniqueEntityId("1"),
      }),
      makeAnswerAttachment({
        answerId: new UniqueEntityId("answer-01"),
        attachmentId: new UniqueEntityId("2"),
      })
    );


    await sut.execute({
      answerId: "answer-01",
      authorId: "example-01",
    });

    expect(answerRepository.answers).toHaveLength(0);
    expect(inMemoryAnswerAttachmentRepository.answerAttachment).toHaveLength(0);
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
