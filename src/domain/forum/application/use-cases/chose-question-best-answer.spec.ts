import { ChoseQuestionBestAnswerUseCase } from "./chose-question-best-aswer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let questionRepository: InMemoryQuestionsRepository;
let answerRepository: InMemoryAnswersRepository;
let sut: ChoseQuestionBestAnswerUseCase;

describe("Chose Question Best Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    questionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );
    answerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository
    );
    sut = new ChoseQuestionBestAnswerUseCase(
      questionRepository,
      answerRepository
    );
  });

  it("should be able to chose the question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    await questionRepository.create(question);
    await answerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(questionRepository.questions[0].bestAnswerId).toEqual(answer.id);
  });

  it("should not be able to chose another user question answer", async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId("example-01"),
    });
    const answer = makeAnswer({ questionId: question.id });

    await questionRepository.create(question);
    await answerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "example-02",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
