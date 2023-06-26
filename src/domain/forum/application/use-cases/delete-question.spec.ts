import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let questionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    questionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository);
    sut = new DeleteQuestionUseCase(questionsRepository);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("question-01")
    );

    console.log(newQuestion.id)

    await questionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.questionAttachment.push(
      makeQuestionAttachment({
        questionId: new UniqueEntityId("question-01"),
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: new UniqueEntityId("question-01"),
        attachmentId: new UniqueEntityId("2"),
      })
    );

    await sut.execute({
      questionId: "question-01",
      authorId: "example-01",
    });

    expect(questionsRepository.questions).toHaveLength(0);
    expect(inMemoryQuestionAttachmentRepository.questionAttachment).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("question-01")
    );

    await questionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: "question-01",
      authorId: "example-02",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
