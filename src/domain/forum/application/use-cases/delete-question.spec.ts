import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let questionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(questionsRepository);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("question-01")
    );

    await questionsRepository.create(newQuestion);

    await sut.execute({
      questionId: "question-01",
      authorId: "example-01",
    });

    expect(questionsRepository.questions).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("question-01")
    );

    await questionsRepository.create(newQuestion);

    await expect(() =>
      sut.execute({
        questionId: "question-01",
        authorId: "example-02",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
