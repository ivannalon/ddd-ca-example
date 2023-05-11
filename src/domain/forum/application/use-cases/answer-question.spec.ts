import { AnswerQuestionUseCase } from "./answer-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

let answersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  it("should be able to create an answer", async () => {
    const {answer} = await sut.execute({
      content: "New Response Test",
      instructorId: "instructor_01",
      questionId: "question_01",
    });

    expect(answer.id).toBeInstanceOf(UniqueEntityId);
    expect(answer.content).toEqual("New Response Test");
    expect(answersRepository.answers[0].id).toEqual(answer.id)
  });
});
