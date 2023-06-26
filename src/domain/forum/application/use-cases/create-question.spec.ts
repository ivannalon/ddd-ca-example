import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachments-repository";
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

let questionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    questionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository);
    sut = new CreateQuestionUseCase(questionsRepository);
  });

  it("should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "author-01",
      title: "First Question",
      content: "Test first question",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(questionsRepository.questions[0].attachments.currentItems).toHaveLength(2);
  });
});
