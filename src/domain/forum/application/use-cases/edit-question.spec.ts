import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { Question } from "../../enterprise/entities/question";
import { NotAllowedError } from "./errors/not-allowed-error";

let questionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;
let newQuestion: Question;

describe("Edit Question", () => {
  beforeEach(async () => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(questionsRepository);

    newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("example-01") },
      new UniqueEntityId("question-01")
    );

    await questionsRepository.create(newQuestion);
  });

  it("should be able to edit a question", async () => {
    await sut.execute({
      authorId: "example-01",
      questionId: "question-01",
      title: "New title",
      content: "New content",
    });

    expect(questionsRepository.questions[0]).toMatchObject({
      title: "New title",
      content: "New content",
    });
  });

  it("should not be able to edit a question from another user", async () => {
    const result = await sut.execute({
      authorId: "example-02",
      questionId: "question-01",
      title: "New title",
      content: "New content",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
