import { ChoseQuestionBestAnswerUseCase } from "./chose-question-best-aswer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";

let questionRepository: InMemoryQuestionsRepository;
let answerRepository: InMemoryAnswersRepository;
let sut: ChoseQuestionBestAnswerUseCase;

describe("Chose Question Best Answer", () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository();
    answerRepository = new InMemoryAnswersRepository();
    sut = new ChoseQuestionBestAnswerUseCase(
      questionRepository,
      answerRepository
    );
  });

  it("should be able to chose the question best answer", async () => {
    const question = makeQuestion()
    const answer = makeAnswer({questionId: question.id})

    await questionRepository.create(question);
    await answerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(questionRepository.questions[0].bestAnswerId).toEqual(answer.id)
  });

  it("should not be able to chose another user question answer", async () => {
    const question = makeQuestion({authorId: new UniqueEntityId("example-01")})
    const answer = makeAnswer({questionId: question.id})

    await questionRepository.create(question);
    await answerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    await expect(() =>
      sut.execute({
        answerId: "answer-01",
        authorId: "example-02",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
