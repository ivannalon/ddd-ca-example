import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

let answersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  it("should be able to create an answer", async () => {
    const result = await sut.execute({
      content: "New Response Test",
      instructorId: "instructor_01",
      questionId: "question_01",
    });

    expect(result.isRight()).toBe(true)
    expect(answersRepository.answers[0].id).toEqual(result.value?.answer.id)
  });
});
