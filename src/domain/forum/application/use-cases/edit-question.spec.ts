import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { Question } from "../../enterprise/entities/question";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let questionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: EditQuestionUseCase;
let newQuestion: Question;

describe("Edit Question", () => {
  beforeEach(async () => {
    questionsRepository = new InMemoryQuestionsRepository();
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    sut = new EditQuestionUseCase(
      questionsRepository,
      inMemoryQuestionAttachmentRepository
    );

    newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("question-01")
    );

    await questionsRepository.create(newQuestion);
  });

  it("should be able to edit a question", async () => {
    inMemoryQuestionAttachmentRepository.questionAttachment.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      })
    );

    await sut.execute({
      authorId: "example-01",
      questionId: "question-01",
      title: "New title",
      content: "New content",
      attachmentsIds: ["1", "3"],
    });

    expect(questionsRepository.questions[0]).toMatchObject({
      title: "New title",
      content: "New content",
    });
    expect(
      questionsRepository.questions[0].attachments.currentItems
    ).toHaveLength(2);
  });

  it("should not be able to edit a question from another user", async () => {
    const result = await sut.execute({
      authorId: "example-02",
      questionId: "question-01",
      title: "New title",
      content: "New content",
      attachmentsIds: [],
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
