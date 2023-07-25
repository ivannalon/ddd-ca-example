import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EditAnswerUseCase } from "./edit-answer";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let answerRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;
let newAnswer: Answer;

describe("Edit Answer", () => {
  beforeEach(async () => {
    
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
      answerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
    sut = new EditAnswerUseCase(
      answerRepository,
      inMemoryAnswerAttachmentRepository
    );

    newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("answer-01")
    );

    await answerRepository.create(newAnswer);
  });

  it("should be able to edit a answer", async () => {
    inMemoryAnswerAttachmentRepository.answerAttachment.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("2"),
      })
    );

    await sut.execute({
      answerId: "answer-01",
      authorId: "example-01",
      content: "New content",
      attachmentsIds: ["1", "3"],
    });

    expect(answerRepository.answers[0]).toMatchObject({
      content: "New content",
    });
    expect(answerRepository.answers[0].attachments.currentItems).toHaveLength(
      2
    );
  });

  it("should not be able to edit a answer from another user", async () => {
    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "example-02",
      content: "New content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
