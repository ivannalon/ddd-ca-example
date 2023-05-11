import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

let questionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(questionsRepository);
  });

  it("should be able to create a question", async () => {
    const { question } = await sut.execute({
      authorId: "author-01",
      title: "First Question",
      content: "Test first question",
    });

    expect(question.id).toBeInstanceOf(UniqueEntityId);
    expect(question.content).toEqual("Test first question");
    expect(question.slug.value).toEqual("first-question");
    expect(questionsRepository.questions[0].id).toEqual(question.id);
  });
});
