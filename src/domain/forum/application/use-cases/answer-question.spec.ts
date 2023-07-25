import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let answersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    answersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  it("should be able to create an answer", async () => {
    const result = await sut.execute({
      content: "New Response Test",
      instructorId: "instructor_01",
      questionId: "question_01",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(answersRepository.answers[0].attachments.currentItems).toHaveLength(
      2
    );
  });
});
